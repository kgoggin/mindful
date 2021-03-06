import { Client } from "@notionhq/client";
import {
  Page,
  RichTextPropertyValue,
  TitlePropertyValue,
  DatePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { randomColor } from "./colors";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const DATABASE_ID = "7069361d473646b2ba6e3f7a664897b5";

type Quote = {
  id: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  attribution: string | null;
  lastSeen: Date | null;
};

const makeQuotes = (quotes: Page[]): Quote[] => {
  const result = [];

  for (const page of quotes) {
    const content = page.properties["Content"] as TitlePropertyValue;
    const attribution = page.properties["Attribution"] as RichTextPropertyValue;
    const lastSeen = page.properties["Last Seen"] as DatePropertyValue;
    const [backgroundColor, textColor] = randomColor();

    if (content.title[0]) {
      result.push({
        id: page.id,
        content: content.title[0].plain_text,
        attribution: attribution.rich_text[0]?.plain_text || null,
        lastSeen: lastSeen ? new Date(lastSeen.date.start) : null,
        backgroundColor,
        textColor,
      });
    }
  }

  return result;
};

export const getQuotes = async () => {
  const quotes = await notion.databases.query({
    database_id: DATABASE_ID,
  });

  return makeQuotes(quotes.results).sort((a, b) => {
    if (!a.lastSeen && !b.lastSeen) {
      return 0;
    } else if (!a.lastSeen) {
      return -1;
    } else if (!b.lastSeen) {
      return 1;
    } else {
      return 0;
    }
  });
};

export const getRandomQuote = async () => {
  const quotes = await getQuotes();

  console.log(quotes);

  let quoteToShow = quotes[0];

  if (quotes[0].lastSeen) {
    quoteToShow = quotes[Math.floor(Math.random() * quotes.length)];
  }

  await updatePageLastSeen(quoteToShow.id);
  return quoteToShow;
};

type CreateQuote = {
  content: string;
  attribution: string;
};

export const createQuote = async ({ content, attribution }: CreateQuote) => {
  const res = await notion.pages.create({
    parent: {
      database_id: DATABASE_ID,
    },
    properties: {
      Content: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content,
            },
          },
        ],
      },
      Attribution: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: attribution,
            },
          },
        ],
      },
    },
  });

  return makeQuotes([res as unknown as Page])[0];
};

export const updatePageLastSeen = async (pageId: string) => {
  const res = await notion.pages.update({
    page_id: pageId,
    properties: {
      "Last Seen": {
        type: "date",
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  });

  return res;
};
