import React from 'react';
import { FileEditor } from '../models/models';
import { AppContext } from '../store/AppProvider';
import { LocalStorage } from '../store/LocalStorage';
import { JsonUtil } from '../utils/json.utils';
import { ZipUtils } from '../utils/zip.utils';
import { FileUploadIcon, FileDownloadIcon, SaveIcon } from './icons/icons';
import './TopHeader.scss';

export const TopHeader = () => {

  const inputRef = React.useRef<HTMLInputElement>(null);

  const { state, dispatch } = React.useContext(AppContext);

  React.useEffect(() => {
    const exists = LocalStorage.read();
    if (exists !== null) {
      dispatch({ ...state, files: exists, selected: "" });
    }
  }, []);

  const setLocales = (data: FileEditor) => {
    LocalStorage.save(data);
    dispatch({ ...state, files: data });
  }

  const files = state.files;

  const loadJson = (file: File) => {
    if (files[file.name]) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const flat = JsonUtil.flatten(JSON.parse(e.target.result), state.translationInfo.source);
      const nextFiles = { ...files, [file.name]: flat };
      setLocales(nextFiles);
      LocalStorage.save(nextFiles);
    };
    reader.readAsText(file);
  };

  const save = async (language: string) => {
    const result = JsonUtil.deflatten(files, language);
    ZipUtils.zipFiles(result)
  }

  const saveProject = (): void => {
    ZipUtils.zipProject(files);
  }
  return (
    <div className='top-header'>
      <div className='title'>
        <h1>Inlitor</h1>
      </div>
      <div className='button-container'>
        <button className='action-icon' onClick={() => inputRef.current?.click()}><FileUploadIcon /> Open</button>
        <button className='action-icon' onClick={() => save('en')}><FileDownloadIcon /> Save</button>
        <input type='file' ref={inputRef} onChange={(e) => loadJson((e.target.files as any)[0])} style={ { display: "none" } } />
      </div>
    </div>)
}
