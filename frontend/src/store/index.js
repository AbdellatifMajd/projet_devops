import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import adminRoomReducer from "../store/AdminRoomSlice";
import clientRoomReducer from "../store/ClientRoomSlice";
import bookingRoomReducer from "../store/BookingSlice";
import paymentReducer from "../store/PaymentSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminRooms: adminRoomReducer,
    clientRooms: clientRoomReducer,
    bookingRooms: bookingRoomReducer,
    payment: paymentReducer,

  },
});
