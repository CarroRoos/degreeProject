import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const asyncStorageCache = {
  userFavorites: null,
  lastUpdate: 0,
  CACHE_DURATION: 5 * 60 * 1000,
};

const getFromStorageWithCache = async (key) => {
  const now = Date.now();
  if (
    asyncStorageCache[key] &&
    now - asyncStorageCache.lastUpdate < asyncStorageCache.CACHE_DURATION
  ) {
    return asyncStorageCache[key];
  }

  const value = await AsyncStorage.getItem(key);
  if (value) {
    asyncStorageCache[key] = JSON.parse(value);
    asyncStorageCache.lastUpdate = Date.now();
  }
  return asyncStorageCache[key];
};

const setToStorageWithCache = async (key, value) => {
  asyncStorageCache[key] = value;
  asyncStorageCache.lastUpdate = Date.now();
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const loadLocalUserFavorites = createAsyncThunk(
  "users/loadLocalUserFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await getFromStorageWithCache("userFavorites");
      return favorites || [];
    } catch (error) {
      console.error("Error loading local user favorites:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const loadGlobalUserFavoriteCounts = createAsyncThunk(
  "users/loadGlobalUserFavoriteCounts",
  async (_, { rejectWithValue }) => {
    try {
      const countsRef = collection(db, "globalCounts");
      const querySnapshot = await getDocs(
        query(countsRef, where("type", "==", "User"))
      );

      return querySnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        acc[data.userId] = data.count;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error loading global user favorite counts:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const loadUserFavorites = createAsyncThunk(
  "users/loadUserFavorites",
  async (currentUserId, { rejectWithValue }) => {
    try {
      if (!currentUserId) return rejectWithValue("No user ID provided");

      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", currentUserId),
        where("type", "==", "User")
      );

      const querySnapshot = await getDocs(favoritesQuery);
      const userFavorites = querySnapshot.docs.map((doc) => doc.data());

      await setToStorageWithCache("userFavorites", userFavorites);
      return userFavorites;
    } catch (error) {
      console.error("Error loading user favorites:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const addUserFavorite = createAsyncThunk(
  "users/addUserFavorite",
  async ({ currentUserId, favoriteUser }, { dispatch, rejectWithValue }) => {
    try {
      if (!currentUserId) return rejectWithValue("No user ID provided");

      const favoriteData = {
        userId: currentUserId,
        favoriteId: favoriteUser.uid,
        uid: favoriteUser.uid,
        type: "User",
        displayName: favoriteUser.displayName || "",
        photoURL: favoriteUser.photoURL || "",
        location: favoriteUser.location || "",
      };

      dispatch({
        type: "users/addUserFavoriteOptimistic",
        payload: favoriteData,
      });

      const docRef = doc(
        db,
        "favorites",
        `${currentUserId}-${favoriteUser.uid}`
      );
      await setDoc(docRef, favoriteData);

      const currentFavorites =
        (await getFromStorageWithCache("userFavorites")) || [];
      await setToStorageWithCache("userFavorites", [
        ...currentFavorites,
        favoriteData,
      ]);

      return favoriteData;
    } catch (error) {
      console.error("Error adding user favorite:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const removeUserFavorite = createAsyncThunk(
  "users/removeUserFavorite",
  async ({ currentUserId, userId }, { dispatch, rejectWithValue }) => {
    try {
      if (!currentUserId) return rejectWithValue("No user ID provided");

      dispatch({ type: "users/removeUserFavoriteOptimistic", payload: userId });

      const docRef = doc(db, "favorites", `${currentUserId}-${userId}`);
      await deleteDoc(docRef);

      const currentFavorites =
        (await getFromStorageWithCache("userFavorites")) || [];
      const updatedFavorites = currentFavorites.filter(
        (fav) => fav.favoriteId !== userId
      );
      await setToStorageWithCache("userFavorites", updatedFavorites);

      return userId;
    } catch (error) {
      console.error("Error removing user favorite:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const loadUserFavoriteCount = createAsyncThunk(
  "users/loadUserFavoriteCount",
  async (userId, { rejectWithValue }) => {
    try {
      const favoritesQuery = query(
        collection(db, "favorites"),
        where("favoriteId", "==", userId),
        where("type", "==", "User")
      );
      const querySnapshot = await getDocs(favoritesQuery);
      return querySnapshot.size;
    } catch (error) {
      console.error("Error loading favorite count:", error);
      return rejectWithValue(error.message);
    }
  }
);

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
    clearUserFavorites: (state) => {
      state.userFavorites = [];
      asyncStorageCache.userFavorites = null;
      AsyncStorage.removeItem("userFavorites").catch(console.error);
    },
    addUserFavoriteOptimistic: (state, action) => {
      if (
        !state.userFavorites.some(
          (fav) => fav.favoriteId === action.payload.favoriteId
        )
      ) {
        state.userFavorites.push(action.payload);
      }
    },
    removeUserFavoriteOptimistic: (state, action) => {
      state.userFavorites = state.userFavorites.filter(
        (fav) => fav.favoriteId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLocalUserFavorites.fulfilled, (state, action) => {
        state.userFavorites = action.payload;
        state.error = null;
      })
      .addCase(loadLocalUserFavorites.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(loadGlobalUserFavoriteCounts.fulfilled, (state, action) => {
        state.favoriteCounts = action.payload;
        state.error = null;
      })
      .addCase(loadGlobalUserFavoriteCounts.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(loadUserFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFavorites.fulfilled, (state, action) => {
        state.userFavorites = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadUserFavorites.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(addUserFavorite.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(removeUserFavorite.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(loadUserFavoriteCount.fulfilled, (state, action) => {
        state.favoriteCounts[action.meta.arg] = action.payload;
        state.error = null;
      })
      .addCase(loadUserFavoriteCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentUser,
  setUsers,
  filterUsers,
  resetUsers,
  clearUserFavorites,
  addUserFavoriteOptimistic,
  removeUserFavoriteOptimistic,
} = userSlice.actions;

export default userSlice.reducer;
