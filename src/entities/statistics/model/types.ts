export interface TodoFromApi {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface StatisticsTask extends TodoFromApi {
  createdAt: string;
  updatedAt: string;
}
