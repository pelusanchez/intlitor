import LOCALES from '../static/locales.json';

export type LocaleCode = keyof typeof LOCALES;

export class LocaleService {

  list() {
    return LOCALES;
  }

  name(locale: LocaleCode) {
    return LOCALES[locale];
  }
  
}
