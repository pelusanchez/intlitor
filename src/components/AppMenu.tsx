import React from "react";
import { FileEditor } from "../models/models";
import { AppContext } from "../store/AppProvider";
import { LocalStorage } from "../store/LocalStorage";
import { JsonUtil } from "../utils/json.utils";
import { ZipUtils } from "../utils/zip.utils";

import './AppMenu.scss';

export const AppMenu = () => {

  const inputRef = React.useRef<HTMLInputElement>(null);

  const { state, dispatch } = React.useContext(AppContext);
  const files = state.files;
  
  const setSelected = (selected: string) => {
    dispatch({ ...state, selected });
  }
  
  const setLocales = (data: FileEditor) => {
    dispatch({ ...state, files: data });
  }

  const loadJson = (file: File) => {
    if (files[file.name]) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const flat = JsonUtil.flatten(JSON.parse(e.target.result));
      const nextFiles = { ...files, [file.name]: flat };
      setLocales(nextFiles);
      LocalStorage.save(nextFiles);
    };
    reader.readAsText(file);
  };

  const save = async (language: string, translated: boolean) => {
    const result = JsonUtil.deflatten(files, language, translated);
    ZipUtils.zipFiles(result)
  }

  const saveProject = (): void => {
    ZipUtils.zipProject(files);
  }
  
  return (<div className="app-menu">
    <div className='button-container'>
      <button onClick={() => inputRef.current?.click()}>Open</button>
      <button onClick={() => save('en', true)}>Save translation</button>
      <button onClick={() => saveProject()}>Save project</button>
    </div>
    <div className='files-container'>
      <input type='file' ref={inputRef} onChange={(e) => loadJson((e.target.files as any)[0])} style={ { display: "none" } } />
      {
        Object.keys(files).map((key) => (
        <div className='file' key={key} onClick={() => setSelected(key)}>{key}</div>))
      }
    </div>
  </div>)
};
