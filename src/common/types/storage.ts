export interface FileData {
  fileName: string;
  fileData: ArrayBuffer | Buffer;
}
export interface FileStorage {
  upload(data: FileData): Promise<void>;
  delete(fileName: string): Promise<void>;
  getObjectUrl(fileName: string): string;
}
