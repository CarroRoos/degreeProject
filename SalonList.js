import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SectionList,
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

const SalonCard = React.memo(
  ({ salon, onPress, onFavoritePress, isFavorited, isLoading }) => {
    const getTreatmentText = useCallback((salon) => {
      if (!salon.treatment) return "Kategorier ej angivna";
      if (Array.isArray(salon.treatment)) return salon.treatment.join(", ");
      if (typeof salon.treatment === "string") return salon.treatment;
      return "Kategorier ej angivna";
    }, []);

    if (!salon) return null;

    return (
      <TouchableOpacity style={styles.salonCard} onPress={() => onPress(salon)}>
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
                {salon._highlightResult?.stylist?.value || salon.stylist}
              </Text>
              <Text style={styles.location}>{salon.salon}</Text>
              <Text style={styles.categories}>
                {salon.time ? `Kl. ${salon.time}` : "Tid ej angiven"} •{" "}
                {salon.price ? `${salon.price} kr` : "Pris ej angivet"}
              </Text>
              <Text style={styles.treatment}>{getTreatmentText(salon)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onFavoritePress(salon)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#9747FF" />
            ) : (
              <Icon
                name={isFavorited ? "favorite" : "favorite-border"}
                size={24}
                color={isFavorited ? "#9747FF" : "#666"}
              />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
);

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

  const handleSalonPress = useCallback(
    (salon) => {
      if (!salon) return;

      const stylistData = {
        id: salon.objectID || salon.id,
        name: salon.stylist,
        salon: salon.salon,
        ratings: salon.ratings || "0",
        image: salon.image,
        price: salon.price,
        time: salon.time,
        treatment: salon.treatment,
        distance: salon.distance || "",
        description: salon.description || "",
      };

      navigation.navigate("StylistProfile", { stylist: stylistData });
    },
    [navigation]
  );

  const isFavorite = useCallback(
    (salon) => {
      if (!salon || (!salon.objectID && !salon.id)) return false;

      const salonId = salon.objectID || salon.id;
      return favorites.some(
        (fav) => fav.id === salonId || fav.objectID === salonId
      );
    },
    [favorites]
  );

  const handleFavoritePress = useCallback(
    async (salon) => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "Du måste vara inloggad för att favoritmarkera");
        return;
      }

      if (!salon || (!salon.objectID && !salon.id)) {
        console.error("Invalid salon data:", salon);
        Alert.alert("Fel", "Kunde inte hantera favorit: Ogiltig salongsdata");
        return;
      }

      const salonId = salon.objectID || salon.id;

      try {
        setLoadingFavorites((prev) => ({ ...prev, [salonId]: true }));

        if (isFavorite(salon)) {
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
    },
    [dispatch, isFavorite]
  );

  const sections = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const validData = data.filter(
      (salon) => salon && (salon.objectID || salon.id)
    );

    const sortedByTime = [...validData].sort((a, b) =>
      (a.time || "").toString().localeCompare((b.time || "").toString())
    );
    const sortedByPrice = [...validData].sort(
      (a, b) => (a.price || 0) - (b.price || 0)
    );
    const sortedByDistance = [...validData].sort(
      (a, b) => (a.distance || 0) - (b.distance || 0)
    );

    return [
      { title: "Tidigaste", data: sortedByTime.slice(0, 3) },
      { title: "Billigaste", data: sortedByPrice.slice(0, 3) },
      { title: "Närmaste", data: sortedByDistance.slice(0, 3) },
    ];
  }, [data]);

  const renderItem = useCallback(
    ({ item: salon }) => {
      if (!salon || (!salon.objectID && !salon.id)) return null;

      return (
        <SalonCard
          salon={salon}
          onPress={handleSalonPress}
          onFavoritePress={handleFavoritePress}
          isFavorited={isFavorite(salon)}
          isLoading={loadingFavorites[salon.objectID || salon.id]}
        />
      );
    },
    [handleSalonPress, handleFavoritePress, isFavorite, loadingFavorites]
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }) => (
      <Text style={styles.sectionHeader}>{title}</Text>
    ),
    []
  );

  const keyExtractor = useCallback((item) => {
    return item?.objectID || item?.id || String(Math.random());
  }, []);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Inga resultat hittades</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    marginTop: 12,
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

export default React.memo(SalonList);
