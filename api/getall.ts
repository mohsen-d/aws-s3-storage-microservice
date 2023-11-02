// @ts-nocheck

import { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

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

function getAll(fileName) {
  const params = {
    Bucket: bucketName,
  };

  return s3Client.send(new ListObjectsV2Command(params));
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const data = await getAll();
    res.status(200).json({
      status: "ok",
      data,
    });
  } catch (ex) {
    res.send(ex);
  }
};
