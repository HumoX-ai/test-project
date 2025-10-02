import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./ProtectedRoute";

const LoginPage = lazy(() =>
  import("@/pages/auth").then((m) => ({ default: m.LoginPage }))
);
const ProjectsPage = lazy(() =>
  import("@/pages/projects").then((m) => ({ default: m.ProjectsPage }))
);
const TasksPage = lazy(() =>
  import("@/pages/tasks").then((m) => ({ default: m.TasksPage }))
);
const StatisticsPage = lazy(() =>
  import("@/pages/statistics").then((m) => ({ default: m.StatisticsPage }))
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <ProjectsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <TasksPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <StatisticsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
