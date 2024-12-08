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

export const loadLocalUserFavorites = createAsyncThunk(
  "users/loadLocalUserFavorites",
  async () => {
    try {
      const localFavorites = await AsyncStorage.getItem("userFavorites");
      return localFavorites ? JSON.parse(localFavorites) : [];
    } catch (error) {
      console.error("Error loading local user favorites:", error);
      throw error;
    }
  }
);

export const loadGlobalUserFavoriteCounts = createAsyncThunk(
  "users/loadGlobalUserFavoriteCounts",
  async () => {
    try {
      const countsRef = collection(db, "globalCounts");
      const querySnapshot = await getDocs(
        query(countsRef, where("type", "==", "User"))
      );

      const favoriteCounts = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        favoriteCounts[data.userId] = data.count;
      });

      return favoriteCounts;
    } catch (error) {
      console.error("Error loading global user favorite counts:", error);
      throw error;
    }
  }
);

export const loadUserFavorites = createAsyncThunk(
  "users/loadUserFavorites",
  async (currentUserId) => {
    try {
      if (!currentUserId) throw new Error("No user ID provided");

      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", currentUserId),
        where("type", "==", "User")
      );
      const querySnapshot = await getDocs(favoritesQuery);

      const userFavorites = [];
      querySnapshot.forEach((doc) => {
        userFavorites.push(doc.data());
      });

      await AsyncStorage.setItem(
        "userFavorites",
        JSON.stringify(userFavorites)
      );
      return userFavorites;
    } catch (error) {
      console.error("Error loading user favorites:", error);
      throw error;
    }
  }
);

export const addUserFavorite = createAsyncThunk(
  "users/addUserFavorite",
  async ({ currentUserId, favoriteUser }) => {
    try {
      if (!currentUserId) throw new Error("No current user ID provided");

      const docRef = doc(
        db,
        "favorites",
        `${currentUserId}-${favoriteUser.uid}`
      );
      await setDoc(docRef, {
        userId: currentUserId,
        favoriteId: favoriteUser.uid,
        type: "User",
        ...favoriteUser,
      });

      const localFavorites = await AsyncStorage.getItem("userFavorites");
      const favorites = localFavorites ? JSON.parse(localFavorites) : [];
      favorites.push(favoriteUser);
      await AsyncStorage.setItem("userFavorites", JSON.stringify(favorites));

      return favoriteUser;
    } catch (error) {
      console.error("Error adding user favorite:", error);
      throw error;
    }
  }
);

export const removeUserFavorite = createAsyncThunk(
  "users/removeUserFavorite",
  async ({ currentUserId, userId }) => {
    try {
      if (!currentUserId) throw new Error("No current user ID provided");

      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", currentUserId),
        where("favoriteId", "==", userId),
        where("type", "==", "User")
      );

      const querySnapshot = await getDocs(favoritesQuery);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Update local storage
      const localFavorites = await AsyncStorage.getItem("userFavorites");
      let favorites = localFavorites ? JSON.parse(localFavorites) : [];
      favorites = favorites.filter((fav) => fav.favoriteId !== userId);
      await AsyncStorage.setItem("userFavorites", JSON.stringify(favorites));

      return userId;
    } catch (error) {
      console.error("Error removing user favorite:", error);
      throw error;
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
    },
  },
  extraReducers: (builder) => {
    builder

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
      })

      .addCase(loadGlobalUserFavoriteCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadGlobalUserFavoriteCounts.fulfilled, (state, action) => {
        state.favoriteCounts = action.payload;
        state.isLoading = false;
      })
      .addCase(loadGlobalUserFavoriteCounts.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
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
        state.error = action.error.message;
        state.isLoading = false;
      })

      .addCase(addUserFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addUserFavorite.fulfilled, (state, action) => {
        state.userFavorites.push(action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addUserFavorite.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })

      .addCase(removeUserFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeUserFavorite.fulfilled, (state, action) => {
        state.userFavorites = state.userFavorites.filter(
          (fav) => fav.favoriteId !== action.payload
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(removeUserFavorite.rejected, (state, action) => {
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
  clearUserFavorites,
} = userSlice.actions;

export default userSlice.reducer;
