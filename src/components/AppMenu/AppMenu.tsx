import React from "react";
import { FileEditor } from "../../models/models";
import { AppContext } from "../../store/AppProvider";
import { LocalStorage } from "../../store/LocalStorage";

import './AppMenu.scss';

export const AppMenu = () => {

  const { state, dispatch } = React.useContext(AppContext);
  const files = state.files;

  const setSelected = (selected: string) => dispatch({ ...state, selected });
  const deleteFile = (key: string) => dispatch({ ...state, files: { ...state.files, [key]: undefined } });

  const newFile = () => {
    const key = 'unnamed';
    dispatch({ ...state, files: { ...state.files, [key]: { values: [] } } });
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
    setCurrentKeyEdit({
      currentKey: key,
      value: value || key,
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
    const copyValue = state.files[currentKeyEdit.currentKey];
    const fileEditor = { 
      ...state, 
      files: { 
        ...state.files, 
        [currentKeyEdit.value]: copyValue,
        [currentKeyEdit.currentKey]: undefined,
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

  return (<div className="app-menu">
    <div className='project-name'>
      
      <input
        type='text'
        className='project-name-input input-inlined'
        placeholder='Project name...' />
    </div>
    <div className='files-container'>
      <div className='files-title'>
        <span className='files-title-text'>Files</span>
        <span className='files-new' onClick={newFile}>+</span>
      </div>
      {
        Object.keys(files).filter(f => files[f] !== undefined).map((key) => (
          <div className='file' key={key}>
            <span className='file-left' onClick={() => setSelected(key)}>
              <span className='file-type'>{'{}'}</span>
              <input 
                type='text' 
                className='filename input-inlined'
                onChange={e => onChangeFilename(key, e.target.value)}
                value={currentKeyEdit.currentKey === key ? currentKeyEdit.value : key} />
            </span>
            <span className='file-action' onClick={() => deleteFile(key)}>&#x2715;</span>
          </div>))
      }
    </div>
  </div>)
};
