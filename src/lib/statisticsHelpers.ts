import type { StatisticsTask } from "@/entities/statistics";

// Helper functions for statistics calculations
export function getTasksByDate(tasks: StatisticsTask[]) {
  const tasksByDate: Record<string, { completed: number; incomplete: number }> =
    {};

  tasks.forEach((task) => {
    const date = new Date(task.createdAt).toISOString().split("T")[0];
    if (!tasksByDate[date]) {
      tasksByDate[date] = { completed: 0, incomplete: 0 };
    }
    if (task.completed) {
      tasksByDate[date].completed++;
    } else {
      tasksByDate[date].incomplete++;
    }
  });

  return Object.entries(tasksByDate)
    .map(([date, counts]) => ({
      date,
      completed: counts.completed,
      incomplete: counts.incomplete,
      total: counts.completed + counts.incomplete,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTasksByUser(tasks: StatisticsTask[]) {
  const tasksByUser: Record<number, { completed: number; incomplete: number }> =
    {};

  tasks.forEach((task) => {
    if (!tasksByUser[task.userId]) {
      tasksByUser[task.userId] = { completed: 0, incomplete: 0 };
    }
    if (task.completed) {
      tasksByUser[task.userId].completed++;
    } else {
      tasksByUser[task.userId].incomplete++;
    }
  });

  return Object.entries(tasksByUser).map(([userId, counts]) => ({
    userId: `Foydalanuvchi ${userId}`,
    completed: counts.completed,
    incomplete: counts.incomplete,
    total: counts.completed + counts.incomplete,
  }));
}

export function getCompletionRate(tasks: StatisticsTask[]) {
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  return {
    completed,
    incomplete: total - completed,
    total,
    percentage: total > 0 ? ((completed / total) * 100).toFixed(1) : "0",
  };
}

export function getTasksByMonth(tasks: StatisticsTask[]) {
  const tasksByMonth: Record<
    string,
    { completed: number; incomplete: number }
  > = {};

  tasks.forEach((task) => {
    const date = new Date(task.createdAt);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!tasksByMonth[monthKey]) {
      tasksByMonth[monthKey] = { completed: 0, incomplete: 0 };
    }
    if (task.completed) {
      tasksByMonth[monthKey].completed++;
    } else {
      tasksByMonth[monthKey].incomplete++;
    }
  });

  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  return Object.entries(tasksByMonth)
    .map(([monthKey, counts]) => {
      const [year, month] = monthKey.split("-");
      return {
        month: `${months[parseInt(month) - 1]} ${year}`,
        monthKey,
        completed: counts.completed,
        incomplete: counts.incomplete,
        total: counts.completed + counts.incomplete,
      };
    })
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export function getTasksByWeek(tasks: StatisticsTask[]) {
  const tasksByWeek: Record<string, { completed: number; incomplete: number }> =
    {};

  tasks.forEach((task) => {
    const date = new Date(task.createdAt);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!tasksByWeek[weekKey]) {
      tasksByWeek[weekKey] = { completed: 0, incomplete: 0 };
    }
    if (task.completed) {
      tasksByWeek[weekKey].completed++;
    } else {
      tasksByWeek[weekKey].incomplete++;
    }
  });

  return Object.entries(tasksByWeek)
    .map(([weekKey, counts]) => ({
      week: `Hafta ${new Date(weekKey).toLocaleDateString("uz-UZ", {
        month: "short",
        day: "numeric",
      })}`,
      weekKey,
      completed: counts.completed,
      incomplete: counts.incomplete,
      total: counts.completed + counts.incomplete,
    }))
    .sort((a, b) => a.weekKey.localeCompare(b.weekKey));
}
