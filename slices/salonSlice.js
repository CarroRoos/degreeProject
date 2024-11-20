import { createSlice } from "@reduxjs/toolkit";
import salonger from "../salonger.json";

const salonSlice = createSlice({
  name: "salons",
  initialState: {
    list: salonger,
    filteredList: salonger,
    favorites: [],
  },
  reducers: {
    filterSalons: (state, action) => {
      const query = action.payload.toLowerCase();
      console.log("Filtering query:", query);

      state.filteredList = state.list.filter((salon) => {
        return (
          salon.treatment.toLowerCase().includes(query) ||
          salon.stylist.toLowerCase().includes(query) ||
          salon.salon.toLowerCase().includes(query)
        );
      });
      console.log("Filtered salons:", state.filteredList);
    },
    resetFilter: (state) => {
      state.filteredList = state.list;
    },
    addFavorite: (state, action) => {
      const salon = action.payload;

      if (!state.favorites.some((fav) => fav.id === salon.id)) {
        state.favorites.push(salon);
      }
    },
    removeFavorite: (state, action) => {
      const salonId = action.payload;

      state.favorites = state.favorites.filter((fav) => fav.id !== salonId);
    },
  },
});

export const { filterSalons, resetFilter, addFavorite, removeFavorite } =
  salonSlice.actions;

export default salonSlice.reducer;
