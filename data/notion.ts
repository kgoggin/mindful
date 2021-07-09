import {Client} from "@notionhq/client";
import {
  Page,
  RichTextPropertyValue,
  TitlePropertyValue,
  DatePropertyValue,
} from "@notionhq/client/build/src/api-types";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

export const DATABASE_ID = "7069361d473646b2ba6e3f7a664897b5";

type Quote = {
  content: string;
  backgroundColor: string;
  textColor: string;
  attribution: string | null;
};

const makeQuotes = (quotes: Page[]): Quote[] => {
  const result = [];

  for (const page of quotes) {
    const content = page.properties["Content"] as TitlePropertyValue;

    if (content.title[0]) {
      result.push({
        content: content.title[0].plain_text,
        backgroundColor: "#000000",
        textColor: "#ffffff",
        attribution: "Someone Cool"
      })
    }
  }

  return result;
};

export const getQuotes = async () => {
  const quotes = await notion.databases.query({
    database_id: DATABASE_ID,
  });

  return makeQuotes(quotes.results);
};
