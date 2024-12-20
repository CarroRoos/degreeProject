import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { loadFavorites } from "./slices/salonSlice";
import { auth } from "./config/firebase";
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import BookingConfirmation from "./pages/BookingConfirmation";
import Bookings from "./pages/Bookings";
import CreateAccountScreen from "./pages/CreateAccountScreen";
import EditMyProfile from "./pages/EditMyProfile";
import EditProfile from "./pages/EditProfile";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import HomeStylist from "./pages/HomeStylist";
import LoginScreen from "./pages/LoginScreen";
import Profile from "./pages/Profile";
import QuestionnaireScreen from "./pages/QuestionnaireScreen";
import StylistProfile from "./pages/StylistProfile";
import UserProfile from "./pages/UserProfile";
const Stack = createStackNavigator();

const StaticFooter = ({ navigationRef }) => {
  const [currentRoute, setCurrentRoute] = useState("Home");

  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener("state", () => {
      const route = navigationRef.current?.getCurrentRoute();
      if (route) {
        setCurrentRoute(route.name);
      }
    });

    return unsubscribe;
  }, []);

  const navigate = (routeName) => {
    navigationRef.current?.navigate(routeName);
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => navigate("Home")}
        style={styles.footerItem}
      >
        <Icon
          name="magnify"
          size={35}
          color={currentRoute === "Home" ? "#9E38EE" : "#000"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigate("Favorites")}
        style={styles.footerItem}
      >
        <Icon
          name="heart-outline"
          size={35}
          color={currentRoute === "Favorites" ? "#9E38EE" : "#000"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigate("Bookings")}
        style={styles.footerItem}
      >
        <Icon
          name="calendar-outline"
          size={35}
          color={currentRoute === "Bookings" ? "#9E38EE" : "#000"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigate("Profile")}
        style={styles.footerItem}
      >
        <Image
          source={{
            uri: auth.currentUser?.photoURL || "https://via.placeholder.com/35",
          }}
          style={[
            styles.profileImage,
            currentRoute === "Profile" && styles.activeProfileImage,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

function AppNavigator() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigationRef = useNavigationContainerRef();

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
    <NavigationContainer ref={navigationRef}>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { paddingBottom: 90 },
          }}
        >
          {user ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="HomeStylist" component={HomeStylist} />
              <Stack.Screen name="Favorites" component={Favorites} />
              <Stack.Screen name="Bookings" component={Bookings} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="StylistProfile" component={StylistProfile} />
              <Stack.Screen
                name="BookingConfirmation"
                component={BookingConfirmation}
              />
              <Stack.Screen name="UserProfile" component={UserProfile} />
              <Stack.Screen
                name="Questionnaire"
                component={QuestionnaireScreen}
              />
              <Stack.Screen name="EditMyProfile" component={EditMyProfile} />
              <Stack.Screen name="EditProfile" component={EditProfile} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen
                name="CreateAccount"
                component={CreateAccountScreen}
              />
            </>
          )}
        </Stack.Navigator>
        {user && <StaticFooter navigationRef={navigationRef} />}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    height: 90,
  },
  footerItem: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingBottom: 20,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  activeProfileImage: {
    borderColor: "#9E38EE",
  },
});

export default AppNavigator;
