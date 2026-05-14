import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SalesChart({ salesData = [] }) {
  const formattedData = salesData.map((item) => ({
    ...item,

    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-[#0f172a]">Growth Trend</h2>

        <p className="text-sm text-gray-500 mt-1">Daily total sales over the selected period</p>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 5,
              right: 5,
              left: -25,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
                fill: "#6b7280",
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
                fill: "#6b7280",
              }}
            />

            <Tooltip
              cursor={{
                fill: "rgba(249,115,22,0.08)",
              }}
              contentStyle={{
                borderRadius: "14px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            />

            <Bar dataKey="sales" fill="#ff7a00" radius={[10, 10, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
