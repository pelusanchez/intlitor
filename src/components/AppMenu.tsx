import React from "react";
import { FileEditor } from "../models/models";
import { AppContext } from "../store/AppProvider";

import './AppMenu.scss';

export const AppMenu = () => {

  const { state, dispatch } = React.useContext(AppContext);
  const files = state.files;
  
  const setSelected = (selected: string) => {
    dispatch({ ...state, selected });
  }
  
  const setLocales = (data: FileEditor) => {
    dispatch({ ...state, files: data });
  }
  
  return (<div className="app-menu">
    <div className='files-container'>
      {
        Object.keys(files).map((key) => (
        <div className='file' key={key} onClick={() => setSelected(key)}>
          <span className='file-type'>{'{}'}</span>{key}
        </div>))
      }
    </div>
  </div>)
};
