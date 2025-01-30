import { BookSellerB } from "../clients/BookSellerB";
import { bookSellerBMockData } from "../mock_data/BookSellerTwoMockData";
import { Book, BookSellerBList } from "../types/Book";

// Mock the fetch API globally for tests
global.fetch = jest.fn();

describe("BookSellerB", () => {
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
    const queryParam = "Asimov"; // Filter by this author
    const limit = 5; // Limit the number of results

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => {
        // Simulate filtering inside the mock API response
        return bookSellerBMockData.filter((book: BookSellerBList) => book.item.writer === queryParam); // Filter by the author
      },
    });

    const bookSellerB = new BookSellerB("json");

    const books: Book[] = await bookSellerB.getBooksByAuthor(queryParam, limit);

    // Check that the fetch function was called with the expected URL
    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.bookseller-b.com/by-author?query=Asimov&maxResults=5&format=json"
    );

    expect(books.length).toBe(1);
    expect(books).toEqual([
      {
        title: "Foundation",
        author: "Asimov",
        isbn: "ISBN-1006",
        quantity: 6,
        price: "$22.0",
        year: 1951,
        publisher: "Gnome Press",
      },
    ]);
  });

  it("should handle fetch API errors gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.reject(new Error("Not Found")),
    });

    const bookSellerB = new BookSellerB("json");

    const queryParam = "Nonexistent Author";
    const limit = 10;

    const books: Book[] = await bookSellerB.getBooksByAuthor(queryParam, limit);

    // Check that the fetch function was called with the expected URL
    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.bookseller-b.com/by-author?query=Nonexistent Author&maxResults=10&format=json"
    );

    expect(books).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching books from http://api.bookseller-b.com:",
      expect.any(Error)
    );
  });

  it("should fetch books by publisher and handle JSON response correctly", async () => {
    const queryParam = "Windus";
    const limit = 5;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => {
        // Simulate filtering inside the mock API response
        return bookSellerBMockData.filter(
          (book: BookSellerBList) => book.publisher === queryParam
        ); // Filter by the pubisher
      },
    });

    const bookSellerB = new BookSellerB("json");

    const books: Book[] = await bookSellerB.getBooksByPublisher(
      queryParam,
      limit
    );

    // Check that the fetch function was called with the expected URL
    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.bookseller-b.com/by-publisher?query=Windus&maxResults=5&format=json"
    );

    expect(books.length).toBe(1);
    expect(books).toEqual([
      {
        title: 'Adventures of Huckleberry Finn',
        author: 'Mark Twain',
        isbn: 'ISBN-1007',
        quantity: 9,
        price: '$19.0',
        year: 1884,
        publisher: 'Windus'
      },
    ]);
  });
});
