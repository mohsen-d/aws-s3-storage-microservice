import { VercelRequest, VercelResponse } from "@vercel/node";
import { IncomingForm, Part } from "formidable";
import { PassThrough } from "stream";
import crypto from "node:crypto";
import path from "node:path";
import { uploadFile } from "../utils/s3";
import { UploadParams } from "../utils/params.type";

export default (req: VercelRequest, res: VercelResponse) => {
  const form = new IncomingForm();

  const fileContent = new PassThrough();
  const params = new UploadParams(fileContent);

  form.onPart = (part: Part) => {
    params.ContentType = part.mimetype ?? "";
    params.Key =
      crypto.randomUUID() + path.extname(part.originalFilename ?? "");
    part.on("data", function (data) {
      var chunkStream = new PassThrough();
      chunkStream.end(data);
      chunkStream.pipe(fileContent);
    });
  };

  const upload = uploadFile(params).done();

  upload
    .then((uploadedData) => res.json({ data: uploadedData }))
    .catch((err) => res.json({ error: err }));

  form.parse(req);
};

export const config = {
  api: {
    bodyParser: false,
  },
};
