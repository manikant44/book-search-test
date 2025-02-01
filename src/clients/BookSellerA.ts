import { notifyApiOwner } from "../helpers";
import { Book, BookSellerAList, ValidApiFormats } from "../types/Book";
import { BookSellerApiClient } from "./BookSellerApiClient";

export class BookSellerA extends BookSellerApiClient {
  protected apiUrl: string = "http://api.bookseller-a.com";

  constructor(format: ValidApiFormats) {
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
  protected handleJsonResponse(data: BookSellerAList[]): Book[] {
    try {
      if (!Array.isArray(data)) {
        throw new Error("Invalid JSON format: Expected an array of books");
      }

      return data.map(
        (item: BookSellerAList): Book => ({
          title: item.book.title || "Unknown Title",
          author: item.book.author || "Unknown Author",
          isbn: item.book.isbn || "Unknown ISBN",
          quantity: item.stock.quantity || 0,
          price: item.stock.price || "$0",
          year: item.year || 0,
          publisher: item.publisher || "Unknown Publisher",
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
   * Currently, BookSellerA only returns JSON, so this method returns mock data.
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
