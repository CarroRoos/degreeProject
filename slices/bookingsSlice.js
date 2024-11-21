import { createSlice } from "@reduxjs/toolkit";

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: [],
  reducers: {
    addBooking: (state, action) => {
      state.push(action.payload);
    },
    removeBooking: (state, action) => {
      const bookingId = action.payload;
      return state.filter((booking) => booking.id !== bookingId);
    },
  },
});

export const { addBooking, removeBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
