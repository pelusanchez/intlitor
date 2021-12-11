import React from "react";
import { FileEditor } from "../models/models";
import { AppContext } from "../store/AppProvider";
import { LocalStorage } from "../store/LocalStorage";

import './AppMenu.scss';

export const AppMenu = () => {

  const { state, dispatch } = React.useContext(AppContext);
  const files = state.files;
  
  const setSelected = (selected: string) => {
    dispatch({ ...state, selected });
  }
  
  const deleteFile = (key: string) => {
    const fileEditor = { ...state, files: { ...state.files, [key]: undefined } };
    dispatch(fileEditor);
  }
  
  return (<div className="app-menu">
    <div className='files-container'>
      {
        Object.keys(files).filter(f => files[f] !== undefined).map((key) => (
        <div className='file' key={key}>
          <span className='file-left' onClick={() => setSelected(key)}>
            <span className='file-type'>{'{}'}</span>
              {key}
              </span>
          <span className='file-action' onClick={() => deleteFile(key)}>&#x2715;</span>
        </div>))
      }
    </div>
  </div>)
};
