import React from "react";
import { FileEditor, I18NMessage } from "../models/models";
import { AppContext } from "../store/AppProvider";
import { LocalStorage } from "../store/LocalStorage";
import { TranslateService } from "../services/translate.service";
import { StringUtils } from "../utils/string.utils";
import { VisualInput } from "./VisualInput";
import { List } from "./List";
import { useLocales } from "../services/locale.service";
import { AddIcon, SwapIcon, TranslateIcon } from "./icons/icons";

export const EditorTable = () => {

  const translateService = new TranslateService();

  const { state, dispatch } = React.useContext(AppContext);
  const [ currentKeyUpdate, setCurrentKeyUpdate ] = React.useState({ key: '', value: '' });

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
  const selectedLanguages = state.translationInfo.selected;
  const project = state.files;

  const findByKey = (key: string): I18NMessage | undefined => {
    if (!selected) {
      return undefined;
    }
    return project.files[selected]?.values.find(m => m.key === key);
  }

  const updateByKey = (key: string, newValue: I18NMessage): I18NMessage | undefined => {
    if (!selected) {
      return undefined;
    }
    const nextValues = project.files[selected]!.values.map(m => { 
      if (m.key === key) {
        return newValue;
      }
      return m;
    });
    const nextFiles = { ...project.files,
      [selected!]: {
        values: nextValues,
     } };
    setLocales({ ...project, files: { ...project.files, ...nextFiles } });
  }

  const autoTranslate = async (key: string) => {
    const message = findByKey(key);
    if (!message) {
      return;
    }
    const value = message[selectedLanguages.source];
    const translated = await translateService.translate(value);
    updateTranslateKey(key, selectedLanguages.target, StringUtils.firstUppercase(translated.translatedText));
  }

  const updateTranslateKey = (key: string, locale: string, value: string) => {

    const message = findByKey(key);
    if (!message) {
      return;
    }

    updateByKey(key, { ...message, [locale]: value });
  };

  const updateKey = (key: string, nextValue: string) => {
    if (currentKeyUpdate.key !== key && currentKeyUpdate.key !== currentKeyUpdate.value) {
      /* Do update */
      const nextUpdate = project.files[selected!]!.values.map(m => {
        if (m.key === currentKeyUpdate.key) {
          return { ...m, key: currentKeyUpdate.value };
        }
        return m;
      });
      setLocales({ ...project, files: { ...project.files, [selected!]: { values: nextUpdate } } });
    }
    setCurrentKeyUpdate({key: key, value: nextValue});
  };

  const addEntry = (): void => {
    const DEFAULT_KEY = ' ';
    if (!selected) {
      return;
    }

    const message = findByKey(DEFAULT_KEY);
    if (message) {
      return;
    }

    const nextSelected = [{ key: DEFAULT_KEY },   ...project.files[selected]!.values];
    setLocales({ ...project, files: { ...project.files, [selected]: { values: nextSelected }} });
  }

  const { locales } = useLocales();

  const projectLanguages = React.useMemo(() => {
    return locales.filter(l => state.files.languages?.includes(l.value));
  }, [ state.files.languages, locales ]);

  const onChangeLocale = (t: "source" | "target"): any => {
    return (opt: { value: string; label: string }) => {
      const nextState = { ...state };
      nextState.translationInfo.selected[t] = opt.value;
      dispatch(nextState);
    }
  }
  
  return (<div className='editor-table'>
        <div className='table-headers'>
          <div className='header header-key'>Key</div>
          <div className='header header-value'>
            <List 
              onChange={onChangeLocale("source")}
              value={
                locales.find(s => 
                  s.value == selectedLanguages.source)}
              options={projectLanguages} />
          </div>
          <div className='header header-value'>
            <List 
              onChange={onChangeLocale("target")}
              value={
                locales.find(s => 
                  s.value == selectedLanguages.target)}
              options={projectLanguages} />
          </div>

          <div className='header header-value'>
              <button
                onClick={() => addEntry()}><AddIcon /></button>            
          </div>
        </div>
        <div className='table-body'>
          {
            selected && project.files[selected] !== undefined && project.files[selected]!.values
              .map((entry, i) => (
                <div className={`table-row ${i % 2 == 0 ? 'even' : 'odd'}`} key={entry.key}>
                  <div className='value table-key'>
                    <VisualInput
                      onChange={(v) => { updateKey(entry.key, v) }}
                      value={currentKeyUpdate.key === entry.key ? currentKeyUpdate.value : entry.key} />
                  </div>
                  <div className='value table-value'>
                    <VisualInput
                      onChange={(v) => { updateTranslateKey(entry.key, selectedLanguages.source, v) }}
                      value={entry[selectedLanguages.source] || ""} />

                  </div>
                  <div className='value table-value'>
                    <VisualInput
                      onChange={(v) => { updateTranslateKey(entry.key, selectedLanguages.target, v) }}
                      value={entry[selectedLanguages.target] || ""} />
                  </div>

                  <div>
                    <button
                      onClick={() => autoTranslate(entry.key)}>
                        <TranslateIcon />
                    </button>
                    <button
                      onClick={() => 
                      updateTranslateKey(entry.key, selectedLanguages.target, entry[selectedLanguages.source])}>
                        <SwapIcon />
                    </button>
                  </div>
                </div>))
          }
        </div>
      </div>
    )
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
