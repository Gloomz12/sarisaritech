import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", sales: 2000 },
  { day: "Tue", sales: 3000 },
  { day: "Wed", sales: 2500 },
  { day: "Thu", sales: 4000 },
  { day: "Fri", sales: 5000 },
];

export default function StatisticsChart() {
  return (
    <div className="mt-8 rounded-2xl border bg-white p-6">
      <h3 className="mb-6 text-2xl font-bold">Sales Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#fdba74",
              strokeWidth: 2,
              strokeDasharray: "4 4",
            }}
          />

          <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        className="
          rounded-2xl

          border
          border-[#e2e8f0]

          bg-white

          px-4
          py-3

          shadow-[0_10px_30px_rgba(15,23,42,0.08)]
        "
      >
        <p
          className="
            text-[13px]
            font-semibold

            text-[#64748b]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1

            text-[18px]
            font-bold

            text-orange-500
          "
        >
          ₱{payload[0].value}
        </p>
      </div>
    );
  }

  return null;
}
