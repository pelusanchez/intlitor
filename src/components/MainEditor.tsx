import React from "react";
import { FileEditor } from "../models/models";
import { AppContext } from "../store/AppProvider";
import { LocalStorage } from "../store/LocalStorage";
import { TranslateService } from "../services/translate.service";
import { StringUtils } from "../utils/string.utils";

import './MainEditor.scss';
import { VisualInput } from "./VisualInput";
import { AppMenu } from "./AppMenu";
import { List } from "./List";
import { useLocales } from "../services/locale.service";

export const MainEditor = () => {

  const translateService = new TranslateService();

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

  const selected = state.selected;
  const files = state.files;
  const target = state.target;

  const autoTranslate = async (key: string) => {
    const value = files[selected!][key].input;
    const translated = await translateService.translate(value);
    updateTranslateKey(key, StringUtils.firstUppercase(translated.translatedText));
  }

  const updateTranslateKey = (key: string, value: string) => {
    files[selected!][key].translated = value;
    setLocales({ ...files });
  };

  const { locales } = useLocales();

  const onChangeLocale = (t: "source" | "target") => {
    return (opt: { value: string; label: string }) => {
      const nextState = { ...state };
      nextState.translationInfo.selected[t] = opt.value;
      dispatch(nextState);
    }
  }

  return (<main className="main-editor">
    <AppMenu />
    <div className='container'>
      <div className='editor-table'>
        <div className='table-headers'>
          <div className='header header-key'>Key</div>
          <div className='header header-value'>
            <List 
              onChange={onChangeLocale("source")}
              value={
                locales.find(s => 
                  s.value == state.translationInfo.selected.source)}
              options={locales} />
          </div>
          <div className='header header-value'>
            <List 
              onChange={onChangeLocale("target")}
              value={
                locales.find(s => 
                  s.value == state.translationInfo.selected.target)}
              options={locales} /></div>
        </div>
        <div className='table-body'>
          {
            selected && Object.entries(files[selected])
              .map((entry, i) => (
                <div className={`table-row ${i % 2 == 0 ? 'even' : 'odd'}`} key={entry[0]}>
                  <div className='value table-key'><KeyAndPrefix value={entry[0]} /></div>
                  <div className='value table-value'>
                    <VisualInput
                      value={entry[1].input || ""} />
                    <VisualInput
                      onChange={(v) => { updateTranslateKey(entry[0], v) }}
                      value={entry[1].translated || ""} />

                  </div>
                  <div className='value table-value'>
                  </div>

                  <div>
                    <button
                      onClick={() => autoTranslate(entry[0])}>Auto-translate</button>
                    <button
                      onClick={() => updateTranslateKey(entry[0], entry[1].input)}>Same</button>
                  </div>
                </div>))
          }
        </div>
      </div>
    </div>
  </main>);
}

const KeyAndPrefix = ({ value }: { value: string }) => {
  const lastDot = value.lastIndexOf(".");
  let prefix = (lastDot < 0) ? '' : value.substring(0, lastDot);
  let last = (lastDot < 0) ? value : value.substring(lastDot);
  return <>
    <span className='prefix'>{prefix}</span>
    {last}
  </>
}
