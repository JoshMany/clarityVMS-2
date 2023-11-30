import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/db";
import { Toolsbar } from "./components/Toolsbar";
import GridLayoutComponent from "./components/GridLayout";

export default async function Analytics() {
  const session = await getServerSession(authOptions);
  const userUUID: string = await session.user.id;

  //Search for any dashboard ↴
  const initialDashboardsSearch = await prisma.dashboards.findMany({
    where: {
      owner_id: userUUID,
    },
    orderBy: [{ updated_at: "desc" }],
  });

  //User has no dashboards? Then let's create one for him ↴
  if (initialDashboardsSearch.length === 0) {
    await prisma.dashboards.create({
      data: {
        dashboard_name: "Dashboard",
        owner_id: userUUID,
      },
    });
  }

  //Let's search again for the dashboards ↴
  const fallBackDashboards = await prisma.dashboards.findMany({
    where: {
      owner_id: userUUID,
    },
    orderBy: [{ updated_at: "desc" }],
  });

  //Let's check if the first Dashboard displayes has charts ↴
  const charts = await prisma.charts.findMany({
    where: {
      dashboard_uuid: fallBackDashboards[0].uuid,
    },
  });

  return (
    <div className="w-full">
      <Toolsbar userUUID={userUUID} prefetchedDashboards={fallBackDashboards} />
      <GridLayoutComponent chartsFallback={charts} />
    </div>
  );
}
