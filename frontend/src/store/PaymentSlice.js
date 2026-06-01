import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { confirmPaymentOnServer, createPaymentIntent } from "./PaymentApi";

export const initializePayment = createAsyncThunk(
  "payment/initialize",
  async ({ amountInCentimes, bookingIds }, { rejectWithValue }) => {
    try {
      const data = await createPaymentIntent(amountInCentimes, bookingIds);
      return data.clientSecret;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const confirmPayment = createAsyncThunk(
  "payment/confirm",
  async ({ paymentIntentId, bookingIds }, { rejectWithValue }) => {
    try {
      return await confirmPaymentOnServer(paymentIntentId, bookingIds);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    clientSecret: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.clientSecret = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializePayment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.status = "idle";
        state.clientSecret = action.payload;
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(confirmPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(confirmPayment.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;