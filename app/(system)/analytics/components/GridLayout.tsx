"use client";
import useSWR from "swr";
import GridLayout, { WidthProvider } from "react-grid-layout";
import { useEffect, useMemo, useState } from "react";
import { Image } from "@nextui-org/react";
import { useDashboardState } from "@/store/analytics";
import "react-grid-layout/css/styles.css";
import "./GridPlaceholderOverride.css";
// import { ChartComponent } from "../RechartsChartComponent";
import { WidgetTopbar } from "./WidgetTopbar";
import { SaveLayoutChanges } from "../lib/actions";
import { Dot } from "lucide-react";
import { Chart, ChartComponent, Series } from "./RechartsChartComponent";

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

const DashboardEmptyState = () => {
  return (
    <div className="w-full text-center flex flex-col items-center mt-10">
      <Image
        loading="eager"
        width={700}
        src="dashboard_empty_state.svg"
        alt="NextUI hero Image"
      />
      <h2 className="text-2xl">Review your data using widgets</h2>
      <p className="text-lg">
        Create a new widget and start optimizing your work
      </p>
    </div>
  );
};

export default function GridLayoutComponent({
  chartsFallback,
}: {
  chartsFallback: any[];
}) {
  const { activeDashboard } = useDashboardState();

  const { data: charts } = useSWR(
    `/api/charts?dashboard=${activeDashboard}`,
    fetcher,
    {
      fallbackData: chartsFallback,
    }
  );

  const AdjustedGridLayout = useMemo(() => WidthProvider(GridLayout), []);

  const [DataGridLayout, setDataGridLayout] = useState<
    {
      w: number;
      h: number;
      x: number;
      y: number;
      i: string;
    }[]
  >([]);

  useEffect(() => {
    if (charts) {
      charts.map(
        (chart: {
          width: number;
          height: number;
          x_axis: number;
          y_axis: number;
          chart_name: string;
          uuid: string;
        }) => {
          const newObject = {
            w: chart.width,
            h: chart.height,
            x: chart.x_axis,
            y: chart.y_axis,
            i: chart.uuid,
          };
          setDataGridLayout((prevState) => [...prevState, newObject]);
        }
      );
    }
  }, [charts]);

  return (
    <>
      {charts?.length > 0 ? (
        <AdjustedGridLayout
          cols={24}
          margin={[12, 12]}
          rowHeight={56}
          layout={DataGridLayout}
          draggableHandle=".drag-handle"
          className="select-none mb-10"
          resizeHandle={
            <div className="absolute hidden cursor-pointer -bottom-2 -right-2 group-hover:text-primary group-hover:block">
              <Dot strokeWidth={16} />
            </div>
          }
          onLayoutChange={(layout) =>
            SaveLayoutChanges({ ActiveLayout: layout })
          }
        >
          {charts?.map(
            (chart: {
              width: number;
              height: number;
              x_axis: number;
              y_axis: number;
              chart_name: string;
              uuid: string;
            }) => (
              <div
                key={chart.uuid}
                className="flex flex-col border hover:border-primary absolute rounded-2xl bg-background group"
                data-grid={{
                  x: chart.x_axis,
                  y: chart.y_axis,
                  w: chart.width,
                  h: chart.height,
                  minW: 4,
                  minH: 3,
                }}
              >
                <WidgetTopbar
                  chartName={chart.chart_name}
                  chartUUID={chart.uuid}
                />
                <ChartComponent />
              </div>
            )
          )}
        </AdjustedGridLayout>
      ) : (
        <DashboardEmptyState />
      )}
    </>
  );
}
