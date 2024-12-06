import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const loadLocalUserFavorites = createAsyncThunk(
  "users/loadLocalUserFavorites",
  async (currentUserId) => {
    try {
      if (!currentUserId) return [];
      const key = `userFavorites_${currentUserId}`;
      const storedFavorites = await AsyncStorage.getItem(key);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Error loading local user favorites:", error);
      return [];
    }
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

const saveToLocalStorage = async (currentUserId, favorites) => {
  try {
    if (!currentUserId) return;
    const key = `userFavorites_${currentUserId}`;
    await AsyncStorage.setItem(key, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving to AsyncStorage:", error);
  }
};

const userSlice = createSlice({
  name: "users",
  initialState: {
    currentUserId: null,
    users: [],
    filteredUsers: [],
    userFavorites: [],
    favoriteCounts: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUserId = action.payload;
    },
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
      const { currentUserId, favoriteUser } = action.payload;
      if (!currentUserId) {
        console.error("No current user ID found");
        return;
      }

      if (!state.userFavorites.some((fav) => fav.uid === favoriteUser.uid)) {
        state.userFavorites.push(favoriteUser);
        state.favoriteCounts[favoriteUser.uid] =
          (state.favoriteCounts[favoriteUser.uid] || 0) + 1;

        saveToLocalStorage(currentUserId, state.userFavorites);
        updateFirebaseFavoriteCount(favoriteUser.uid, true);
      }
    },
    removeUserFavorite: (state, action) => {
      const { currentUserId, userId } = action.payload;
      if (!currentUserId) {
        console.error("No current user ID found");
        return;
      }

      state.userFavorites = state.userFavorites.filter(
        (fav) => fav.uid !== userId
      );

      if (state.favoriteCounts[userId] > 0) {
        state.favoriteCounts[userId]--;
        saveToLocalStorage(currentUserId, state.userFavorites);
        updateFirebaseFavoriteCount(userId, false);
      }
    },
    setFavoriteCounts: (state, action) => {
      state.favoriteCounts = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUserFavorites: (state) => {
      state.userFavorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGlobalUserFavoriteCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadGlobalUserFavoriteCounts.fulfilled, (state, action) => {
        state.favoriteCounts = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadGlobalUserFavoriteCounts.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(loadLocalUserFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadLocalUserFavorites.fulfilled, (state, action) => {
        state.userFavorites = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadLocalUserFavorites.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export const {
  setCurrentUser,
  setUsers,
  filterUsers,
  resetUsers,
  addUserFavorite,
  removeUserFavorite,
  setFavoriteCounts,
  setError,
  clearUserFavorites,
} = userSlice.actions;

export default userSlice.reducer;
