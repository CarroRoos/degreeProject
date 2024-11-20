import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

function Footer() {
  const navigation = useNavigation();
  const route = useRoute();

  const favoritesCount = useSelector((state) => state.salons.favorites.length);

  return (
    <View style={styles.footer}>
      {/* Hem */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.footerItem}
      >
        <Icon
          name="home-outline"
          size={35}
          color={route.name === "Home" ? "#9E38EE" : "#000"}
        />
      </TouchableOpacity>

      {/* Favoriter */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Favorites")}
        style={styles.footerItem}
      >
        <Icon
          name="heart-outline"
          size={35}
          color={route.name === "Favorites" ? "#9E38EE" : "#000"}
        />
        {favoritesCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{favoritesCount}</Text>
          </View>
        )}
        {route.name === "Favorites" && <View style={styles.indicator} />}
      </TouchableOpacity>

      {/* Bokningar */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Bookings")}
        style={styles.footerItem}
      >
        <Icon
          name="calendar-outline"
          size={35}
          color={route.name === "Bookings" ? "#9E38EE" : "#000"}
        />
        {route.name === "Bookings" && <View style={styles.indicator} />}
      </TouchableOpacity>

      {/* Profil */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.footerItem}
      >
        <Image
          source={{
            uri: "https://your-image-url-here.com/profile.jpg",
          }}
          style={[
            styles.profileImage,
            route.name === "Profile" && styles.activeProfileImage,
          ]}
        />
        {route.name === "Profile" && <View style={styles.indicator} />}
      </TouchableOpacity>
    </View>
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
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#9E38EE",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
  indicator: {
    width: 5,
    height: 5,
    backgroundColor: "#9E38EE",
    borderRadius: 2.5,
    marginTop: 5,
  },
});

export default Footer;
