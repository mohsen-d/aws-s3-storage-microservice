// @ts-nocheck
import { VercelRequest, VercelResponse } from "@vercel/node";
import { deleteFile } from "../utils/s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { name } = req.query;

    await deleteFile(name);

    res.status(200).json({
      status: "ok",
      name,
    });
  } catch (ex) {
    res.status(500).json({
      status: "error",
      ex,
    });
  }
};
