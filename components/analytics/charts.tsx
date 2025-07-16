import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface BaseChartProps {
  height?: number;
}

interface PeakHoursData {
  hour: number;
  count: number;
}

interface CategoryPerformanceData {
  category: string;
  revenue: number;
  count: number;
}

interface TrendData {
  date: string;
  revenue?: number;
  orders?: number;
}

export function PeakHoursChart({ data, height = 300 }: BaseChartProps & { data: PeakHoursData[] }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryPerformanceChart({ data, height = 300 }: BaseChartProps & { data: CategoryPerformanceData[] }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="revenue"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RevenueChart({ data, height = 300 }: BaseChartProps & { data: TrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          name="Revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function OrderTrendChart({ data, height = 300 }: BaseChartProps & { data: TrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#82ca9d"
          name="Orders"
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 