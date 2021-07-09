import { VercelRequest, VercelResponse } from "@vercel/node";
import { createQuote } from "../data/notion";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.headers.authorization !== process.env.AUTH_TOKEN) {
    res.status(403).send({});
  }

  const { body, method } = req;
  if (method === "POST") {
    const quote = await createQuote({
      content: body.content,
      attribution: body.attribution || null,
    });
    res.status(201).send({
      content: quote.content,
      attribution: quote.attribution,
    });
  } else {
    res.status(405);
  }
};
