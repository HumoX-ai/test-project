import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";

export function useAuth() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);
  return { isAuthenticated, user };
}
