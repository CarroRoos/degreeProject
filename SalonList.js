import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
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

const SafeImage = ({ uri, style }) => {
  const defaultImage = "https://via.placeholder.com/150";
  return (
    <Image
      source={{ uri: uri || defaultImage }}
      style={style}
      resizeMode="cover"
    />
  );
};

const formatTime = (time) => {
  if (!time) return "00:00";
  const timeStr = time.toString();
  const hours = timeStr.substring(0, 2);
  const minutes = timeStr.substring(2, 4);
  return `${hours}:${minutes}`;
};

const SalonCard = React.memo(
  ({ salon, onPress, onFavoritePress, isFavorited, isLoading }) => {
    const getTreatmentText = useCallback((salon) => {
      if (!salon.treatment) return "Kategorier ej angivna";
      if (Array.isArray(salon.treatment)) return salon.treatment.join(", ");
      if (typeof salon.treatment === "string") return salon.treatment;
      return "Kategorier ej angivna";
    }, []);

    if (!salon) return null;

    const imageUri =
      salon.image && typeof salon.image === "string" ? salon.image : null;

    return (
      <View style={styles.salonCard}>
        <TouchableOpacity onPress={() => onPress(salon)}>
          <View style={styles.cardContent}>
            <SafeImage uri={imageUri} style={styles.profileImage} />
            <View style={styles.textContent}>
              <Text style={styles.salonName}>
                {salon._highlightResult?.stylist?.value || salon.stylist}
              </Text>
              <Text style={styles.location}>{salon.salon}</Text>
              <Text style={styles.categories}>
                Kl. {formatTime(salon.time)} •{" "}
                {salon.price ? `${salon.price} kr` : "Pris ej angivet"}
              </Text>
              <Text style={styles.categories}>{getTreatmentText(salon)}</Text>
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
                  color={isFavorited ? "#9E38EE" : "#666"}
                />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
);

const SalonList = ({ data }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.salons.favorites || []);
  const [loadingFavorites, setLoadingFavorites] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Tidigaste");

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
        time: formatTime(salon.time),
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

    const currentHour = new Date().getHours();

    const validTimes = validData.filter((salon) => {
      if (typeof salon.time !== "number") return false;
      return salon.time > currentHour;
    });

    const sortedByTime = [...validTimes].sort((a, b) => a.time - b.time);
    const sortedByPrice = [...validData].sort(
      (a, b) => (a.price || 0) - (b.price || 0)
    );
    const sortedByDistance = [...validData].sort(
      (a, b) => (a.distance || 0) - (b.distance || 0)
    );

    return [
      { title: "Tidigaste", data: sortedByTime },
      { title: "Billigaste", data: sortedByPrice },
      { title: "Närmaste", data: sortedByDistance },
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

  const filteredSections = sections.filter(
    (section) => section.title === selectedCategory
  );

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Inga resultat hittades</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.categoriesWrapper}>
          {sections.map((section) => (
            <TouchableOpacity
              key={section.title}
              onPress={() => setSelectedCategory(section.title)}
              style={[
                styles.categoryTab,
                selectedCategory === section.title &&
                  styles.selectedCategoryTab,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === section.title &&
                    styles.selectedCategoryText,
                ]}
              >
                {section.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={filteredSections[0]?.data || []}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item?.objectID || item?.id || String(Math.random())
        }
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  headerContainer: {
    paddingVertical: 8,
  },
  categoriesWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 16,
  },
  categoryTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    maxWidth: 120,
  },
  selectedCategoryTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#9E38EE",
  },
  categoryText: {
    fontSize: 16,
    color: "#666",
  },
  selectedCategoryText: {
    color: "#9E38EE",
    fontWeight: "bold",
  },
  list: {
    width: "100%",
    padding: 15,
  },
  salonCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 15,
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
  textContent: {
    flex: 1,
  },
  salonName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  categories: {
    fontSize: 12,
    color: "#888",
  },
  favoriteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
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
