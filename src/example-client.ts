import fetch from "cross-fetch";
import { server } from "./mock_data/server";
import { BookSellerB } from "./clients/BookSellerB";
import { BookSellerA } from "./clients/BookSellerA";
import { BookSellerC } from "./clients/BookSellerC";

(global as any).fetch = fetch;

// Starting MSW mock server
server.listen({ onUnhandledRequest: "warn" });

async function main() {
  // Instantiate individual book sellers
  const bookSellerA = new BookSellerA("json");
  const bookSellerB = new BookSellerB("json");
  const bookSellerC = new BookSellerC("xml")

  try {
    // Fetch books by author from book seller A
    const booksByAuthorA = await bookSellerA.getBooksByAuthor("Stephen", 10);
    console.log("Books by author from seller A ==>>:", booksByAuthorA);

    // Fetch books by publisher from book seller A
    const booksByPublisherA = await bookSellerA.getBooksByPublisher("Bloomsbury", 10);
    console.log("Books by publisher from seller A ==>>:", booksByPublisherA);

    // Fetch books by author from book seller B
    const booksByAuthorB = await bookSellerB.getBooksByAuthor("Doubleday", 5);
    console.log("Books by author from seller B ==>>:", booksByAuthorB);

    // Fetch XML books records by year from book seller C
    const booksByAuthorC = await bookSellerC.getBooksByAuthor("Doubleday", 5);
    console.log("Books by Year from seller C ==>>:", booksByAuthorC);

    // Add more query types here as per book seller
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

main();
