import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salons from "../salonger.json";

const salonSlice = createSlice({
  name: "salons",
  initialState: {
    list: salons,
    filteredList: salons,
    favorites: [],
    users: [],
    filteredUsers: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.filteredUsers = action.payload;
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
  extraReducers: (builder) => {
    builder
      .addCase(filterSalons.fulfilled, (state, action) => {
        state.filteredList = action.payload;
      })
      .addCase(filterUsers.fulfilled, (state, action) => {
        state.filteredUsers = action.payload;
      })
      .addCase(resetFilter.fulfilled, (state) => {
        // Fixat här
        state.filteredList = state.list;
        state.filteredUsers = state.users;
      });
  },
});

export const filterSalons = createAsyncThunk(
  "salons/filterSalons",
  async (query, { getState }) => {
    const { list } = getState().salons;
    return list.filter(
      (salon) =>
        salon.treatment.toLowerCase().includes(query.toLowerCase()) ||
        salon.stylist.toLowerCase().includes(query.toLowerCase()) ||
        salon.salon.toLowerCase().includes(query.toLowerCase())
    );
  }
);

export const filterUsers = createAsyncThunk(
  "salons/filterUsers",
  async (query, { getState }) => {
    const { users } = getState().salons;
    return users.filter(
      (user) =>
        user.displayName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
  }
);

export const resetFilter = createAsyncThunk(
  "salons/resetFilter",
  async (_, { getState }) => {
    const { list, users } = getState().salons;
    return { salons: list, users };
  }
);

export const { setUsers, addFavorite, removeFavorite } = salonSlice.actions;

export default salonSlice.reducer;
