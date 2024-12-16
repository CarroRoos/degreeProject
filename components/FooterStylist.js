import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";

function FooterStylist({ disableHighlight = true }) {
  const navigation = useNavigation();
  const route = useRoute();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const loadOrdersCount = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("stylistId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(ordersQuery);
        setOrdersCount(querySnapshot.size);
      } catch (error) {
        console.error("Error loading orders count:", error);
      }
    };

    loadOrdersCount();
  }, [route.name]);

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeStylist")}
        style={styles.footerItem}
      >
        <Icon
          name="home-variant"
          size={35}
          color={
            disableHighlight && route.name === "HomeStylist"
              ? "#9E38EE"
              : "#000"
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Orders")}
        style={styles.footerItem}
      >
        <Icon
          name="shopping-outline"
          size={35}
          color={
            disableHighlight && route.name === "Orders" ? "#9E38EE" : "#000"
          }
        />
        {ordersCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{String(ordersCount)}</Text>
          </View>
        )}
      </TouchableOpacity>
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
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.footerItem}
      >
        <Image
          source={{
            uri: "https://via.placeholder.com/35",
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

export default FooterStylist;
