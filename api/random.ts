import { VercelRequest, VercelResponse } from "@vercel/node";
import { getRandomQuote } from "../data/notion";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.headers.authorization !== process.env.AUTH_TOKEN) {
    res.status(403).send({});
  }

  const quote = await getRandomQuote();
  res.status(200).send(quote);
};
