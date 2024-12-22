import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Befintlig kod för addBookingToFirebase
export const addBookingToFirebase = createAsyncThunk(
  "bookings/addBookingToFirebase",
  async (booking, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "bookings"), booking);
      return { id: docRef.id, ...booking };
    } catch (error) {
      console.error("Error adding booking to Firestore:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Lägg till removeBookingFromFirebase
export const removeBookingFromFirebase = createAsyncThunk(
  "bookings/removeBookingFromFirebase",
  async (bookingId, { rejectWithValue }) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await deleteDoc(bookingRef);
      return bookingId;
    } catch (error) {
      console.error("Error removing booking from Firestore:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Slice för hantering av bokningar
const bookingsSlice = createSlice({
  name: "bookings",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBookingToFirebase.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(removeBookingFromFirebase.fulfilled, (state, action) => {
        return state.filter((booking) => booking.id !== action.payload);
      });
  },
});

export default bookingsSlice.reducer;
