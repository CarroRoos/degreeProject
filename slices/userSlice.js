import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  users: [],
  filteredUsers: [],
  userFavorites: [],
  favoriteCounts: {},
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.filteredUsers = action.payload;
    },
    filterUsers: (state, action) => {
      state.filteredUsers = action.payload;
    },
    resetUsers: (state) => {
      state.filteredUsers = state.users;
    },
    setUserFavorites: (state, action) => {
      state.userFavorites = action.payload;
    },
    addUserFavorite: (state, action) => {
      const user = action.payload;
      if (!state.userFavorites.some((fav) => fav.uid === user.uid)) {
        state.userFavorites.push(user);
        state.favoriteCounts[user.uid] =
          (state.favoriteCounts[user.uid] || 0) + 1;
        AsyncStorage.setItem(
          "userFavorites",
          JSON.stringify(state.userFavorites)
        );
        AsyncStorage.setItem(
          "favoriteCounts",
          JSON.stringify(state.favoriteCounts)
        );
      }
    },
    removeUserFavorite: (state, action) => {
      const userId = action.payload;
      state.userFavorites = state.userFavorites.filter(
        (fav) => fav.uid !== userId
      );
      if (state.favoriteCounts[userId] > 0) {
        state.favoriteCounts[userId]--;
      }
      AsyncStorage.setItem(
        "userFavorites",
        JSON.stringify(state.userFavorites)
      );
      AsyncStorage.setItem(
        "favoriteCounts",
        JSON.stringify(state.favoriteCounts)
      );
    },
    setFavoriteCounts: (state, action) => {
      state.favoriteCounts = action.payload;
    },
  },
});

export const loadFavoriteData = () => async (dispatch) => {
  try {
    const [favoritesData, countsData] = await Promise.all([
      AsyncStorage.getItem("userFavorites"),
      AsyncStorage.getItem("favoriteCounts"),
    ]);

    if (favoritesData) {
      dispatch(setUserFavorites(JSON.parse(favoritesData)));
    }
    if (countsData) {
      dispatch(setFavoriteCounts(JSON.parse(countsData)));
    }
  } catch (error) {
    console.error("Error loading favorite data:", error);
  }
};

export const {
  setUsers,
  filterUsers,
  resetUsers,
  addUserFavorite,
  removeUserFavorite,
  setUserFavorites,
  setFavoriteCounts,
} = userSlice.actions;

export default userSlice.reducer;
