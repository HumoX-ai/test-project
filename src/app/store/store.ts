import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/entities/user/api/authApi";
import { productsApi } from "@/entities/product";
import { statisticsApi } from "@/entities/statistics";
import authReducer from "@/entities/user/model/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      statisticsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
