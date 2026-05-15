import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodb";
import { errorResponse, Item, successResponse } from "@/utils/response";
import { NextRequest } from "next/server";
import { z } from "zod";

const UpdateItemSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  price: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().min(0).optional(),
  ),
  description: z.string().max(500).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return errorResponse("Invalid item ID format", 400);
    }

    const itemsCollection = await getCollection<Item>("items");
    const item = await itemsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return errorResponse("Item not found", 404);
    }

    return successResponse(item, "Item fetched successfully");
  } catch (error) {
    console.error("Error fetching item:", error);
    return errorResponse("Failed to fetch item");
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return errorResponse("Invalid item ID format", 400);
    }

    const body = await req.json();
    const validation = UpdateItemSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Validation failed",
        400,
        validation.error.flatten().fieldErrors,
      );
    }

    const updateData = {
      ...validation.data,
      updatedAt: new Date(),
    };

    const itemsCollection = await getCollection<Item>("items");
    const result = await itemsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) {
      return errorResponse("Item not found", 404);
    }

    return successResponse(result, "Item updated successfully");
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse("Invalid JSON in request body", 400);
    }
    console.error("Error updating item:", error);
    return errorResponse("Failed to update item");
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return errorResponse("Invalid item ID format", 400);
    }

    const itemsCollection = await getCollection<Item>("items");
    const result = await itemsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return errorResponse("Item not found", 404);
    }

    return successResponse(null, "Item deleted successfully");
  } catch (error) {
    console.error("Error deleting item:", error);
    return errorResponse("Failed to delete item");
  }
}
