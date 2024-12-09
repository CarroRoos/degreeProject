import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
  loadFavorites,
} from "./slices/salonSlice";
import { auth } from "./config/firebase";
import Icon from "react-native-vector-icons/MaterialIcons";
import FastImage from "react-native-fast-image";

const SalonList = ({ data }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.salons.favorites || []);
  const [loadingFavorites, setLoadingFavorites] = useState({});

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser && favorites.length === 0) {
      dispatch(loadFavorites(currentUser.uid));
    }
  }, [dispatch, favorites]);

  const handleSalonPress = (salon) => {
    navigation.navigate("SalonDetail", { salon });
  };

  const isFavorite = (salon) => {
    const salonId = salon.objectID || salon.id;
    return favorites.some(
      (fav) => fav.id === salonId || fav.objectID === salonId
    );
  };

  const handleFavoritePress = async (salon) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert("Error", "Du måste vara inloggad för att favoritmarkera");
      return;
    }

    try {
      const salonId = salon.objectID || salon.id;
      setLoadingFavorites((prev) => ({ ...prev, [salonId]: true }));
      const isFavorited = isFavorite(salon);

      if (isFavorited) {
        await dispatch(
          removeFavorite({
            currentUserId: currentUser.uid,
            salonId: salonId,
          })
        ).unwrap();
      } else {
        const salonWithId = { ...salon, id: salonId };
        await dispatch(
          addFavorite({
            currentUserId: currentUser.uid,
            salon: salonWithId,
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
      Alert.alert("Fel", "Kunde inte uppdatera favorit");
    } finally {
      setLoadingFavorites((prev) => ({ ...prev, [salonId]: false }));
    }
  };

  const getTreatmentText = (salon) => {
    if (!salon.treatment) return "Kategorier ej angivna";
    if (Array.isArray(salon.treatment)) return salon.treatment.join(", ");
    if (typeof salon.treatment === "string") return salon.treatment;
    return "Kategorier ej angivna";
  };

  const groupedSalons = useMemo(() => {
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
  }, [data]);

  const renderSalonCard = ({ item: salon }) => {
    const salonId = salon.objectID || salon.id;
    return (
      <TouchableOpacity
        key={salonId}
        style={styles.salonCard}
        onPress={() => handleSalonPress(salon)}
      >
        <View style={styles.contentContainer}>
          <View style={styles.leftContent}>
            {salon.image ? (
              <FastImage
                source={{ uri: salon.image }}
                style={styles.salonImage}
                resizeMode={FastImage.resizeMode.cover}
              />
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
            disabled={loadingFavorites[salonId]}
          >
            {loadingFavorites[salonId] ? (
              <ActivityIndicator size="small" color="#9747FF" />
            ) : (
              <Icon
                name={isFavorite(salon) ? "favorite" : "favorite-border"}
                size={24}
                color={isFavorite(salon) ? "#9747FF" : "#666"}
              />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Tidigaste</Text>
            <FlatList
              data={groupedSalons.tidigaste}
              renderItem={renderSalonCard}
              keyExtractor={(item) => item.objectID || item.id}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Billigaste</Text>
            <FlatList
              data={groupedSalons.billigaste}
              renderItem={renderSalonCard}
              keyExtractor={(item) => item.objectID || item.id}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Närmaste</Text>
            <FlatList
              data={groupedSalons.narmaste}
              renderItem={renderSalonCard}
              keyExtractor={(item) => item.objectID || item.id}
            />
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
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
