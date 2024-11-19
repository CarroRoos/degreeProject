import { createSlice } from "@reduxjs/toolkit";
import salonger from "../salonger.json";

const salonSlice = createSlice({
  name: "salons",
  initialState: {
    list: salonger,
    filteredList: salonger,
  },
  reducers: {
    filterSalons: (state, action) => {
      const query = action.payload.toLowerCase();
      console.log("Filtering query:", query);
      state.filteredList = state.list.filter((salon) =>
        salon.name.toLowerCase().includes(query)
      );
      console.log("Filtered salons:", state.filteredList);
    },
    resetFilter: (state) => {
      state.filteredList = state.list;
    },
  },
});

export const { filterSalons, resetFilter } = salonSlice.actions;

export default salonSlice.reducer;
