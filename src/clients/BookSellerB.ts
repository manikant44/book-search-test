import { notifyApiOwner } from "../helpers";
import { Book, BookSellerBList, ValidApiFormats } from "../types/Book";
import { BookSellerApiClient } from "./BookSellerApiClient";

export class BookSellerB extends BookSellerApiClient {
  protected apiUrl: string = "http://api.bookseller-b.com";

  constructor(format: ValidApiFormats = "json") {
    super(format);
  }

  async getBooksByAuthor(
    queryParam: string | number,
    limit: number
  ): Promise<Book[]> {
    return this.fetchBooks("by-author", queryParam, limit);
  }

  async getBooksByPublisher(
    queryParam: string | number,
    limit: number
  ): Promise<Book[]> {
    return this.fetchBooks("by-publisher", queryParam, limit);
  }

  // Custom mapping for JSON response
  protected handleJsonResponse(data: BookSellerBList[]): Book[] {
    try {
      if (!Array.isArray(data)) {
        throw new Error("Invalid JSON format: Expected an array of books");
      }

      return data.map(
        (bookInfo: BookSellerBList): Book => ({
          title: bookInfo.item.name || "Unknown Title",
          author: bookInfo.item.writer || "Unknown Author",
          isbn: bookInfo.item.isbn || "Unknown ISBN",
          quantity: bookInfo.unit.inventory || 0,
          price: bookInfo.unit.cost,
          year: bookInfo.year || 0,
          publisher: bookInfo.publisher || "Unknown Publisher",
        })
      );
    } catch (error) {
      console.error("Error processing JSON response:", error);
      return [];
    }
  }

  /**
   * Placeholder implementation for handling XML responses.
   *
   * Currently, BookSellerB only returns JSON, so this method returns mock data.
   * If in the future XML responses are introduced, replace this with proper
   * XML parsing logic to extract book details and map them to the Book model.
   *
   * @param rawXmlBooks - The raw XML response (to be parsed in the future).
   * @returns A mock array of Book objects for now.
   */
  protected handleXmlResponse(rawXmlBooks: any): Promise<Book[]> {
    return Promise.resolve([
      {
        title: "Mock XML Book",
        author: "Mock Author",
        isbn: "000-0000000000",
        quantity: 10,
        price: "$9.99",
        year: 2023,
        publisher: "Mock Publisher",
      },
    ]);
  }
}
