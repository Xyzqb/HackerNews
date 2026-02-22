import { configureStore } from "@reduxjs/toolkit";
import storiesReducer from "../features/storiesSlice";

export const store = configureStore({
  reducer: {
    stories: storiesReducer,
  },
});