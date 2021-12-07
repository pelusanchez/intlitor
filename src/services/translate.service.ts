import { TRANSLATE_URL } from '../core/constants';

export class TranslateService {

  translate(str: string, source: string = "es", target: string = "en") {
    return fetch(TRANSLATE_URL, {
      "headers": {
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
