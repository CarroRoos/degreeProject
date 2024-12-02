import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const salonSlice = createSlice({
  name: "salons",
  initialState: {
    list: [],
    filteredList: [],
    favorites: [],
    users: [],
    filteredUsers: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.filteredUsers = action.payload;
    },
    setSalons: (state, action) => {
      state.list = action.payload;
      state.filteredList = action.payload;
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
        state.filteredList = state.list;
        state.filteredUsers = state.users;
      });
  },
});

export const filterSalons = createAsyncThunk(
  "salons/filterSalons",
  async (query) => {
    try {
      const response = await fetch(
        `https://UBHJYH9DZZ-dsn.algolia.net/1/indexes/Salonger/query`,
        {
          method: "POST",
          headers: {
            "X-Algolia-API-Key": "b0fb4ded362b98421a89e30a99a8f1ef",
            "X-Algolia-Application-Id": "UBHJYH9DZZ",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await response.json();
      return data.hits || [];
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
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

export const { setUsers, setSalons, addFavorite, removeFavorite } =
  salonSlice.actions;

export default salonSlice.reducer;
