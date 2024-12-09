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

export const loadLocalFavorites = createAsyncThunk(
  "salons/loadLocalFavorites",
  async () => {
    try {
      const localFavorites = await AsyncStorage.getItem("salonFavorites");
      return localFavorites ? JSON.parse(localFavorites) : [];
    } catch (error) {
      console.error("Error loading local salon favorites:", error);
      throw error;
    }
  }
);

export const loadGlobalFavoriteCounts = createAsyncThunk(
  "salons/loadGlobalFavoriteCounts",
  async () => {
    try {
      const countsRef = collection(db, "globalCounts");
      const querySnapshot = await getDocs(
        query(countsRef, where("type", "==", "Salon"))
      );

      const favoriteCounts = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        favoriteCounts[data.salonId] = data.count;
      });

      return favoriteCounts;
    } catch (error) {
      console.error("Error loading global favorite counts:", error);
      throw error;
    }
  }
);

export const loadFavorites = createAsyncThunk(
  "salons/loadFavorites",
  async (currentUserId) => {
    try {
      if (!currentUserId) throw new Error("No user ID provided");

      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", currentUserId),
        where("type", "==", "Salon")
      );

      const querySnapshot = await getDocs(favoritesQuery);
      const favorites = [];
      querySnapshot.forEach((doc) => {
        favorites.push(doc.data());
      });

      await AsyncStorage.setItem("salonFavorites", JSON.stringify(favorites));
      return favorites;
    } catch (error) {
      console.error("Error loading salon favorites:", error);
      throw error;
    }
  }
);

export const addFavorite = createAsyncThunk(
  "salons/addFavorite",
  async ({ currentUserId, salon }) => {
    try {
      if (!currentUserId) throw new Error("No user ID provided");

      const docRef = doc(db, "favorites", `${currentUserId}-${salon.id}`);
      await setDoc(docRef, {
        userId: currentUserId,
        favoriteId: salon.id,
        type: "Salon",
        ...salon,
      });

      const localFavorites = await AsyncStorage.getItem("salonFavorites");
      const favorites = localFavorites ? JSON.parse(localFavorites) : [];
      favorites.push(salon);
      await AsyncStorage.setItem("salonFavorites", JSON.stringify(favorites));

      return salon;
    } catch (error) {
      console.error("Error adding salon favorite:", error);
      throw error;
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "salons/removeFavorite",
  async ({ currentUserId, salonId }) => {
    try {
      if (!currentUserId) throw new Error("No user ID provided");

      const docRef = doc(db, "favorites", `${currentUserId}-${salonId}`);
      await deleteDoc(docRef);

      const localFavorites = await AsyncStorage.getItem("salonFavorites");
      let favorites = localFavorites ? JSON.parse(localFavorites) : [];
      favorites = favorites.filter((fav) => fav.id !== salonId);
      await AsyncStorage.setItem("salonFavorites", JSON.stringify(favorites));

      return salonId;
    } catch (error) {
      console.error("Error removing salon favorite:", error);
      throw error;
    }
  }
);

const salonSlice = createSlice({
  name: "salons",
  initialState: {
    list: [],
    filteredList: [],
    favorites: [],
    favoriteCounts: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    setSalons: (state, action) => {
      state.list = action.payload;
      state.filteredList = action.payload;
    },
    setFilteredSalons: (state, action) => {
      state.filteredList = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearFavorites: (state) => {
      state.favorites = [];
      AsyncStorage.removeItem("salonFavorites").catch((error) =>
        console.error("Error clearing salon favorites from storage:", error)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLocalFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadLocalFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadLocalFavorites.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(loadGlobalFavoriteCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadGlobalFavoriteCounts.fulfilled, (state, action) => {
        state.favoriteCounts = action.payload;
        state.isLoading = false;
      })
      .addCase(loadGlobalFavoriteCounts.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(addFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(removeFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          (fav) => fav.id !== action.payload
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export const { setSalons, setFilteredSalons, setError, clearFavorites } =
  salonSlice.actions;

export default salonSlice.reducer;
