import "react-native-reanimated";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppNavigator from "./AppNavigator";
import Toast from "react-native-toast-message";
import { loadFavoriteData } from "./slices/userSlice";

export default function App() {
  useEffect(() => {
    store.dispatch(loadFavoriteData());
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
