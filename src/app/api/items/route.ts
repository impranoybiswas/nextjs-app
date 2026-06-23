import { getCollection } from "@/lib/mongodb";
import { errorResponse, successResponse, Item } from "@/utils/response";
import { NextRequest } from "next/server";
import { z } from "zod";

const ItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price must be positive"),
  ),
  description: z.string().max(500).optional().default(""),
});

export async function GET() {
  try {
    const itemsCollection = await getCollection<Item>("items");

    const items = await itemsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return successResponse(items, "Items fetched successfully");
  } catch (error) {
    console.error("Error fetching items:", error);
    return errorResponse("Failed to fetch items");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validation = ItemSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Validation failed",
        400,
        validation.error.flatten().fieldErrors,
      );
    }

    const { title, price, description } = validation.data;

    const itemsCollection = await getCollection<Item>("items");

    const newItem: Partial<Item> = {
      title,
      price,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await itemsCollection.insertOne(newItem as Item);

    const createdItem: Item = {
      ...newItem,
      _id: result.insertedId,
    } as Item;

    return successResponse(createdItem, "Item created successfully", 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse("Invalid JSON in request body", 400);
    }

    console.error("Error creating item:", error);
    return errorResponse("Failed to create item");
  }
}
