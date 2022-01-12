import React from "react";
import { FileEditor } from "../../models/models";
import { AppContext } from "../../store/AppProvider";
import { LocalStorage } from "../../store/LocalStorage";

import './AppMenu.scss';

export const AppMenu = () => {

  const { state, dispatch } = React.useContext(AppContext);
  const editor: FileEditor = state.files;
  const selected = state.selected;

  const setSelected = (selected: string) => dispatch({ ...state, selected });
  const deleteFile = (key: string) => dispatch({ ...state, files: { ...state.files, [key]: undefined } });

  const newFile = () => {
    const key = 'unnamed';
    dispatch({ ...state, files: { ...editor, files: { ...editor.files, [key]: { values: [] } } } });
  }

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
    const copyValue = editor.files[currentKeyEdit.currentKey];
    const fileEditor = { 
      ...state, 
      files: { 
        ...editor, 
        files: {
          ...editor.files, 
          [currentKeyEdit.value]: copyValue,
          [currentKeyEdit.currentKey]: undefined,
        },
      }
    };
    dispatch(fileEditor);
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
    dispatch({ ...state, files: {
      languages: editor.languages,
      project: name,
      files: editor.files,
    }});
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
        Object.keys(editor.files || {}).filter(f => editor.files[f] !== undefined).map((key) => (
          <div 
            className={`file ${selected === key ? 'selected' : ''}`} 
            key={key}>
            <span 
                className='file-left'
                onClick={() => setSelected(key)}>
              <span className='file-type'>{'{}'}</span>
              <input 
                type='text' 
                className='filename input-inlined'
                onBlur={saveFilename}
                onChange={e => onChangeFilename(key, e.target.value)}
                value={currentKeyEdit.currentKey === key ? currentKeyEdit.value : key} />
            </span>
            <span className='file-action' onClick={() => deleteFile(key)}>&#x2715;</span>
          </div>))
      }
    </div>
  </div>)
};
