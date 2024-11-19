import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./slices/navSlice";
import salonReducer from "./slices/salonSlice";

export const store = configureStore({
  reducer: {
    nav: navReducer,
    salons: salonReducer,
  },
});
