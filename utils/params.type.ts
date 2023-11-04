import { PassThrough } from "node:stream";

export class UploadParams {
  ContentType: string;
  Bucket: string;
  Body: PassThrough;
  Key: string;

  constructor(content: PassThrough) {
    this.ContentType = "";
    this.Bucket = "";
    this.Body = content;
    this.Key = "";
  }
}
