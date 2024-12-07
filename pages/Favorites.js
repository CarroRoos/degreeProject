import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import Footer from "../components/Footer";
import { removeFavorite, loadLocalFavorites } from "../slices/salonSlice";
import {
  removeUserFavorite,
  loadLocalUserFavorites,
} from "../slices/userSlice";
import { useNavigation } from "@react-navigation/native";

function Favorites() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.users.currentUserId);
  const favorites = useSelector((state) => state.salons.favorites || []);
  const userFavorites = useSelector((state) => state.users.userFavorites || []);
  const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

  useEffect(() => {
    if (currentUserId) {
      dispatch(loadLocalFavorites());
      dispatch(loadLocalUserFavorites(currentUserId));
    }
  }, [currentUserId, dispatch]);

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

  const handleCardPress = (item) => {
    if (item.ratings) {
      navigation.navigate("StylistProfile", { stylist: item });
    } else {
      navigation.navigate("UserProfile", { userId: item.uid });
    }
  };

  const handleRemoveFavorite = (item) => {
    const isSalon = Boolean(item.ratings);
    if (isSalon) {
      dispatch(removeFavorite(item.id));
    } else {
      dispatch(
        removeUserFavorite({
          currentUserId: currentUserId,
          userId: item.uid,
        })
      );
    }
  };

  const renderFavoriteCard = ({ item }) => {
    const isSalon = Boolean(item.ratings);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.userCardContent}
          onPress={() => handleCardPress(item)}
        >
          <Image
            source={
              isSalon
                ? getImage(item.image) || { uri: defaultAvatar }
                : { uri: item.photoURL || defaultAvatar }
            }
            style={styles.profileImage}
          />
          <View style={styles.textContent}>
            <Text style={styles.name}>
              {isSalon ? item.stylist : item.displayName}
            </Text>
            <Text style={styles.info}>
              {isSalon
                ? `${item.treatment} • ${item.distance}`
                : item.location || "Plats ej angiven"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item)}
        >
          <Text style={styles.removeButtonText}>Ta bort</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const safeFavorites = favorites.filter((item) => item.id !== undefined);
  const safeUserFavorites = userFavorites.filter(
    (item) => item.uid !== undefined
  );

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerTop}></View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Favoriter ({safeFavorites.length + safeUserFavorites.length})
          </Text>
        </View>
      </View>

      {safeFavorites.length > 0 || safeUserFavorites.length > 0 ? (
        <FlatList
          data={[
            { type: "header", id: "salonHeader", title: "Frisörer" },
            ...safeFavorites,
            { type: "header", id: "userHeader", title: "Användare" },
            ...safeUserFavorites,
          ]}
          keyExtractor={(item, index) => {
            if (item.type === "header") return item.id;
            return item.ratings
              ? `salon-${item.id || `undefined-${index}`}`
              : `user-${item.uid || `undefined-${index}`}`;
          }}
          renderItem={({ item }) => {
            if (item.type === "header") {
              const shouldShow =
                item.id === "salonHeader"
                  ? safeFavorites.length > 0
                  : safeUserFavorites.length > 0;

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

      <Footer
        favoritesCount={safeFavorites.length + safeUserFavorites.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTop: {
    backgroundColor: "#7904D4",
    height: 70,
  },
  header: {
    backgroundColor: "#9E38EE",
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
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
    fontSize: 18,
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
    paddingVertical: 6,
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
});

export default Favorites;
