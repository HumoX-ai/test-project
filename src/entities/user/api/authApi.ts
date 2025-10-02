import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_PRODUCTS_API_BASE_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
    }),
    refreshToken: builder.mutation<LoginResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery, useRefreshTokenMutation } =
  authApi;
