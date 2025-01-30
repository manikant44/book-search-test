import { notifyApiOwner } from "../helpers";
import { Book, BookSellerBList, ValidApiFormats } from "../types/Book";
import { BookSellerApiClient } from "./BookSellerApiClient";

export class BookSellerB extends BookSellerApiClient {
  private apiUrl: string = "http://api.bookseller-b.com";

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

  protected async fetchBooks(
    endpoint: string,
    queryParam: string | number,
    limit: number
  ): Promise<Book[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/${endpoint}?query=${queryParam}&maxResults=${limit}&format=${this.format}`
      );

      if (!response.ok) {
        throw new Error(
          `${this.apiUrl} API request failed with status ${response.status}`
        );
      }

      //Implement JSON or XML handling logic
      return this.format === "json"
        ? this.handleJsonResponse(await response.json())
        : this.handleXmlResponse(await response.text());
    } catch (error) {
      console.error(`Error fetching books from ${this.apiUrl}:`, error);
      notifyApiOwner(error, endpoint, queryParam, this.apiUrl);
      return [];
    }
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
  
}
