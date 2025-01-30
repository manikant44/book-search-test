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

  protected async fetchBooks(
    path: string,
    queryParam: string | number,
    limit: number
  ): Promise<Book[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/${path}?query=${queryParam}&maxResults=${limit}&format=${this.format}`
      );

      if (!response.ok) {
        throw new Error(
          `${this.apiUrl} API request failed with status ${response.status}`
        );
      }

      //Implement JSON or XML handling logic
      return this.format === "xml"
        ? this.handleXmlResponse(await response.text())
        : this.handleJsonResponse(await response.json());
    } catch (error) {
      console.error(`Error fetching books from ${this.apiUrl}:`, error);
      notifyApiOwner(error, path, queryParam, this.apiUrl);
      return [];
    }
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
}
