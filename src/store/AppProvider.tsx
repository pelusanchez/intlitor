import React from "react";
import { EditorState } from '../models/models';
import { LocalStorage } from "./LocalStorage";
import { defaultState } from "./StoreModel";


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
