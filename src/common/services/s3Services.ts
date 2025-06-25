import config from 'config';
import { FileData, FileStorage } from '../types/storage';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import createHttpError from 'http-errors';

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

  async delete(fileName: string): Promise<void> {
    const objectParams = {
      Bucket: config.get('s3.bucketName'),
      Key: fileName,
    };

    //  @ts-expect-error  @ts-ignore
    await this.client.send(new DeleteObjectCommand(objectParams));
  }

  getObjectUrl(fileName: string): string {
    // return `https://s3.amazonaws.com/${fileName}`;
    const bucketName = config.get('s3.bucketName');
    const region = config.get('s3.region');
    if (!bucketName || !region || typeof bucketName !== 'string' || typeof region !== 'string') {
      const error = createHttpError(500, 'S3 bucket name or region is not configured');
      throw error;
    }
    return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
  }
}
