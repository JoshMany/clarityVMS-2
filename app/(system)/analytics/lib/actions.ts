"use server";
import prisma from "@/libs/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Layout } from "react-grid-layout";

const GetUserSession = async () => {
  const Session = await getServerSession(authOptions);
  return Session.user;
};

//Layout
export const SaveLayoutChanges = async ({
  ActiveLayout,
}: {
  ActiveLayout: Layout[];
}) => {
  type NewType = {
    uuid: string;
    width: number;
    height: number;
    x_axis: number;
    y_axis: number;
  };

  const LayoutReformed: NewType[] = ActiveLayout.map((widget) => ({
    uuid: widget.i,
    width: widget.w,
    height: widget.h,
    x_axis: widget.x,
    y_axis: widget.y,
  }));

  await Promise.all(
    LayoutReformed.map(
      async (layout) =>
        await prisma.charts.update({
          where: { uuid: layout.uuid },
          data: layout,
        })
    )
  );
};

// Dashboards
export const CheckDashboardExistence = async ({
  dashboardName,
}: {
  dashboardName: string;
}) => {
  const currentSession = await GetUserSession();

  const ComparedDashboard = await prisma.dashboards.findFirst({
    where: {
      dashboard_name: dashboardName,
      owner_id: currentSession.uuid,
    },
  });

  if (ComparedDashboard) {
    return { message: "Dashboard name in use", status: "false" };
  } else {
    return { message: "Dashboard name available", status: "true" };
  }
};

export const CreateDashboard = async ({
  dashboardName,
}: {
  dashboardName: string;
}) => {
  const currentSession = await GetUserSession();

  const CreateDashboard = await prisma.dashboards.create({
    data: {
      dashboard_name: dashboardName,
      owner_id: currentSession.uuid,
    },
  });

  if (CreateDashboard) {
    return {
      message: "Dashboard " + CreateDashboard.uuid + " created.",
      status: "true",
      dashboardUUID: CreateDashboard.uuid,
    };
  } else {
    return {
      message: "Error on dashboard creation.",
      status: "false",
    };
  }
};

export const DeleteDashboard = async ({
  dashboardUUID,
}: {
  dashboardUUID: string;
}) => {
  const currentSession = await GetUserSession();

  const DashboardCount = await prisma.dashboards.count({
    where: { owner_id: currentSession.uuid },
  });

  if (DashboardCount <= 1) {
    return {
      message: "It's not possible to delete your only dashboard.",
      status: false,
    };
  } else {
    const DeleteDashboardResponse = await prisma.dashboards.delete({
      where: {
        uuid: dashboardUUID,
        owner_id: currentSession.uuid,
      },
    });

    if (DeleteDashboardResponse) {
      return {
        message: "Dashboard " + DeleteDashboardResponse.uuid + " deleted.",
        status: true,
        deletedDashboardUUID: DeleteDashboardResponse.uuid,
      };
    } else {
      return {
        message: "Error on dashboard deletion.",
        status: false,
      };
    }
  }
};

export const DuplicateDashboard = async ({
  dashboardUUID,
}: {
  dashboardUUID: string;
}) => {
  try {
    const currentSession = await GetUserSession();

    const DashboardNameToDuplicate = await prisma.dashboards.findFirst({
      where: {
        uuid: dashboardUUID,
        owner_id: currentSession.uuid,
      },
      select: {
        dashboard_name: true,
      },
    });

    const NameForDashboard =
      "Copy of " + DashboardNameToDuplicate?.dashboard_name?.toLowerCase();

    const DuplicatedDashboard = await prisma.dashboards.create({
      data: {
        dashboard_name: NameForDashboard,
        owner_id: currentSession.uuid,
      },
    });

    const ChartsToDuplicate = await prisma.charts.findMany({
      where: {
        dashboard_uuid: dashboardUUID,
      },
      select: {
        chart_name: true,
        height: true,
        width: true,
        x_axis: true,
        y_axis: true,
        dashboard_uuid: true,
      },
    });

    for (const element of ChartsToDuplicate) {
      element.dashboard_uuid = DuplicatedDashboard.uuid;
    }

    await prisma.charts.createMany({
      data: ChartsToDuplicate,
    });

    return {
      message:
        "Dashboard " +
        dashboardUUID +
        " duplicated on the " +
        DuplicatedDashboard.uuid +
        " dashboard.",
      status: true,
      duplicatedDashboardUUID: DuplicatedDashboard.uuid,
    };
  } catch (error) {
    return {
      message: "Error on dashboard duplication.",
      status: false,
    };
  }
};

// Charts
export const CreateChart = async ({
  dashboardUUID,
}: {
  dashboardUUID: string;
}) => {
  const CreateChartResponse = await prisma.charts.create({
    data: {
      chart_name: "Chart",
      width: 4,
      height: 4,
      x_axis: 0,
      y_axis: 0,
      dashboard_uuid: dashboardUUID,
    },
  });

  if (CreateChartResponse) {
    return {
      message: "Dashboard " + CreateChartResponse.uuid + " deleted.",
      status: true,
      createdChartUUID: CreateChartResponse.uuid,
    };
  } else {
    return {
      message: "Error on chart creation.",
      status: false,
    };
  }
};

export const DeleteChart = async ({ chartUUID }: { chartUUID: string }) => {
  const DeletedChart = await prisma.charts.delete({
    where: {
      uuid: chartUUID,
    },
  });

  if (DeletedChart) {
    return {
      message: "Chart " + DeletedChart.uuid + " deleted.",
      status: true,
    };
  } else {
    return {
      message: "Error on deleting chart.",
      status: false,
    };
  }
};

export const DuplicateChart = async ({ chartUUID }: { chartUUID: string }) => {
  const OriginalChart = await prisma.charts.findUnique({
    where: {
      uuid: chartUUID,
    },
    select: {
      chart_name: true,
      dashboard_uuid: true,
      height: true,
      width: true,
      x_axis: true,
      y_axis: true,
    },
  });

  if (OriginalChart) {
    OriginalChart.x_axis = 0;
    OriginalChart.y_axis = 0;

    const DuplicatedChart = await prisma.charts.create({
      data: OriginalChart,
    });

    if (DuplicatedChart) {
      return (
        "The chart " +
        OriginalChart.chart_name +
        " was duplicated into the chart " +
        DuplicatedChart.uuid +
        "."
      );
    } else {
      return "Error on duplicate chart.";
    }
  }
  return "Error on duplicate chart.";
};
