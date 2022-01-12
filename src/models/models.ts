export type Language = string;

export type I18NContent = {
  filename: string;
  values: I18NMessage[];
};

export type I18NMessage = {
  key: string;
  [key: Language]: string;
};

export type FileEditor = {
  project: string;
  languages: string[];
  files: I18NContent[];
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
  editor: FileEditor;
  selected?: Language;
};

