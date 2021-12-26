import { EditorState, TranslationInfo } from "../models/models";

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
  files: {},
} as EditorState;
