import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", sales: 2000 },
  { day: "Tue", sales: 3000 },
  { day: "Wed", sales: 2500 },
  { day: "Thu", sales: 4000 },
  { day: "Fri", sales: 5000 },
];

export default function StatisticsChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border mt-8">
      <h3 className="text-2xl font-bold mb-6">Sales Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#f97316"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
