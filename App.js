import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppNavigator from "./AppNavigator";
import Toast from "react-native-toast-message";
import {
  loadGlobalUserFavoriteCounts,
  loadLocalUserFavorites,
  setCurrentUser,
} from "./slices/userSlice";
import {
  loadGlobalFavoriteCounts,
  loadLocalFavorites,
} from "./slices/salonSlice";
import { auth } from "./config/firebase";

const AppContent = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!authInitialized) {
        setAuthInitialized(true);
      }

      store.dispatch(setCurrentUser(user ? user.uid : null));

      if (user) {
        try {
          await store.dispatch(loadLocalUserFavorites()).unwrap();
          await store.dispatch(loadLocalFavorites()).unwrap();

          await store.dispatch(loadGlobalUserFavoriteCounts()).unwrap();
          await store.dispatch(loadGlobalFavoriteCounts()).unwrap();
        } catch (error) {
          console.error("Error initializing data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!authInitialized) {
    return null;
  }

  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
