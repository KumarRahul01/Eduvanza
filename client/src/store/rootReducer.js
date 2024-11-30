import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice/authSlice"
import { authAPI } from "./slices/AuthSlice/api/authAPI";


const rootRedcuer = combineReducers({
  [authAPI.reducerPath]: authAPI.reducer,
  // [courseApi.reducerPath]: courseApi.reducer,
  // [purchaseApi.reducerPath]: purchaseApi.reducer,
  // [courseProgressApi.reducerPath]: courseProgressApi.reducer,
  auth: authReducer,
});
export default rootRedcuer;