import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export interface Item {
  _id: string | ObjectId;
  title: string;
  price: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export const successResponse = <T>(
  data: T | null = null,
  message: string = "Success",
  status: number = 200,
) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    } as ApiResponse<T>,
    { status },
  );
};

export const errorResponse = (
  message: string = "Something went wrong",
  status: number = 500,
  errors: unknown = null,
) => {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    } as ApiResponse,
    { status },
  );
};
