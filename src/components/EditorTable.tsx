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
  const [currentKeyUpdate, setCurrentKeyUpdate] = React.useState({ key: '', value: '' });

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

  const selected = state.selected;
  const selectedLanguages = state.translationInfo.selected;
  const project = state.editor;

  const fileSelected = React.useMemo(() => project.files.find(f => f.filename === selected), [selected, project.files]);

  const findByKey = (key: string): I18NMessage | undefined => {
    return fileSelected?.values.find(m => m.key === key);
  }

  const updateByKey = (key: string, newValue: I18NMessage): I18NMessage | undefined => {
    if (!fileSelected) {
      return undefined;
    }
    const nextValues = fileSelected.values.map(m => {
      if (m.key === key) {
        return newValue;
      }
      return m;
    });
    const nextFiles = [
      ...project.files.map(f => {
        if (f.filename === fileSelected.filename) {
          return {
            ...f,
            values: nextValues,
          };
        }
        return f;
      })
    ];
    const nextEditor = { 
      ...project, 
      files: [
        ...nextFiles
       ],
    };
    setEditor(nextEditor);
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

  const doUpdateKey = () => {
    /* Do update */
    const nextUpdate = fileSelected!.values.map(m => {
      if (m.key === currentKeyUpdate.key) {
        return { ...m, key: currentKeyUpdate.value };
      }
      return m;
    });
    const nextEditor: FileEditor = {
      ...project,
      files: [
        ...project.files.map(f => {
          if (f.filename === selected) {
            return { ...f, values: nextUpdate };
          }
          return f;
        })
      ],
    }
    setEditor(nextEditor);
  };

  const updateKey = (key: string, nextValue: string) => {
    if (currentKeyUpdate.key !== key && currentKeyUpdate.key !== currentKeyUpdate.value) {
      doUpdateKey();
    }
    setCurrentKeyUpdate({ key: key, value: nextValue });
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

    const nextSelected = [{ key: DEFAULT_KEY }, ...fileSelected!.values];
    const nextEditor: FileEditor = {
      ...project,
      files: [
        ...project.files.map(f => {
          if (f.filename === selected) {
            return { ...f, values: nextSelected };
          }
          return f;
        })
      ],
    };
    setEditor(nextEditor);
  }

  const { locales } = useLocales();

  const projectLanguages = React.useMemo(() => {
    return locales.filter(l => state.editor.languages?.includes(l.value));
  }, [state.editor.languages, locales]);

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
        selected && fileSelected !== undefined && fileSelected.values
          .map((entry, i) => (
            <div className={`table-row ${i % 2 == 0 ? 'even' : 'odd'}`} key={entry.key}>
              <div className='value table-key'>
                <VisualInput
                  onBlur={() => doUpdateKey()}
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
