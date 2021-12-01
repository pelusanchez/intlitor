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
  target: string;
};

export type EditorState = {
  translationInfo: TranslationInfo;
  files: FileEditor;
  selected?: string;
};

