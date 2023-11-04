import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";
import { UploadParams } from "./params.type";

dotenv.config();

const bucketName: string = process.env.AWS_BUCKET_NAME ?? "";
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const config: S3ClientConfig = {
  region,
  credentials: {
    accessKeyId: accessKeyId ?? "",
    secretAccessKey: secretAccessKey ?? "",
  },
};

const s3Client: S3Client = new S3Client(config);

export function deleteFile(fileName: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

export function getAll() {
  const params = {
    Bucket: bucketName,
  };

  return s3Client.send(new ListObjectsV2Command(params));
}

export function uploadFile(params: UploadParams) {
  params.Bucket = bucketName;

  return new Upload({
    client: s3Client,
    params: params,
  });
}
