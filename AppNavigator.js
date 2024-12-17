import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { loadFavorites } from "./slices/salonSlice";
import { auth } from "./config/firebase";
import { ActivityIndicator, View } from "react-native";

// Import screens
import Home from "./pages/Home";
import HomeStylist from "./pages/HomeStylist";
import Favorites from "./pages/Favorites";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import StylistProfile from "./pages/StylistProfile";
import BookingConfirmation from "./pages/BookingConfirmation";
import UserProfile from "./pages/UserProfile";
import LoginScreen from "./pages/LoginScreen";
import CreateAccountScreen from "./pages/CreateAccountScreen";
import QuestionnaireScreen from "./pages/QuestionnaireScreen";
import EditMyProfile from "./pages/EditMyProfile";
import EditProfile from "./pages/EditProfile";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="HomeStylist" component={HomeStylist} />
    <Stack.Screen name="Favorites" component={Favorites} />
    <Stack.Screen name="Bookings" component={Bookings} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="StylistProfile" component={StylistProfile} />
    <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} />
    <Stack.Screen name="UserProfile" component={UserProfile} />
    <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
    <Stack.Screen name="EditMyProfile" component={EditMyProfile} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
  </Stack.Navigator>
);

function AppNavigator() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        dispatch(loadFavorites(user.uid));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default AppNavigator;
