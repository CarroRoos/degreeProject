import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import StylistProfile from "./pages/StylistProfile";
import BookingConfirmation from "./pages/BookingConfirmation";
import UserProfile from "./pages/UserProfile";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Favorites" component={Favorites} />
        <Stack.Screen name="Bookings" component={Bookings} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="StylistProfile" component={StylistProfile} />
        <Stack.Screen
          name="BookingConfirmation"
          component={BookingConfirmation}
        />
        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
