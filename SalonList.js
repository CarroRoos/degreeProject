import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "./slices/salonSlice";

const SalonList = ({ data }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.salons.favorites || []);

  const handleSalonPress = (salon) => {
    navigation.navigate("SalonDetail", { salon });
  };

  const handleFavoritePress = (salon) => {
    // Använd objectID om det finns, annars id
    const salonId = salon.objectID || salon.id;
    const salonWithId = { ...salon, id: salonId };

    const isFavorite = favorites.some(
      (fav) => (fav.objectID || fav.id) === salonId
    );
    if (isFavorite) {
      dispatch(removeFavorite(salonId));
    } else {
      dispatch(addFavorite(salonWithId));
    }
  };

  const isFavorite = (salon) => {
    const salonId = salon.objectID || salon.id;
    return favorites.some((fav) => (fav.objectID || fav.id) === salonId);
  };

  const getTreatmentText = (salon) => {
    if (!salon.treatment) return "Kategorier ej angivna";
    if (Array.isArray(salon.treatment)) return salon.treatment.join(", ");
    if (typeof salon.treatment === "string") return salon.treatment;
    return "Kategorier ej angivna";
  };

  const groupSalons = () => {
    const sortedByTime = [...data].sort((a, b) =>
      (a.time || "").localeCompare(b.time || "")
    );
    const sortedByPrice = [...data].sort(
      (a, b) => (a.price || 0) - (b.price || 0)
    );
    const sortedByDistance = [...data].sort(
      (a, b) => (a.distance || 0) - (b.distance || 0)
    );

    return {
      tidigaste: sortedByTime.slice(0, 3),
      billigaste: sortedByPrice.slice(0, 3),
      narmaste: sortedByDistance.slice(0, 3),
    };
  };

  const renderSalonCard = (salon) => (
    <TouchableOpacity
      key={salon.objectID || salon.id}
      style={styles.salonCard}
      onPress={() => handleSalonPress(salon)}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          {salon.image ? (
            <Image source={{ uri: salon.image }} style={styles.salonImage} />
          ) : (
            <View style={[styles.salonImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>
                {salon.salon?.charAt(0) || "S"}
              </Text>
            </View>
          )}

          <View style={styles.salonInfo}>
            <Text style={styles.salonName}>
              {salon.salon || "Okänd salong"}
            </Text>
            <Text style={styles.location}>
              {salon.time ? `Kl. ${salon.time}` : "Tid ej angiven"} •{" "}
              {salon.price ? `${salon.price} kr` : "Pris ej angivet"}
            </Text>
            <Text style={styles.categories}>
              {salon.distance ? `${salon.distance} km • ` : ""}
              {getTreatmentText(salon)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleFavoritePress(salon)}
        >
          <Text
            style={[
              styles.favoriteIcon,
              isFavorite(salon) && styles.favoriteIconActive,
            ]}
          >
            {isFavorite(salon) ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const groupedSalons = groupSalons();

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Tidigaste</Text>
            {groupedSalons.tidigaste.map(renderSalonCard)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Billigaste</Text>
            {groupedSalons.billigaste.map(renderSalonCard)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Närmaste</Text>
            {groupedSalons.narmaste.map(renderSalonCard)}
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Inga resultat hittades</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9747FF",
    marginBottom: 12,
  },
  salonCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  salonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
    color: "#666",
  },
  salonInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  categories: {
    fontSize: 14,
    color: "#666",
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    color: "#666",
  },
  favoriteIconActive: {
    color: "#9747FF",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default SalonList;
