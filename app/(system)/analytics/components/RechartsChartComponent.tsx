import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Legend,
  Line,
} from "recharts";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const ChartComponent = () => {
  const { data: mockedData } = useSWR(
    "/api/jobrequisitions?company=100&salary=1800&salaryRelation=lessThan",
    fetcher
  );

  return (
    <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mockedData}
          margin={{
            top: 5,
            right: 15,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="job_title" />
          <YAxis yAxisId="yAxis" domain={[0, 1800]} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId={"yAxis"}
            type="monotone"
            dataKey="salary"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
