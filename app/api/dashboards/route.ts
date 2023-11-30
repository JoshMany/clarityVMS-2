import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("owner");

    let res;

    if (!ownerId) {
      res = await prisma.dashboards.findMany();
    } else {
      res = await prisma.dashboards.findMany({
        where: {
          owner_id: ownerId,
        },
        orderBy: [
          {
            updated_at: "desc",
          },
        ],
      });
    }

    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        {
          status: 500,
        }
      );
    }
  }
}
