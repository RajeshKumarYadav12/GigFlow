import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bidService from "../services/bidService";

const initialState = {
  bids: [],
  myBids: [],
  isLoading: false,
  error: null,
};

export const createBid = createAsyncThunk(
  "bids/createBid",
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await bidService.createBid(bidData);
      return response.bid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create bid"
      );
    }
  }
);

export const fetchBidsForGig = createAsyncThunk(
  "bids/fetchBidsForGig",
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await bidService.getBidsForGig(gigId);
      return response.bids;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bids"
      );
    }
  }
);

export const fetchMyBids = createAsyncThunk(
  "bids/fetchMyBids",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bidService.getMyBids();
      return response.bids;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your bids"
      );
    }
  }
);

export const hireBid = createAsyncThunk(
  "bids/hireBid",
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await bidService.hireBid(bidId);
      return response.bid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to hire freelancer"
      );
    }
  }
);

const bidsSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBids: (state) => {
      state.bids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids.push(action.payload);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBidsForGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBidsForGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids = action.payload;
      })
      .addCase(fetchBidsForGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids = action.payload;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(hireBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bids.findIndex(
          (bid) => bid._id === action.payload._id
        );
        if (index !== -1) {
          state.bids[index] = action.payload;
        }
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearBids } = bidsSlice.actions;
export default bidsSlice.reducer;
