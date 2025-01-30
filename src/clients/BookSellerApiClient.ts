import { notifyApiOwner } from "../helpers";
import { Book, ValidApiFormats } from "../types/Book";

// Abstract Class for Common BookSeller API Behaviour Functionality
export abstract class BookSellerApiClient {
  protected format: ValidApiFormats;

  constructor(format: ValidApiFormats = "json") {
    this.format = format;
  }

  // Abstract method: Every subclass must define its fetching logic.
  protected abstract fetchBooks(
    path: string,
    queryParam: string | number,
    limit: number
  ): Promise<Book[]>;

  //Default implementation: Can be overridden if needed
  protected handleJsonResponse(data: any): Book[] {
    //Placeholder for XML processing logic
    return []
  }

  //Default implementation: Can be overridden if needed
  protected handleXmlResponse(xmlString: string): any {
    //Placeholder for XML processing logic
    return [];
  }
}
