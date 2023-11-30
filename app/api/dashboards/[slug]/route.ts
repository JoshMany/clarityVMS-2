import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const res = await prisma.dashboards.findUnique({
      where: {
        uuid: slug,
      },
    });

    if (!res) {
      return NextResponse.json(
        {
          message: "Data not found",
        },
        { status: 500 }
      );
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
