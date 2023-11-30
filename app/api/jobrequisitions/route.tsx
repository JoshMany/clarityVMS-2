import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("company");
    const salary = searchParams.get("salary");

    let res;

    const realId = parseInt(id);

    if (!id || !salary) {
      res = await prisma.job_requisitions.findMany();
    } else {
      res = await prisma.job_requisitions.findMany({
        where: {
          company_id: realId,
          salary: {
            lt: salary,
          },
        },
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
