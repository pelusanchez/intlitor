const TRANSLATE_URL = "https://translate.rext.es/translate";

const BASIC_AUTH = "Basic cGVsdTpwZWx1MTIz";

export class TranslateService {
  translate(str: string, source: string = "es", target: string = "en") {
    return fetch(TRANSLATE_URL, {
      "headers": {
        "authorization": BASIC_AUTH,
        "content-type": "application/json"
      },
      "method": "POST",
      body: JSON.stringify({
        q: str,
        source,
        target,
        format: "text"
      }),
    }).then(res => res.json());
  }
}
