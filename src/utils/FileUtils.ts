export class FileUtils {

  static saveAs(content: Blob, filename: string) {
    const blobUrl = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
