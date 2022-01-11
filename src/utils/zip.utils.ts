import JSZip from "jszip";
import { FileEditor } from "../models/models";
import { FileUtils } from "./FileUtils";
import { JsonUtil } from "./json.utils";

export class ZipUtils {

  public static zipProject(fileEditor: FileEditor) {
    const zip = new JSZip();
    /* For each file, deflatten */
    const languages = fileEditor.languages;
    for (const lang in languages) {
      const files = JsonUtil.deflatten(fileEditor, lang);
      for (const file in files) {
        zip.file(file, JSON.stringify(files[file], null, 2));
      }
    }

    zip.generateAsync({type:"blob"}).then(function(content) {
        FileUtils.saveAs(content, `project.zip`);
    });
  }

  public static zipFiles(filesTranslation: { [filename: string]: any}, name: string = 'default') {
    const zip = new JSZip();

    Object.entries(filesTranslation).forEach(([filename, content]) => {
      zip.file(filename, JSON.stringify(content, null, 2));
    });

    zip.generateAsync({type:"blob"}).then(function(content) {
        FileUtils.saveAs(content, `${name}.zip`);
    });
  }
  
}
