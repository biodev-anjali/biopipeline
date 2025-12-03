import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22D3EE", "#1E293B"];

export default function ResultCard({ data }) {
  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
        No analysis yet. Provide a filename to fetch stats.
      </div>
    );
  }

  const gcData = [
    { name: "GC%", value: data.gc_percent },
    { name: "AT%", value: 100 - data.gc_percent },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{data.filename}</h3>
          <p className="text-sm text-slate-400">Total length: {data.length} bp</p>
          <p className="mt-4 text-sm text-slate-300">
            Preview:
            <span className="mt-1 block rounded bg-slate-950/60 p-3 font-mono text-xs text-slate-200">
              {data.sequence_preview}
            </span>
          </p>
        </div>
        <div className="flex-1 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gcData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
              >
                {gcData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

