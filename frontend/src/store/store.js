import { configureStore } from '@reduxjs/toolkit';
import componentReducer from './slices/componentSlice';

export const store = configureStore({
  reducer: {
    component: componentReducer,
    // Add other reducers here if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.date'], // for the saved build date
        // Ignore these paths in the state
        ignoredPaths: ['component.savedBuilds'], // for the saved builds array
      },
    }),
});

// Optional: TypeScript support for RootState and AppDispatch
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;