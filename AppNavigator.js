import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import StylistProfile from "./pages/StylistProfile";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Favorites"
          component={Favorites}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Bookings"
          component={Bookings}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="StylistProfile"
          component={StylistProfile}
          options={{
            header: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
