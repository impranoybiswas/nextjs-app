"use server";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { revalidatePath } from "next/cache";

export interface User {
  id: string;
  name: string;
  email: string;
}

export type ActionResponse = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * Helper function to initialize and authenticate with the Google Sheet
 */
async function getGoogleSheet() {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID!,
      serviceAccountAuth,
    );
    await doc.loadInfo();
    return doc.sheetsByIndex[0];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Google Sheet Connection Error:", message);
    throw new Error("Failed to connect to Google Sheets");
  }
}

/**
 * 1. CREATE - Add a new row to the sheet
 */
export async function createUser(user: Omit<User, "id">): Promise<ActionResponse> {
  try {
    // Check if name and email are provided
    if (!user.name || !user.email) {
      return { success: false, message: "Name and email are required." };
    }
    const sheet = await getGoogleSheet();
    const id = Date.now().toString(); // Generate unique timestamp ID

    // Add row (Keys must match the header names in the Google Sheet exactly)
    await sheet.addRow({
      id,
      name: user.name,
      email: user.email,
    });

    revalidatePath("/google");
    return { success: true, message: "Successfully added to Google Sheet!" };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Create User Error:", errorMessage);
    return {
      success: false,
      message: "Failed to add data. Please check your configuration.",
      error: errorMessage,
    };
  }
}

/**
 * 2. READ - Fetch all rows from the sheet
 */
export async function getUsers(): Promise<User[]> {
  try {
    const sheet = await getGoogleSheet();
    const rows = await sheet.getRows();

    // Map rows to clean JavaScript objects matching the User interface
    return rows.map((row) => ({
      id: row.get("id") || "",
      name: row.get("name") || "",
      email: row.get("email") || "",
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Get Users Error:", errorMessage);
    return [];
  }
}

/**
 * 3. UPDATE - Edit existing row data matching the target ID
 */
export async function updateUser(updatedUser: User): Promise<ActionResponse> {
  try {
    const sheet = await getGoogleSheet();
    const rows = await sheet.getRows();

    // Find the row where the ID matches
    const targetRow = rows.find((row) => row.get("id") === updatedUser.id);

    if (!targetRow) {
      return { success: false, message: "Record not found in the sheet." };
    }

    // Assign new values to the columns
    targetRow.set("name", updatedUser.name);
    targetRow.set("email", updatedUser.email);
    
    // Save modifications to Google Servers
    await targetRow.save();

    revalidatePath("/google");
    return { success: true, message: "Successfully updated the record!" };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Update User Error:", errorMessage);
    return {
      success: false,
      message: "Failed to update record.",
      error: errorMessage,
    };
  }
}

/**
 * 4. DELETE - Remove a row matching the target ID
 */
export async function deleteUser(id: string): Promise<ActionResponse> {
  try {
    const sheet = await getGoogleSheet();
    const rows = await sheet.getRows();

    // Find the row where the ID matches
    const targetRow = rows.find((row) => row.get("id") === id);

    if (!targetRow) {
      return { success: false, message: "Record not found in the sheet." };
    }

    // Delete the row from the sheet
    await targetRow.delete();

    revalidatePath("/google");
    return { success: true, message: "Successfully removed from Google Sheet!" };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Delete User Error:", errorMessage);
    return {
      success: false,
      message: "Failed to delete record.",
      error: errorMessage,
    };
  }
}