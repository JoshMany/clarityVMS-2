import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import prisma from "@/libs/db";

export async function GET(request: Request) {
  const roles = await prisma.roles.findMany({});
  return NextResponse.json(roles);
}
