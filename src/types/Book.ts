export interface Book {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  price: string;
  year: number;
  publisher: string;
}

export interface BookSellerBList {
  item: {
    name: string;
    writer: string;
    isbn: string;
  };
  unit: {
    inventory: number;
    cost: string;
  };
  publisher: string;
  year: number;
  genre: string;
  rating: number;
}

export interface BookSellerAList {
  book: {
    title: string;
    author: string;
    isbn: string;
  };
  stock: {
    quantity: number;
    price: string;
  };
  publisher: string;
  year: number;
  genre: string;
  ranking: number;
}

export type ValidApiFormats = "json" | "xml";
