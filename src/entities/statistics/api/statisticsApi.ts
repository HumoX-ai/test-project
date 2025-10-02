import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TodoFromApi, StatisticsTask } from "../model/types";

// Helper function to generate random date between two dates
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_STATISTICS_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getStatisticsTasks: builder.query<StatisticsTask[], void>({
      query: () => "/todos",
      transformResponse: (response: TodoFromApi[]) => {
        const startDate = new Date("2025-08-01");
        const endDate = new Date();

        return response.map((task) => {
          const createdAt = randomDate(startDate, endDate);
          const updatedAt = randomDate(createdAt, endDate);

          return {
            ...task,
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
          };
        });
      },
    }),
  }),
});

export const { useGetStatisticsTasksQuery } = statisticsApi;
