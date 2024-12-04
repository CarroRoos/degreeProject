import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

function Footer({ disableHighlight = true }) {
  const navigation = useNavigation();
  const route = useRoute();

  const salonFavorites = useSelector(
    (state) => state.salons?.favorites?.length || 0
  );
  const userFavorites = useSelector(
    (state) => state.users?.userFavorites?.length || 0
  );
  const totalFavorites = salonFavorites + userFavorites;

  return (
    <View style={styles.footer}>
      {/* Hem */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.footerItem}
      >
        <Icon
          name="magnify"
          size={35}
          color={disableHighlight && route.name === "Home" ? "#9E38EE" : "#000"}
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
          color={
            disableHighlight && route.name === "Favorites" ? "#9E38EE" : "#000"
          }
        />
        {totalFavorites > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{String(totalFavorites)}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Bokningar */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Bookings")}
        style={styles.footerItem}
      >
        <Icon
          name="calendar-outline"
          size={35}
          color={
            disableHighlight && route.name === "Bookings" ? "#9E38EE" : "#000"
          }
        />
      </TouchableOpacity>

      {/* Profil */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.footerItem}
      >
        <Image
          source={{
            uri:
              "https://your-image-url-here.com/profile.jpg" ||
              "https://via.placeholder.com/35",
          }}
          style={[
            styles.profileImage,
            disableHighlight &&
              route.name === "Profile" &&
              styles.activeProfileImage,
          ]}
        />
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
});

export default Footer;
