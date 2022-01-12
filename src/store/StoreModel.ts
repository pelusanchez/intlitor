import { EditorState, I18NContent, I18NMessage, TranslationInfo } from "../models/models";

export const defaultTranslationInfo: TranslationInfo = {
  source: "es",
  targets: ["en"],
  selected: {
    source: "es",
    target: "en",
  }
};

export const defaultState = {
  key: undefined,
  translationInfo: defaultTranslationInfo,
  editor: {
    project: "",
    languages: ['es', 'en'] as any,
    files: [] as I18NContent[],
  },
} as EditorState;
