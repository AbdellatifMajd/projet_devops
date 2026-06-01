import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/rooms";

const initialState = {
    loading: false, 
    roomList: [],
    error: null
}

// FETCH ALL
export const fetchAllRooms = createAsyncThunk(
  "adminRooms/fetchAllRooms", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ADD
export const addRoom = createAsyncThunk("adminRooms/addRoom", async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/add`, formData, {
            withCredentials: true,        
            headers: { "Content-Type": "application/json" }
        }); 
        return response.data; 
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

// EDIT
export const editRoom = createAsyncThunk(
  "adminRooms/editRoom",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/edit/${id}`, formData, {
            withCredentials: true, // Crucial si tu utilises des cookies/sessions
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
  }
);

// DELETE
export const deleteRoom = createAsyncThunk(
  "adminRooms/deleteRoom",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, { withCredentials: true });
      return {
        success: true,
        id: id, // On garde l'ID ici pour le reducer
        data: response.data 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const adminRoomSlice = createSlice({
    name: "adminRooms",
    initialState, 
    reducers: {}, 
    extraReducers: (builder) => {
        builder
        // Fetch
        .addCase(fetchAllRooms.pending, (state) => { state.loading = true; })
        .addCase(fetchAllRooms.fulfilled, (state, action) => {
            state.loading = false;
            state.roomList = action.payload.success ? action.payload.data : action.payload;
        })
        .addCase(fetchAllRooms.rejected, (state) => {
            state.loading = false;
            state.roomList = [];
        })

        // Add
        .addCase(addRoom.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.roomList.push(action.payload.data);
            }
        })

        // Edit
        .addCase(editRoom.fulfilled, (state, action) => {
            const index = state.roomList.findIndex(room => room._id === action.payload.data._id);
            if (index !== -1) {
                state.roomList[index] = action.payload.data;
            }
        })

        // Delete 
        .addCase(deleteRoom.fulfilled, (state, action) => {
            // On utilise action.payload.id parce que le thunk renvoie un objet
            state.roomList = state.roomList.filter(room => room._id !== action.payload.id);
        });
    }
});

export default adminRoomSlice.reducer;