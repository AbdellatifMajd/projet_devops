import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  bookingList: [],
  isLoading: false,
};

// URL de base de votre API Spring Boot
const API_URL = "http://localhost:8080/api/bookings";

export const createNewBooking = createAsyncThunk(
  "booking/createNewBooking",
  async (
    { userId, roomId, checkInDate, checkOutDate },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${API_URL}/add`, {userId, roomId, checkInDate, checkOutDate}, {
            withCredentials: true,        
            headers: { "Content-Type": "application/json" }
        });

        console.log("check in date: ", checkInDate)
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response?.data);
    }
  },
);

// Récupérer toutes les réservations d'un utilisateur
export const fetchUserBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async (userId) => {
    const response = await axios.get(`${API_URL}/user/${userId}`);

    return response.data;
  },
);

// Supprimer une réservation
export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async ({ userId, bookingId }) => {
    const response = await axios.delete(
      `${API_URL}/delete/${userId}/${bookingId}`,
    );

    return response.data;
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ADD BOOKING
      .addCase(createNewBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(state.bookingList)) {
        state.bookingList.push(action.payload.data);
    } else {
        state.bookingList = [action.payload.data];
    }
      })
      .addCase(createNewBooking.rejected, (state) => {
        state.isLoading = false;
      })

      // FETCH BOOKINGS
      .addCase(fetchUserBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookingList = action.payload.data;
      })
      .addCase(fetchUserBookings.rejected, (state) => {
        state.isLoading = false;
        state.bookingList = [];
      })

      // DELETE BOOKING
      .addCase(deleteBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        // On met à jour la liste avec les données renvoyées par le serveur après suppression
        state.bookingList = action.payload.data;
      })
      .addCase(deleteBooking.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default bookingSlice.reducer;
