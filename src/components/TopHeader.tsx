import React from 'react';
import { FileEditor } from '../models/models';
import { AppContext } from '../store/AppProvider';
import { LocalStorage } from '../store/LocalStorage';
import { JsonUtil } from '../utils/json.utils';
import { ZipUtils } from '../utils/zip.utils';
import { FileUploadIcon, FileDownloadIcon, LanguageIcon } from './icons/icons';
import { LanguageModal } from './LanguageModal';
import './TopHeader.scss';

export const TopHeader = () => {

  const inputRef = React.useRef<HTMLInputElement>(null);

  const { state, dispatch } = React.useContext(AppContext);

  const [ languageModal, setLanguageModal ] = React.useState(false);

  React.useEffect(() => {
    const exists = LocalStorage.read();
    if (exists !== null) {
      dispatch({ ...state, editor: exists, selected: "" });
    }
  }, []);

  const setEditor = (data: FileEditor) => {
    LocalStorage.save(data);
    dispatch({ ...state, editor: data });
  }

  const fileEditor: FileEditor = state.editor;

  const loadJson = (file: File) => {
    if (fileEditor.files.find(f => file.name === f.filename)) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const newFile = JsonUtil.flatten(
        JSON.parse(e.target.result), 
        state.translationInfo.source,
        file.name);
      const nextFiles = [ ...fileEditor.files, newFile ];
      setEditor({ ...fileEditor, files: nextFiles });
      LocalStorage.save({ ...fileEditor, files: nextFiles });
    };
    reader.readAsText(file);
  };

  const saveProject = (): void => {
    ZipUtils.zipProject(fileEditor);
  }

  return (
    <div className='top-header'>

      { languageModal && <LanguageModal onSave={() => setLanguageModal(false) } />}
      
      <div className='title'>
        <h1>Inlitor</h1>
      </div>
      <div className='button-container'>
      <button className='action-icon' onClick={() => setLanguageModal(true)}><LanguageIcon /> Locales</button>
        <button className='action-icon' onClick={() => inputRef.current?.click()}><FileUploadIcon /> Open</button>
        <button className='action-icon' onClick={() => saveProject()}><FileDownloadIcon /> Save</button>
        <input type='file' ref={inputRef} onChange={(e) => loadJson((e.target.files as any)[0])} style={ { display: "none" } } />
      </div>
    </div>)
}

