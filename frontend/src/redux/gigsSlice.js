import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import gigService from "../services/gigService";

const initialState = {
  gigs: [],
  currentGig: null,
  myGigs: [],
  isLoading: false,
  error: null,
};

export const fetchGigs = createAsyncThunk(
  "gigs/fetchGigs",
  async (searchTerm = "", { rejectWithValue }) => {
    try {
      const response = await gigService.getGigs(searchTerm);
      return response.gigs;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch gigs"
      );
    }
  }
);

export const fetchGigById = createAsyncThunk(
  "gigs/fetchGigById",
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await gigService.getGigById(gigId);
      return response.gig;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch gig"
      );
    }
  }
);

export const createGig = createAsyncThunk(
  "gigs/createGig",
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await gigService.createGig(gigData);
      return response.gig;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create gig"
      );
    }
  }
);

export const fetchMyGigs = createAsyncThunk(
  "gigs/fetchMyGigs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await gigService.getMyGigs();
      return response.gigs;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your gigs"
      );
    }
  }
);

const gigsSlice = createSlice({
  name: "gigs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchGigById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGig = action.payload;
      })
      .addCase(fetchGigById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs.unshift(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGigs = action.payload;
      })
      .addCase(fetchMyGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentGig } = gigsSlice.actions;
export default gigsSlice.reducer;
