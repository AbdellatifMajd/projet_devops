import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: true, 
    clientRoomList: [], 
    error: null 
}

export const fetchFilteredRooms = createAsyncThunk(
  "filteredRooms/fetchFilteredRooms", 

  async ({ filterParams, sortParams}, {rejectWithValue }) => {
  const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });   
    
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/rooms/get-filteredRooms?${query}`, { withCredentials: true });
      console.log(response.data, "response");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const clientRoomSlice= createSlice({
    name: "bookingRoomSlice", 
    initialState,
    reducers: {}, 
    extraReducers: (builder) => {
            builder
            // Fetch
            .addCase(fetchFilteredRooms.pending, (state) => { state.loading = true; })
            .addCase(fetchFilteredRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.clientRoomList = action.payload.success ? action.payload.data : action.payload;
            })
            .addCase(fetchFilteredRooms.rejected, (state) => {
                state.loading = false;
                state.clientRoomList = [];
            })
        }
})

export default clientRoomSlice.reducer;