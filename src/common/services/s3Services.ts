import config from 'config';
import { FileData, FileStorage } from '../types/storage';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class S3Storage implements FileStorage {
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: config.get('s3.region'),
      credentials: {
        accessKeyId: config.get('s3.accessKeyId'),
        secretAccessKey: config.get('s3.secretAccessKey'),
      },
    });
  }

  async upload(data: FileData): Promise<void> {
    const objectParams = {
      Bucket: config.get('s3.bucketName'),
      Key: data.fileName,
      Body: data.fileData,
    };

    //  @ts-expect-error  @ts-ignore
    this.client.send(new PutObjectCommand(objectParams));
  }

  delete(fileName: string): string {
    return fileName;
  }

  getObjectUrl(fileName: string): string {
    return `https://s3.amazonaws.com/${fileName}`;
  }
}
