// @ts-nocheck
import { VercelRequest, VercelResponse } from "@vercel/node";
import { IncomingForm } from "formidable";
import { PassThrough } from "stream";
import { DDD } from "../utils/s3";

export default (req: VercelRequest, res: VercelResponse) => {
  const form = new IncomingForm();
  const passThrough = new PassThrough();
  const promise = DDD(passThrough, "unique2.jpg").done();
  form.onPart = (part: Part) => {
    part.on("data", function (data) {
      // pass chunk to passThrough

      var bufferStream = new PassThrough();
      bufferStream.end(data);
      bufferStream.pipe(passThrough);
    });
  };

  promise
    .then((uploadedData) => res.json({ data: uploadedData }))
    .catch((err) => res.json({ error: err }));

  form.parse(req);
};

export const config = {
  api: {
    bodyParser: false,
  },
};
