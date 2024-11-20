import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../slices/salonSlice";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

function SalonCard({ salon, navigation }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.salons.favorites || []);
  const isFavorite = favorites.some((fav) => fav.id === salon.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(salon.id));
    } else {
      dispatch(addFavorite(salon));
    }
  };

  const getImage = (imageName) => {
    try {
      switch (imageName) {
        case "freddie":
          return require("../assets/images/freddie.jpg");
        case "samira":
          return require("../assets/images/samira.jpg");
        case "jennifer":
          return require("../assets/images/jennifer.jpg");
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error loading image for ${imageName}:`, error);
      return null;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("StylistProfile", { stylist: salon })}
      style={styles.card}
    >
      {getImage(salon.image) && (
        <Image source={getImage(salon.image)} style={styles.profileImage} />
      )}
      <View style={styles.info}>
        <Text style={styles.treatment}>{salon.treatment}</Text>
        <Text style={styles.time}>Kl. {salon.time}</Text>
        <View style={styles.row}>
          <Text style={styles.distance}>{salon.distance}</Text>
          <Text style={styles.price}>{salon.price}</Text>
        </View>
        <Text style={styles.stylist}>
          Stylist: {salon.stylist} på {salon.salon}
        </Text>
        <Text style={styles.rating}>⭐ {salon.ratings}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#F2E7FF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  treatment: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  distance: {
    fontSize: 14,
    color: "#555",
    marginRight: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  stylist: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
});

export default SalonCard;
