import { VercelRequest, VercelResponse } from '@vercel/node';
import {getQuotes} from "../data/notion";

export default async (_req: VercelRequest, res: VercelResponse) => {
  const quotes = await getQuotes();
  res.status(200).send(quotes[0]);
};
