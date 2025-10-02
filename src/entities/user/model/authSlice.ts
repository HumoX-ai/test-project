import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../api/authApi";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const loadUserFromStorage = (): User | null => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!localStorage.getItem("access_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        tokens: { access_token: string; refresh_token: string };
      }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("access_token", action.payload.tokens.access_token);
      localStorage.setItem(
        "refresh_token",
        action.payload.tokens.refresh_token
      );
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
