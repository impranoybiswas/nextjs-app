import { getCollection } from "./mongodb";

export async function getUsersCollection() {
  const collection = await getCollection("users");
  if (!collection) {
    throw new Error("Failed to connect to collection");
  }
  return collection;
}

