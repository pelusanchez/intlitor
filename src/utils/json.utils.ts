import { FileEditor, I18NContent, I18NMessage } from "../models/models";

export class JsonUtil {

  static flatten(data: any, locale: string, filename: string, prefix: string = ''): I18NContent {
    const result: I18NMessage[] = [];
    for (const key in data) {
      const value = data[key];
      if (value.constructor.name.toLowerCase() === 'object') {
        const flat = this.flatten(value, locale, filename, prefix + key + '.');
        for (const message of flat.values) {
          result.push(message);
        }
      } else if (value.constructor.name.toLowerCase() === 'string') {
        result.push({
          key: prefix + key, 
          [locale]: value,
        });
      }
    }
    return { filename: filename, values: result };
  }

  static deflatten(fileEditor: FileEditor, locale: string) {
    const files: any = {};
    for (const file in fileEditor.files) {
      let fileStructure: any = {};
      for (const message of fileEditor.files[file]!.values) {
        // Deflatten the key
        const key = message.key;
        const parts = key.split('.');
        const value = message && message[locale] || "";
        fileStructure = this.addValue(fileStructure, parts, value);
      }
      files[file] = fileStructure;
    }
    return files;
  }

  private static addValue(fileStructure: any, parts: string[], value: string) {
    let partial: any = fileStructure;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (!partial[key]) {
        partial[key] = {};
      }
      partial = partial[key];
    }
    // Set value at nested position:
    partial[parts[parts.length - 1]] = value;
    return fileStructure;
  }
}
