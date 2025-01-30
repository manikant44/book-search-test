import { notifyApiOwner } from "../helpers";
import { Book, BookSellerAList, ValidApiFormats } from "../types/Book";
import { BookSellerApiClient } from "./BookSellerApiClient";

export class BookSellerA extends BookSellerApiClient {
  private apiUrl: string = "http://api.bookseller-a.com";

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

  // Common abstract fetch method
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
  
}
