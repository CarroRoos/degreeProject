import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
  loadFavorites,
} from "../slices/salonSlice";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth } from "../config/firebase";

function SalonCard({ salon, navigation }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.salons.favorites);
  const isLoading = useSelector((state) => state.salons.isLoading);

  const isFavorite = favorites.some((fav) => fav.id === salon.id);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      dispatch(loadFavorites(currentUser.uid));
    }
  }, [dispatch]);

  const toggleFavorite = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert("Error", "Du måste vara inloggad för att favoritmarkera");
      return;
    }

    if (isLoading) return;

    try {
      if (isFavorite) {
        await dispatch(
          removeFavorite({
            currentUserId: currentUser.uid,
            salonId: salon.id,
          })
        );
      } else {
        await dispatch(
          addFavorite({
            currentUserId: currentUser.uid,
            salon: {
              ...salon,
              id: salon.id || `salon-${Date.now()}`,
            },
          })
        );
      }
    } catch (error) {
      Alert.alert("Error", "Det gick inte att uppdatera favoriter");
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
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("StylistProfile", { stylist: salon })
        }
        style={styles.imageContainer}
      >
        {getImage(salon.image) ? (
          <Image source={getImage(salon.image)} style={styles.profileImage} />
        ) : (
          <Text style={styles.placeholderImage}>No Image</Text>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {salon.ratings || "-"}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.stylistName}>
          {salon._highlightResult?.stylist?.value}
        </Text>
        <Text style={styles.salonName}>{salon.salon}</Text>
        <Text style={styles.treatment}>{salon.treatment}</Text>
        <View style={styles.row}>
          <Text style={styles.categories}>
            Kl. {formatTime(salon.time)} •{" "}
            {salon.price ? `${salon.price} kr` : "Pris ej angivet"}
          </Text>
          <Text style={styles.bullet}> • </Text>
          <Text style={styles.price}>{salon.price} kr</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={toggleFavorite}
        style={styles.favoriteButton}
        disabled={isLoading}
      >
        <Icon
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "#9E38EE" : "#777"}
          style={isFavorite ? styles.activeFavorite : null}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    alignItems: "center",
    zIndex: 10,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 65,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  placeholderImage: {
    width: 65,
    height: 60,
    lineHeight: 60,
    textAlign: "center",
    backgroundColor: "#ddd",
    borderRadius: 30,
    marginRight: 15,
    color: "#888",
  },
  ratingBadge: {
    position: "absolute",
    bottom: -10,
    left: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#000",
  },
  info: {
    flex: 1,
    padding: 5,
  },
  stylistName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  salonName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  treatment: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    color: "#555",
  },
  bullet: {
    color: "#666",
    marginHorizontal: 5,
  },
  distance: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  favoriteButton: {
    padding: 10,
  },
  activeFavorite: {
    color: "#9E38EE",
    textShadowColor: "rgba(158, 56, 238, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default SalonCard;
