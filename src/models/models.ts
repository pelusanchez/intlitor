export type Language = string;

export type I18NContent = {
  [key: string]: I18NMessage;
};

export type I18NMessage = {
  [key: Language]: string;
};

export type FileEditor = {
  [filename: string]: I18NContent | undefined;
};

export type SelectedLocales = {
  source: Language;
  target: Language;
};

export type TranslationInfo = {
  source: Language;
  targets: Language[];
  selected: SelectedLocales;
};

export type EditorState = {
  target: Language;
  key?: string;
  translationInfo: TranslationInfo;
  files: FileEditor;
  selected?: Language;
};

