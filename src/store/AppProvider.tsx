import React from "react";
import { EditorState, TranslationInfo } from '../models/models';

const defaultTranslationInfo: TranslationInfo = {
  source: "es",
  targets: [ "en" ],
};

const defaultState = {
  target: "en",
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
  return {
    ...state,
    ...newData,
  }
}

export const AppProvider = ({ children }: React.PropsWithChildren<any>) => {
  const [state, dispatch] = React.useReducer(reducer, defaultState);

  return (<AppContext.Provider value={{ state, dispatch }}>
    {children}
  </AppContext.Provider>)
}
