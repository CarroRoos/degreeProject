import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { removeFavorite } from "../slices/salonSlice";
import { removeUserFavorite } from "../slices/userSlice";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

function Favorites() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadFavorites(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const saveFavorite = async (favorite) => {
    try {
      const sanitizedFavorite = {
        favoriteId: favorite.id,
        stylist: favorite.stylist,
        displayName: favorite.displayName,
        salon: favorite.salon,
        type: favorite.type,
        rating: favorite.rating,
        userId: auth.currentUser.uid,
        treatment: favorite.treatment,
        distance: favorite.distance,
        price: favorite.price,
      };
      await addDoc(collection(db, "favorites"), sanitizedFavorite);
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

  const loadFavorites = async (userId) => {
    if (!userId) return;

    try {
      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(favoritesQuery);
      const salons = [];
      const users = [];

      querySnapshot.forEach((doc) => {
        const data = { ...doc.data(), docId: doc.id };
        if (data.type === "Salon") {
          salons.push({
            ...data,
            stylist: data.stylist,
            rating: data.rating,
            treatment: data.treatment,
            distance: data.distance,
            price: data.price,
          });
        } else if (data.type === "User") {
          users.push({
            ...data,
            displayName: data.displayName,
          });
        }
      });

      setFavorites(salons);
      setUserFavorites(users);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const handleRemoveFavorite = async (item) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "Ingen inloggad användare");
      return;
    }

    try {
      if (item.type === "Salon") {
        await dispatch(
          removeFavorite({
            currentUserId: currentUser.uid,
            salonId: item.id || item.favoriteId,
          })
        ).unwrap();
      } else if (item.type === "User") {
        await dispatch(
          removeUserFavorite({
            currentUserId: currentUser.uid,
            userId: item.favoriteId,
          })
        ).unwrap();
      }
      await loadFavorites(currentUser.uid);
    } catch (error) {
      Alert.alert("Error", `Kunde inte ta bort favorit: ${error.message}`);
    }
  };

  const handleCardPress = (item) => {
    if (item.type === "Salon") {
      navigation.navigate("StylistProfile", {
        stylist: {
          id: item.favoriteId,
          name: item.stylist,
          salon: item.salon,
          time: item.time,
          treatment: item.treatment,
          price: item.price,
          rating: item.rating,
          image: item.image,
          distance: item.distance,
        },
      });
    } else {
      navigation.navigate("UserProfile", {
        userId: item.favoriteId,
        displayName: item.displayName,
      });
    }
  };

  const renderFavoriteCard = ({ item }) => {
    const isSalon = item.type === "Salon";
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.userCardContent}
          onPress={() => handleCardPress(item)}
        >
          {isSalon ? (
            item.image ? (
              <Image source={{ uri: item.image }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="image" size={24} color="#888" />
              </View>
            )
          ) : (
            <Image
              source={{ uri: item.photoURL || defaultAvatar }}
              style={styles.profileImage}
            />
          )}
          <View style={styles.textContent}>
            <Text style={styles.name}>
              {isSalon ? item.stylist : item.displayName}
            </Text>
            <Text style={styles.info}>
              {isSalon
                ? `${item.treatment || "Behandling"} • ${
                    item.distance || "Avstånd"
                  }`
                : item.location || "Plats ej angiven"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          activeOpacity={0.7}
          onPress={() => handleRemoveFavorite(item)}
        >
          <Text style={styles.removeButtonText}>Ta bort</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerTop} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Favoriter ({favorites.length + userFavorites.length})
          </Text>
        </View>
      </View>

      {favorites.length > 0 || userFavorites.length > 0 ? (
        <FlatList
          data={[
            { type: "header", id: "salonHeader", title: "Frisörer" },
            ...favorites,
            { type: "header", id: "userHeader", title: "Användare" },
            ...userFavorites,
          ]}
          keyExtractor={(item, index) => {
            if (item.type === "header") return item.id;
            return `favorite-${item.docId || item.favoriteId}-${index}`;
          }}
          renderItem={({ item }) => {
            if (item.type === "header") {
              const shouldShow =
                item.id === "salonHeader"
                  ? favorites.length > 0
                  : userFavorites.length > 0;
              return shouldShow ? (
                <Text style={styles.sectionHeader}>{item.title}</Text>
              ) : null;
            }
            return renderFavoriteCard({ item });
          }}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Inga favoriter ännu 💜</Text>
        </View>
      )}
      <Footer favoritesCount={favorites.length + userFavorites.length} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTop: {
    backgroundColor: "#9E38EE",
    height: 70,
  },
  header: {
    backgroundColor: "#9E38EE",
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 15,
    backgroundColor: "#f8f8f8",
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  userCardContent: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  removeButton: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#CA95FF",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#999",
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
  },
});

export default Favorites;
