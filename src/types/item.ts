export type ItemType = "sell" | "donate";
export type ItemStatus = "available" | "sold";

export interface Item {
  title: string;
  description: string;
  price: number;
  category: string;
  type: ItemType;
  images: string[];
  location: string;
  tags: string[];
  userId: string;
  status: ItemStatus;
  createdAt: Date;
}

// Example document demonstrating the structure
export const exampleItem: Item = {
  title: "Engineering Mathematics Textbook",
  description: "Used textbook for first-year engineering students. Good condition.",
  price: 50,
  category: "Textbooks",
  type: "sell",
  images: [
    "https://example.com/images/book1.jpg",
    "https://example.com/images/book2.jpg"
  ],
  location: "North Campus Library",
  tags: ["math", "engineering", "first-year"],
  userId: "user_abc123",
  status: "available",
  createdAt: new Date(),
};
