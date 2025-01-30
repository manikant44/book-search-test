import { setupServer } from "msw/node";
import { bookSellerApiEndpoints } from "./mockHandlers";

export const server = setupServer(...bookSellerApiEndpoints);

server.listen({ onUnhandledRequest: "warn" });

console.log("Mock server is running...");

// Keep the process alive
process.stdin.resume();
