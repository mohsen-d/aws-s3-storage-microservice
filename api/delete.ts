// @ts-nocheck

import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

function deleteFile(fileName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { name } = req.query;

    await deleteFile(name);
    res.status(200).json({
      status: "ok",
      name,
    });
  } catch (ex) {
    res.send(ex);
  }
};
