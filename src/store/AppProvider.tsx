import React from "react";
import { EditorState, TranslationInfo } from '../models/models';
import { LocalStorage } from "./LocalStorage";

const defaultTranslationInfo: TranslationInfo = {
  source: "es",
  targets: [ "en" ],
  selected: {
    source: "es",
    target: "en",
  }
};

const defaultState = {
  target: "en",         // Current locale 
  key: undefined,
  translationInfo: defaultTranslationInfo,
  files: {},
  selected: "",
} as EditorState;

export const AppContext = React.createContext({
  state: defaultState,
  dispatch: (newData: EditorState) => { },
});

export const reducer = (state: EditorState, newData: EditorState): EditorState => {

  const data = {
    ...state,
    ...newData,
  };
  LocalStorage.save(data.files);
  return data;
}

export const AppProvider = ({ children }: React.PropsWithChildren<any>) => {
  const [state, dispatch] = React.useReducer(reducer, defaultState);

  return (<AppContext.Provider value={{ state, dispatch }}>
    {children}
  </AppContext.Provider>)
}
