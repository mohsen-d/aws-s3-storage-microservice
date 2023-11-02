// @ts-nocheck
import stream from "node:stream";
import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Formidable } from "formidable";
import path from "node:path";

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

const t = new stream.PassThrough();

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const form = new Formidable({
        fileWriteStreamHandler: fileWriteStreamHandler,
      });

      form.parse(req, (err, fields, files) => {
        if (err) reject({ err });
        resolve({ err, fields, files });
      });
    });

    const fileName =
      data.files.file[0].newFilename +
      path.extname(data.files.file[0].originalFilename);

    await uploadFile(t, fileName, data.files.file[0].mimetype);

    //return the data back or just do whatever you want with it
    res.status(200).json({
      status: "ok",
      fileName,
    });
  } catch (ex) {
    res.send(ex);
  }
};
function fileWriteStreamHandler(file) {
  return t;
}

async function uploadFile(fileBuffer, fileName, mimetype) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
    ContentLength: fileBuffer.readableLength,
  };

  return s3Client.send(new PutObjectCommand(uploadParams));
}
