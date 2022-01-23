import React from "react";
import { FileEditor } from "../../models/models";
import { AppContext } from "../../store/AppProvider";
import { LocalStorage } from "../../store/LocalStorage";
import { undefinedSafe } from "../../utils/NullSage";

import './AppMenu.scss';

export const AppMenu = () => {

  const { state, dispatch } = React.useContext(AppContext);
  const editor: FileEditor = state.editor;
  const selected = state.selected;

  const setSelected = (selected: string) => dispatch({ ...state, selected });
  const deleteFile = (key: string) => {
    dispatch({ 
      ...state, 
      editor: { 
        ...state.editor, 
        files: [
          ...state.editor.files.filter(f => f.filename !== key)
        ]
      }
    });
  }

  const generateFileName = () => {
    const key = 'unnamed';
    const extension = 'json';
    const fileNames = editor.files?.filter(
      f => f.filename.startsWith(key)) || [];
    const next = fileNames.length + 1;
    return `${key}-${next}.${extension}`;
  };

  const newFile = () => {
    const key = generateFileName();
    dispatch({ 
      ...state, 
      editor: { 
        ...editor, files: [
          ...undefinedSafe(editor.files, []), 
          {
            filename: key,
            values: [],
          }
        ]
      } 
    });
  };

  /* 
    Use for editing text without updating
    directly 
  */
  const [currentKeyEdit, setCurrentKeyEdit] = React.useState({
    currentKey: undefined as string | undefined,
    value: '',
  });

  const doEdit = (key: string, value?: string) => {
    const currentText = value === undefined ? key : value;
    setCurrentKeyEdit({
      currentKey: key,
      value: currentText,
    });
  }

  const saveFilename = () => {
    /* Swap key */
    if (!currentKeyEdit.currentKey) {
      return;
    }

    if (currentKeyEdit.value.trim().length === 0) {
      return;
    }
    
    if (editor.files.find(f => f.filename === currentKeyEdit.value)) {
      // Filename already exists...
      return;
    };
    
    const nextFiles = { 
      ...state, 
      editor: { 
        ...state.editor, 
        files: [
          ...state.editor.files.map(f => {
            if (f.filename === currentKeyEdit.currentKey) {
              return {
                ...f,
                filename: currentKeyEdit.value,
              }
            }
            return f;
          })
        ]
      }
    };
    LocalStorage.save(nextFiles.editor);
    dispatch(nextFiles);
  }
  
  const onChangeFilename = (key: string, value: string) => {
    if (currentKeyEdit.currentKey === undefined) {
      return doEdit(key, value);
    }
    
    if (currentKeyEdit.currentKey === key) {
      return doEdit(key, value);
    }

    // Not same key... Begin new edition...
    saveFilename();
    doEdit(key, value);
  }

  const updateProjectName = (name: string) => {
    dispatch({ 
      ...state, 
      editor: {
        languages: editor.languages,
        project: name,
        files: editor.files,
      }
    });
  }

  return (<div className="app-menu">
    <div className='project-name'>
      <input
        type='text'
        className='project-name-input input-inlined'
        value={editor.project}
        onChange={({ target }) => updateProjectName(target.value)}
        placeholder='Project name...' />
    </div>
    <div className='files-container'>
      <div className='files-title'>
        <span className='files-title-text'>Files</span>
        <span className='files-new' onClick={newFile}>+</span>
      </div>
      {
        editor.files?.filter(f => f !== undefined).map((file) => (
          <div 
            className={`file ${selected === file.filename ? 'selected' : ''}`} 
            key={file.filename}>
            <span 
                className='file-left'
                onClick={() => setSelected(file.filename)}>
              <span className='file-type'>{'{}'}</span>
              <input 
                type='text' 
                className='filename input-inlined'
                onBlur={saveFilename}
                onChange={e => onChangeFilename(file.filename, e.target.value)}
                value={currentKeyEdit.currentKey === file.filename ? currentKeyEdit.value : file.filename} />
            </span>
            <span className='file-action' onClick={() => deleteFile(file.filename)}>&#x2715;</span>
          </div>))
      }
    </div>
  </div>)
};
