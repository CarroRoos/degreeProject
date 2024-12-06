import "react-native-reanimated";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppNavigator from "./AppNavigator";
import Toast from "react-native-toast-message";
import {
  loadGlobalUserFavoriteCounts,
  loadLocalUserFavorites,
} from "./slices/userSlice";
import {
  loadGlobalFavoriteCounts,
  loadLocalFavorites,
} from "./slices/salonSlice";

export default function App() {
  useEffect(() => {
    store.dispatch(loadGlobalUserFavoriteCounts());
    store.dispatch(loadGlobalFavoriteCounts());

    store.dispatch(loadLocalUserFavorites());
    store.dispatch(loadLocalFavorites());
  }, []);

  return (
    <Provider store={store}>
      <>
        <AppNavigator />
        <Toast />
      </>
    </Provider>
  );
}
