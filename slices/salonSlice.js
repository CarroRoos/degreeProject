import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadGlobalFavoriteCounts = createAsyncThunk(
  "salons/loadGlobalFavoriteCounts",
  async () => {
    const countsDoc = await getDoc(doc(db, "globalCounts", "favorites"));
    if (countsDoc.exists()) {
      return countsDoc.data();
    }
    return {};
  }
);

export const loadLocalFavorites = createAsyncThunk(
  "salons/loadLocalFavorites",
  async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("salonFavorites");
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Error loading local favorites:", error);
      return [];
    }
  }
);

const updateFirebaseFavoriteCount = async (salonId, isAdding) => {
  const countsRef = doc(db, "globalCounts", "favorites");
  const countsDoc = await getDoc(countsRef);

  const currentCount = countsDoc.exists() ? countsDoc.data()[salonId] || 0 : 0;
  const newCount = isAdding ? currentCount + 1 : Math.max(currentCount - 1, 0);

  if (!countsDoc.exists()) {
    await setDoc(countsRef, { [salonId]: newCount });
  } else {
    await updateDoc(countsRef, { [salonId]: newCount });
  }

  return newCount;
};

const saveToLocalStorage = async (favorites) => {
  try {
    await AsyncStorage.setItem("salonFavorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving to AsyncStorage:", error);
  }
};

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
    setFavoriteCounts: (state, action) => {
      state.favoriteCounts = action.payload;
    },
    addFavorite: (state, action) => {
      const salon = action.payload;
      if (!state.favorites.some((fav) => fav.id === salon.id)) {
        state.favorites.push(salon);
        state.favoriteCounts[salon.id] =
          (state.favoriteCounts[salon.id] || 0) + 1;

        saveToLocalStorage(state.favorites);

        updateFirebaseFavoriteCount(salon.id, true).then((newCount) => {
          state.favoriteCounts[salon.id] = newCount;
        });
      }
    },
    removeFavorite: (state, action) => {
      const salonId = action.payload;
      state.favorites = state.favorites.filter((fav) => fav.id !== salonId);

      if (state.favoriteCounts[salonId] > 0) {
        state.favoriteCounts[salonId] = state.favoriteCounts[salonId] - 1;

        saveToLocalStorage(state.favorites);

        updateFirebaseFavoriteCount(salonId, false).then((newCount) => {
          state.favoriteCounts[salonId] = newCount;
        });
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGlobalFavoriteCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadGlobalFavoriteCounts.fulfilled, (state, action) => {
        state.favoriteCounts = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadGlobalFavoriteCounts.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
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
      });
  },
});

export const {
  setSalons,
  setFilteredSalons,
  addFavorite,
  removeFavorite,
  setFavoriteCounts,
  setError,
} = salonSlice.actions;

export default salonSlice.reducer;
