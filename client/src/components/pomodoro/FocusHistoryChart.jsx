import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
function FocusHistoryChart({ data }) {
  const chartData = data.map((d) => ({
    label: d.label,
    hours: +(d.seconds / 3600).toFixed(2)
  }));
  return <div className="w-full h-36">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <XAxis
    dataKey="label"
    tick={{ fill: "#6b7280", fontSize: 11 }}
    axisLine={false}
    tickLine={false}
  />
          <Tooltip
    cursor={{ fill: "rgba(99,102,241,0.08)" }}
    contentStyle={{
      backgroundColor: "#1f2937",
      border: "1px solid #374151",
      borderRadius: 12,
      color: "#f3f4f6",
      fontSize: 12
    }}
    formatter={(value) => [`${value} hrs`, "Focus"]}
  />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={i === chartData.length - 1 ? "#a78bfa" : "#6366f1"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>;
}
export {
  FocusHistoryChart
};
