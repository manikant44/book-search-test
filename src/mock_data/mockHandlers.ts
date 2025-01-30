import { rest } from "msw";
import { bookSellerAMockData } from "./BookSellerOneMockData";
import { bookSellerBMockData } from "./BookSellerTwoMockData";
import {bookSellerCMockXmlData} from "./BookSellerThreeXmlMock"

// A Common json mock server handler function for all newly added book seller APIs for local only
const createBookSellerJsonHandler = (bookSellerData: any[], apiUrl: string) => {
  return rest.get(apiUrl, (req: any, res: any, ctx: any) => {
    const searchKeyword = req.url.searchParams.get("query");
    const maxItems = Number(req.url.searchParams.get("maxResults"));

    let filteredBooks = bookSellerData;

    if (searchKeyword) {
      const lowerCaseQuery = searchKeyword.toLowerCase();

      filteredBooks = bookSellerData.filter(record => 
        Object.values(record).some(value =>
          value && typeof value === "object"
            ? Object.values(value).some(v => v.toString().toLowerCase().includes(lowerCaseQuery.toLowerCase()))
            : value?.toString().toLowerCase().includes(lowerCaseQuery.toLowerCase())
        )
      ).slice(0, maxItems); // Limit the number of results
    }

    return res(ctx.status(200), ctx.json(filteredBooks));
  });
};

const createBookSellerXmlHandler = (bookSellerXmlData: string, apiUrl: string) => {
  return rest.get(apiUrl, (req: any, res: any, ctx: any) => {
    // You can perform filtering logic here if necessary
    return res(
      ctx.status(200),
      ctx.set("Content-Type", "application/xml"),
      ctx.body(bookSellerXmlData) // Return the actual XML data
    );
  });
};


export const bookSellerApiEndpoints = [
  createBookSellerJsonHandler(
    bookSellerAMockData,
    "http://api.bookseller-a.com/:type?"
  ),
  createBookSellerJsonHandler(
    bookSellerBMockData,
    "http://api.bookseller-b.com/:type?"
  ),
  createBookSellerXmlHandler(
    bookSellerCMockXmlData,
    "http://api.bookseller-c.com/:type?"
  ),
  //Add more book seller api mock server here for local testing
];
