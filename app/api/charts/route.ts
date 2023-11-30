import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("owner");
    const dashboardUUID = searchParams.get("dashboard");

    if (dashboardUUID) {
      const res = await prisma.charts.findMany({
        where: {
          dashboard_uuid: dashboardUUID,
        },
      });
      return NextResponse.json(res);
    }
    if (ownerId && !dashboardUUID) {
      const res = await prisma.$queryRaw`SELECT c.uuid , c.chart_name , c.dashboard_uuid FROM charts c LEFT JOIN dashboards d on dashboard_uuid where d.owner_id like ${ownerId}`;
      return NextResponse.json(res);
    }
    if (!ownerId && !dashboardUUID) {
      const res = await prisma.charts.findMany();
      return NextResponse.json(res);
    }
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
