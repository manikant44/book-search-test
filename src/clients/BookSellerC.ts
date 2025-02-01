import { parseStringPromise } from "xml2js";
import { notifyApiOwner } from "../helpers";
import { Book, ValidApiFormats } from "../types/Book";
import { BookSellerApiClient } from "./BookSellerApiClient";

export class BookSellerC extends BookSellerApiClient {
  protected apiUrl = "http://api.bookseller-c.com";

  constructor(format: ValidApiFormats) {
    super(format);
  }

  async getBooksByAuthor(
    queryParam: string | number,
    limit: number
  ): Promise<Book[]> {
    return this.fetchBooks("by-author", queryParam, limit);
  }

  // Takes the raw mock xml book data from the API and converts into our specified Book format.
  protected async handleXmlResponse(xmlString: string): Promise<Book[]> {
    try {
      const parsedData = await parseStringPromise(xmlString, {
        explicitArray: false,
      });
      const items = parsedData.bookDetails?.item || [];
      const bookArray = Array.isArray(items) ? items : [items];

      return bookArray.map(
        (item: any): Book => ({
          title: item.bookName,
          author: item.writer,
          isbn: item.bookNumber,
          quantity: Number(item.availability.stock),
          price: item.cost.amount,
          year: Number(item.year),
          publisher: item.publisher,
        })
      );
    } catch (error) {
      console.error("Error parsing XML response:", error);
      return [];
    }
  }

  /**
   * Placeholder implementation for handling JSON responses.
   *
   * Currently, this method returns mock data.
   * If in the future a proper JSON format is introduced for BookSellerC,
   * replace this with appropriate mapping logic to convert API response
   * into the Book model.
   *
   * @param jsonData - The raw JSON response (to be mapped in the future).
   * @returns A mock array of Book objects for now.
   */
  protected handleJsonResponse(jsonData: any): Book[] {
    return [
      {
        title: "Mock JSON Book",
        author: "Mock JSON Author",
        isbn: "111-1111111111",
        quantity: 5,
        price: "$19.99",
        year: 2024,
        publisher: "Mock JSON Publisher",
      },
    ];
  }
}
