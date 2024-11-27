import "react-native-reanimated";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppNavigator from "./AppNavigator";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <Provider store={store}>
      <>
        <AppNavigator />
        <Toast />
      </>
    </Provider>
  );
}
