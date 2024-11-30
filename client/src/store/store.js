import { configureStore } from "@reduxjs/toolkit";
import rootRedcuer from "./rootReducer";
import { authAPI } from "./slices/AuthSlice/api/authAPI";

export const appStore = configureStore({
  reducer: rootRedcuer,
  middleware: (defaultMiddleware) => defaultMiddleware().concat(authAPI.middleware)
})