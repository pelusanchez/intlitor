export type I18NContent = {
  [key: string]: I18NMessage;
};

export type I18NMessage = {
  input: string;
  translated: string;
};

export type FileEditor = {
  [filename: string]: I18NContent;
};

export type TranslationInfo = {
  source: string;
  targets: string[];
};

export type EditorState = {
  target: string;
  key?: string;
  translationInfo: TranslationInfo;
  files: FileEditor;
  selected?: string;
};

