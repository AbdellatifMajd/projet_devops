import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: true, 
  user: null,
  isAuthenticated: false,
  error: "",
};

export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  const response = await axios.post(
    "http://localhost:8080/api/auth/login",
    formData,
    {
      withCredentials: true,
    },
  );
  return response.data;
});

export const registerUser = createAsyncThunk("/auth/register", async (formData) => {
  const response = await axios.post(
    "http://localhost:8080/api/auth/register",
    formData,
    {
      withCredentials: true,
    },
  );
  return response.data;
});

// NOUVEAU THUNK : Pour interroger la route /check-auth au démarrage
export const checkAuthUser = createAsyncThunk( "/auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/auth/check-auth",
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await axios.post("http://localhost:8080/api/auth/logout", {}, {
    withCredentials: true,
  });
  return response.data;
});


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Actions pour le LOGIN ---
    builder
      .addCase(loginUser.pending, (state) => {
        state.isAuthenticated = false;
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isAuthenticated = false; 
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true; 
        state.loading = false; 
        state.user = action.payload; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      })

      // --- Actions pour CHECK-AUTH (Refresh F5) ---
      .addCase(checkAuthUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkAuthUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload;

      })

      .addCase(logoutUser.pending, (state) => 
        (state.loading = true)
      )
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
