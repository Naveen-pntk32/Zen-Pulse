import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

function FocusHistoryChart({ data }) {
  const chartData = data.map((d) => ({
    label: d.label,
    hours: +(d.seconds / 3600).toFixed(2),
  }));

  // Read CSS var values roughly for chart
  const brandBlue = "#4772fa";
  const brandBlueMuted = "rgba(71,114,250,0.5)";
  const surface = "#1f2228"; // approximate
  const border = "#2d333b"; // approximate
  const textMuted = "#6b7280";

  return (
    <div className="w-full h-40 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: textMuted, fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              backgroundColor: surface,
              border: `1px solid ${border}`,
              borderRadius: "12px",
              color: "#e5e7eb",
              fontSize: "12px",
              fontWeight: 500,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
            }}
            formatter={(value) => [`${value} hrs`, "Focus"]}
          />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell
                key={i}
                fill={i === chartData.length - 1 ? brandBlue : brandBlueMuted}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { FocusHistoryChart };
