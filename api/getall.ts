import { VercelRequest, VercelResponse } from "@vercel/node";
import { getAll, bucketUrl } from "../utils/s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const data = await getAll();

    res.status(200).json({
      status: "ok",
      files: data.Contents?.map((c) => bucketUrl + c.Key),
    });
  } catch (ex) {
    res.status(500).json({
      status: "error",
      ex,
    });
  }
};
