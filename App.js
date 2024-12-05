import "react-native-reanimated";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppNavigator from "./AppNavigator";
import Toast from "react-native-toast-message";
import { loadGlobalUserFavoriteCounts } from "./slices/userSlice";
import { loadGlobalFavoriteCounts } from "./slices/salonSlice";

export default function App() {
  useEffect(() => {
    store.dispatch(loadGlobalUserFavoriteCounts());
    store.dispatch(loadGlobalFavoriteCounts());
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
