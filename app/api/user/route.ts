import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import prisma from "@/libs/db";

export async function GET(request: Request) {
  const users = await prisma.users.findMany({});
  return NextResponse.json(users);
}
