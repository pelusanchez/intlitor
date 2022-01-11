
import React from 'react';
import { FileEditor } from '../models/models';

const LOCAL_STORAGE_KEY = `locales-translation`;
const DEBOUNCE_TIME = 1000; // 1 second

let debounce: any = null;

export class LocalStorage {
  static save(data: FileEditor) {
    if (debounce) {
      clearTimeout(debounce);
    }
    debounce = setTimeout(() => {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }, DEBOUNCE_TIME);
  }

  static read(): FileEditor {
    const exists = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (exists && exists !== '{}') {
      try {
        return JSON.parse(exists);
      } catch (err) {
        // Silently fail
      }
    }
    return {
      project: '',
      languages: ['es', 'en'],
      files: {},
    };
  }
}

export const useLocalStorage = (key: string, defaultValue?: string) => {

  const [ value, setValueInternal ] = React.useState(() => {
    return window.localStorage.getItem(key);
  });

  const setValue = (value: string) => {
    window.localStorage.setItem(key, value);
    setValueInternal(value);
  };
  
  return [ value, setValue ];
}
