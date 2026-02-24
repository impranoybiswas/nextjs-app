import { auth } from "@/libs/auth";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  return auth.handler(request);
}

export async function POST(request: Request) {
  return auth.handler(request);
}
