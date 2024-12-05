import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export const loadGlobalUserFavoriteCounts = createAsyncThunk(
  "users/loadGlobalFavoriteCounts",
  async () => {
    const countsDoc = await getDoc(doc(db, "globalCounts", "userFavorites"));
    if (countsDoc.exists()) {
      return countsDoc.data();
    }
    return {};
  }
);

const updateFirebaseFavoriteCount = async (userId, isAdding) => {
  const countsRef = doc(db, "globalCounts", "userFavorites");
  const countsDoc = await getDoc(countsRef);

  const currentCount = countsDoc.exists() ? countsDoc.data()[userId] || 0 : 0;
  const newCount = isAdding ? currentCount + 1 : Math.max(currentCount - 1, 0);

  if (!countsDoc.exists()) {
    await setDoc(countsRef, { [userId]: newCount });
  } else {
    await updateDoc(countsRef, { [userId]: newCount });
  }

  return newCount;
};

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    filteredUsers: [],
    userFavorites: [],
    favoriteCounts: {},
  },
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
    addUserFavorite: (state, action) => {
      const user = action.payload;
      if (!state.userFavorites.some((fav) => fav.uid === user.uid)) {
        state.userFavorites.push(user);

        state.favoriteCounts[user.uid] =
          (state.favoriteCounts[user.uid] || 0) + 1;

        updateFirebaseFavoriteCount(user.uid, true);
      }
    },
    removeUserFavorite: (state, action) => {
      const userId = action.payload;
      state.userFavorites = state.userFavorites.filter(
        (fav) => fav.uid !== userId
      );
      if (state.favoriteCounts[userId] > 0) {
        state.favoriteCounts[userId]--;

        updateFirebaseFavoriteCount(userId, false);
      }
    },
    setFavoriteCounts: (state, action) => {
      state.favoriteCounts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadGlobalUserFavoriteCounts.fulfilled, (state, action) => {
      state.favoriteCounts = action.payload;
    });
  },
});

export const {
  setUsers,
  filterUsers,
  resetUsers,
  addUserFavorite,
  removeUserFavorite,
  setFavoriteCounts,
} = userSlice.actions;

export default userSlice.reducer;
