export type Language = string;

export type I18NContent = {
  values: I18NMessage[];
};

export type I18NMessage = {
  key: string;
  [key: Language]: string;
};

export type FileEditor = {
  project: string;
  languages: string[];
  files: {
    [filename: string]: I18NContent | undefined;
  };
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

