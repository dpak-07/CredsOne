import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Analytics() {
  const pieData = [
    { name: "Verified", value: 4 },
    { name: "Pending", value: 2 },
    { name: "Revoked", value: 1 }
  ];

  const lineData = [
    { name: "Jan", certs: 2 },
    { name: "Feb", certs: 4 },
    { name: "Mar", certs: 6 },
    { name: "Apr", certs: 3 },
    { name: "May", certs: 7 }
  ];

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Line Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="certs"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
