export class JsonUtil {

  static flatten(data: any, input: string, prefix: string = '') {
    const result: any = {};
    for (const key in data) {
      const value = data[key];
      if (value.constructor.name.toLowerCase() === 'object') {
        const flat = this.flatten(value, prefix + key + '.');
        for (const k in flat) {
          result[k] = flat[k];
        }
      } else if (value.constructor.name.toLowerCase() === 'string') {
        result[prefix + key] = { 
          'input': value
        };
      }
    }
    return result;
  }

  static deflatten(locale: { [key: string]: any }, source: string) {
    const files: any = {};
    for (const file in locale) {
      let fileStructure: any = {};
      for (const key in locale[file]) {
        // Deflatten the key
        const parts = key.split('.');
        const value = locale[file][key] && locale[file][key][source] || "";
        fileStructure = this.addValue(fileStructure, parts, value);
      }
      files[file] = fileStructure;
    }
    return files;
  }

  private static addValue(fileStructure: any, parts: string[], value: any) {
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
