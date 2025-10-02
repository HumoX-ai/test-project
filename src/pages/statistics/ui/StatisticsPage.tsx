import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  getTasksByMonth,
  getTasksByUser,
  getCompletionRate,
} from "@/lib/statisticsHelpers";
import { useGetStatisticsTasksQuery } from "@/entities/statistics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, CheckCircle2, Circle, Users, Loader2 } from "lucide-react";

export function StatisticsPage() {
  const { data: tasks, isLoading, error } = useGetStatisticsTasksQuery();

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !tasks) {
    return (
      <div>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Ma'lumotlarni yuklashda xatolik yuz berdi
          </p>
        </div>
      </div>
    );
  }

  const completionRate = getCompletionRate(tasks);
  const tasksByMonth = getTasksByMonth(tasks);
  const tasksByUser = getTasksByUser(tasks);

  const barChartConfig = {
    completed: {
      label: "Bajarilgan",
      color: "var(--color-chart-1)",
    },
    incomplete: {
      label: "Bajarilmagan",
      color: "var(--color-chart-2)",
    },
  } satisfies ChartConfig;

  const pieChartConfig = {
    completed: {
      label: "Bajarilgan",
      color: "var(--color-chart-1)",
    },
    incomplete: {
      label: "Bajarilmagan",
      color: "var(--color-chart-2)",
    },
  } satisfies ChartConfig;

  const pieData = [
    {
      name: "Bajarilgan",
      value: completionRate.completed,
      fill: "var(--color-chart-1)",
    },
    {
      name: "Bajarilmagan",
      value: completionRate.incomplete,
      fill: "var(--color-chart-2)",
    },
  ];

  const userChartConfig = {
    completed: {
      label: "Bajarilgan",
      color: "var(--color-chart-3)",
    },
    incomplete: {
      label: "Bajarilmagan",
      color: "var(--color-chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <div className="py-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Statistika</h1>
        <p className="text-muted-foreground">
          Vazifalar bo'yicha batafsil statistik ma'lumotlar
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jami vazifalar
            </CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Barcha vazifalar soni
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bajarilgan</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completionRate.completed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completionRate.percentage}% bajarilgan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bajarilmagan</CardTitle>
            <Circle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {completionRate.incomplete}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(100 - parseFloat(completionRate.percentage)).toFixed(1)}%
              bajarilmagan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Foydalanuvchilar
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByUser.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Faol foydalanuvchilar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Completion Rate Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bajarilish ko'rsatkichi</CardTitle>
            <CardDescription>
              Bajarilgan va bajarilmagan vazifalar nisbati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={pieChartConfig}
              className="h-[300px] w-full"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Oylik tendentsiya</CardTitle>
            <CardDescription>Har oy yaratilgan vazifalar soni</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={barChartConfig}
              className="h-[300px] w-full"
            >
              <AreaChart data={tasksByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.split(" ")[0].slice(0, 3)}
                />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="var(--color-chart-1)"
                  fill="var(--color-chart-1)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="incomplete"
                  stackId="1"
                  stroke="var(--color-chart-2)"
                  fill="var(--color-chart-2)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Oylik taqsimot</CardTitle>
            <CardDescription>
              Bajarilgan va bajarilmagan vazifalar oylar bo'yicha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={barChartConfig}
              className="h-[300px] w-full"
            >
              <BarChart data={tasksByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.split(" ")[0].slice(0, 3)}
                />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="completed"
                  fill="var(--color-chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="incomplete"
                  fill="var(--color-chart-2)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Foydalanuvchi ko'rsatkichlari</CardTitle>
            <CardDescription>
              Har bir foydalanuvchining bajarilishi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={userChartConfig}
              className="h-[300px] w-full"
            >
              <BarChart data={tasksByUser} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="userId"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="completed"
                  fill="var(--color-chart-3)"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="incomplete"
                  fill="var(--color-chart-4)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Eng yaxshi oy</CardTitle>
            <CardDescription>Eng ko'p vazifa bajarilgan davr</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const bestMonth = tasksByMonth.reduce((max, month) =>
                month.completed > max.completed ? month : max
              );
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {bestMonth.month}
                    </span>
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {bestMonth.completed} ta vazifa bajarilgan
                  </p>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Bajarilish darajasi</span>
                      <span className="font-medium">
                        {(
                          (bestMonth.completed / bestMonth.total) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (bestMonth.completed / bestMonth.total) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eng faol foydalanuvchi</CardTitle>
            <CardDescription>
              Eng ko'p vazifa yaratgan foydalanuvchi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const topUser = tasksByUser.reduce((max, user) =>
                user.total > max.total ? user : max
              );
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{topUser.userId}</span>
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {topUser.total} ta vazifa yaratgan
                  </p>
                  <div className="pt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Bajarilgan</span>
                      <span className="font-medium">
                        {topUser.completed} ta
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Bajarilmagan</span>
                      <span className="font-medium">
                        {topUser.incomplete} ta
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
