import { BookSellerA } from "../clients/BookSellerA";
import { bookSellerAMockData } from "../mock_data/BookSellerOneMockData";
import { Book, BookSellerAList } from "../types/Book";

// Mock the fetch API globally for tests
global.fetch = jest.fn();

describe("BookSellerA", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mock before each test
    (fetch as jest.Mock).mockReset();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up after each test
    consoleErrorSpy.mockRestore();
  });

  it("should fetch books by author and handle JSON response correctly", async () => {
    const queryParam = "Christie"; // Filter by this author
    const limit = 10; // Limit the number of results

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => {
        // Simulate filtering inside the mock API response
        return bookSellerAMockData.filter(
          (item: BookSellerAList) => item.book.author === queryParam
        ); // Filter by the author
      },
    });

    const bookSellerA = new BookSellerA("json");

    const books: Book[] = await bookSellerA.getBooksByAuthor(queryParam, limit);

    // Check that the fetch function was called with the expected URL
    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.bookseller-a.com/by-author?query=Christie&maxResults=10&format=json"
    );

    expect(books.length).toBe(1);
    expect(books).toEqual([
      {
        title: "Murder on the Orient Express",
        author: "Christie",
        isbn: "ISBN-1004",
        quantity: 8,
        price: "$18.0",
        year: 1934,
        publisher: "Collins Crime Club",
      },
    ]);
  });

  it("should handle fetch API errors gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.reject(new Error("Not Found")),
    });

    const bookSellerA = new BookSellerA("json");

    const queryParam = "Nonexistent Author";
    const limit = 10;

    const books: Book[] = await bookSellerA.getBooksByAuthor(queryParam, limit);

    // Check that the fetch function was called with the expected URL
    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.bookseller-a.com/by-author?query=Nonexistent Author&maxResults=10&format=json"
    );

    expect(books).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching books from http://api.bookseller-a.com:",
      expect.any(Error)
    );
  });

  it("should fetch books by publisher and handle JSON response correctly", async () => {
    const queryParam = "Bloomsbury";
    const limit = 10;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => {
        // Simulate filtering inside the mock API response
        return bookSellerAMockData.filter(
          (book: BookSellerAList) => book.publisher === queryParam
        ); // Filter by the publisher
      },
    });

    const bookSellerA = new BookSellerA("json");

    const books: Book[] = await bookSellerA.getBooksByPublisher(
      queryParam,
      limit
    );

    // Check that the fetch function was called with the expected URL
    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.bookseller-a.com/by-publisher?query=Bloomsbury&maxResults=10&format=json"
    );

    expect(books.length).toBe(1);
    expect(books).toEqual([
      {
        title: "The Philosopher's Stone",
        author: "J.K. Rowling",
        isbn: "ISBN-1001",
        quantity: 5,
        price: "$20.0",
        year: 1997,
        publisher: "Bloomsbury",
      },
    ]);
  });
});
