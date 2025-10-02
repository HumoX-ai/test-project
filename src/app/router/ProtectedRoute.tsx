import { useAuth } from "@/entities/user/model/useAuth";
import { Header } from "@/widgets/Header";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="">
      <Header userName={user?.name} />
      <div className="container mx-auto px-2 sm:px-0">{children}</div>
    </div>
  );
}
