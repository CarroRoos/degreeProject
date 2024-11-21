import { createSlice } from "@reduxjs/toolkit";
import salons from "../salonger.json";
import users from "../users.json";

const salonSlice = createSlice({
  name: "salons",
  initialState: {
    list: salons,
    filteredList: salons,
    favorites: [],
    users: users,
    filteredUsers: users,
  },
  reducers: {
    filterSalons: (state, action) => {
      const query = action.payload.toLowerCase();
      state.filteredList = state.list.filter((salon) => {
        return (
          salon.treatment.toLowerCase().includes(query) ||
          salon.stylist.toLowerCase().includes(query) ||
          salon.salon.toLowerCase().includes(query)
        );
      });
    },
    filterUsers: (state, action) => {
      const query = action.payload.toLowerCase();
      state.filteredUsers = state.users.filter((user) => {
        return (
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.username && user.username.toLowerCase().includes(query)) ||
          (user.location && user.location.toLowerCase().includes(query)) ||
          (user.description &&
            user.description.toLowerCase().includes(query)) ||
          (user.category &&
            user.category.some((cat) => cat.toLowerCase().includes(query)))
        );
      });
    },
    resetFilter: (state) => {
      state.filteredList = state.list;
      state.filteredUsers = state.users;
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

export const {
  filterSalons,
  filterUsers,
  resetFilter,
  addFavorite,
  removeFavorite,
} = salonSlice.actions;

export default salonSlice.reducer;
