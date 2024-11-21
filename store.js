import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./slices/navSlice";
import salonReducer from "./slices/salonSlice";
import bookingsReducer from "./slices/bookingsSlice";

export const store = configureStore({
  reducer: {
    nav: navReducer,
    salons: salonReducer,
    bookings: bookingsReducer,
  },
});
