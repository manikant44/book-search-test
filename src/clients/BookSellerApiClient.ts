import { notifyApiOwner } from "../helpers";
import { Book, ValidApiFormats } from "../types/Book";

// Abstract Class for Common BookSeller API Behaviour Functionality
export abstract class BookSellerApiClient {
  protected format: ValidApiFormats;
  protected abstract apiUrl: string;

  constructor(format: ValidApiFormats = "json") {
    this.format = format;
  }

  // General fetchBooks method for all subclasses
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
        throw new Error(`API request failed with status ${response.status}`);
      }

      return this.format === "json"
        ? this.handleJsonResponse(await response.json())
        : this.handleXmlResponse(await response.text());
    } catch (error) {
      console.error(`Error fetching books from ${this.apiUrl}:`, error);
      notifyApiOwner(error, endpoint, queryParam, this.apiUrl);
      return [];
    }
  }

  protected abstract handleJsonResponse(data: any): Book[]
  protected abstract handleXmlResponse(xmlString: string): Promise<Book[]> 
}
