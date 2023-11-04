import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { name } = req.query;

    res.status(200).json({
      url: `https://benvisstoragebucket.s3.ca-central-1.amazonaws.com/${name}`,
    });
  } catch (ex) {
    res.status(500).json({
      status: "error",
      ex,
    });
  }
};
