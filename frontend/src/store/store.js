// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { userApi } from "./api/userApi";
import { buildApi } from "./api/buildApi";
import { partApi } from "./api/partApi";

export const store = configureStore({
    reducer: {
        user: userReducer,
        [userApi.reducerPath]: userApi.reducer,
        [buildApi.reducerPath]: buildApi.reducer,
        [partApi.reducerPath]: partApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          userApi.middleware, 
          buildApi.middleware,
          partApi.middleware
        ),
});