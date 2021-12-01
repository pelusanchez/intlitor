import JSZip from "jszip";
import { FileUtils } from "./FileUtils";

export class ZipUtils {

  public static zipProject(project: any) {
    const zip = new JSZip();
    zip.file('project.json', JSON.stringify(project, null, 2));
    zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        FileUtils.saveAs(content, `project.zip`);
    });
  }

  public static zipFiles(filesTranslation: { [filename: string]: any}, name: string = 'default') {
    const zip = new JSZip();

    Object.entries(filesTranslation).forEach(([filename, content]) => {
      zip.file(filename, JSON.stringify(content, null, 2));
    });

    zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        FileUtils.saveAs(content, `${name}.zip`);
    });
  }
  
}
