import LOCALES from '../static/locales.json';

export type LocaleCode = keyof typeof LOCALES;
const LABELS = Object.entries(LOCALES).map(([ value, label ]) => ({ value, label }))

export class LocaleService {

  list() {
    return LOCALES;
  }

  name(locale: LocaleCode) {
    return LOCALES[locale];
  }
  
}

export const useLocales = () => {
  return { locales: LABELS }
}
