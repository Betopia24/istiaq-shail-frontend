import { configureStore, combineReducers } from "@reduxjs/toolkit";
import baseApi from "./api/baseApi";
import userReducer from "@/feature/user/userSlice";

// No redux-persist: the session comes from the server on each load, so nothing sensitive sits in localStorage.
const rootReducer = combineReducers({
  user: userReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
