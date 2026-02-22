import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/stories";

// ✅ Async Thunk
export const fetchStories = createAsyncThunk(
  "stories/fetchStories",
  async ({ page, search }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}?page=${page}&limit=10&search=${search}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Slice
const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    items: [],
    total: 0,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Named export
export const { setPage } = storiesSlice.actions;

// ✅ Default export
export default storiesSlice.reducer;