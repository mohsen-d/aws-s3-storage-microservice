import { VercelRequest, VercelResponse } from "@vercel/node";
import { bucketUrl } from "../utils/s3";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { name } = req.query;

    res.status(200).json({
      url: bucketUrl + name,
    });
  } catch (ex) {
    res.status(500).json({
      status: "error",
      ex,
    });
  }
};
