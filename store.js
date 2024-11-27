import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./slices/navSlice";
import salonReducer from "./slices/salonSlice";
import bookingsReducer from "./slices/bookingsSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    nav: navReducer,
    salons: salonReducer,
    bookings: bookingsReducer,
    users: userReducer,
  },
});
