import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

function FocusHistoryChart({ data }) {
  const chartData = data.map((d) => ({
    label: d.label,
    hours: +(d.seconds / 3600).toFixed(2),
  }));

  const brandMint = "#28e99f";
  const brandMintMuted = "rgba(40, 233, 159, 0.4)";
  const surface = "#181724";
  const border = "rgba(85, 83, 104, 0.5)";
  const textMuted = "#6b6980";

  return (
    <div className="w-full h-40 mt-2 p-2 rounded-[4px] border border-border/40 bg-surface/30">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: textMuted, fontSize: 10, fontFamily: "Space Mono", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              backgroundColor: surface,
              border: `1px solid ${border}`,
              borderRadius: "4px",
              color: "#f4f4f7",
              fontFamily: "Space Mono",
              fontSize: "11px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
            }}
            formatter={(value) => [`${value} hrs`, "FOCUS DURATION"]}
          />
          <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell
                key={i}
                fill={i === chartData.length - 1 ? brandMint : brandMintMuted}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { FocusHistoryChart };
