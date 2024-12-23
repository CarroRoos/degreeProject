import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserFavorite,
  removeUserFavorite,
  loadUserFavoriteCount,
  loadUserFavorites,
} from "../slices/userSlice";
import Footer from "../components/Footer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, storage, db } from "../config/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
  setDoc,
} from "firebase/firestore";

function UserProfile({ route, navigation }) {
  const dispatch = useDispatch();
  const { userId } = route.params;
  const currentUserId = useSelector((state) => state.users.currentUserId);
  const userFavorites = useSelector((state) => state.users.userFavorites || []);
  const favoriteCounts = useSelector(
    (state) => state.users.favoriteCounts || {}
  );
  const [gallery, setGallery] = useState([]);
  const [user, setUser] = useState(null);
  const [favoriteSalon, setFavoriteSalon] = useState(null);
  const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

  const isFavorite = userFavorites.some((fav) => fav.uid === userId);
  const [localFavoriteCount, setLocalFavoriteCount] = useState(
    favoriteCounts[userId] || 0
  );
  const isOwnProfile = auth.currentUser?.uid === userId;

  // Load favorites when component mounts
  useEffect(() => {
    if (currentUserId) {
      dispatch(loadUserFavorites(currentUserId));
    }
  }, [currentUserId, dispatch]);

  useEffect(() => {
    setLocalFavoriteCount(favoriteCounts[userId] || 0);
  }, [favoriteCounts, userId]);

  const loadUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadUserImages = async (userId) => {
    try {
      const imagesRef = ref(storage, `users/${userId}/images`);
      const imagesList = await listAll(imagesRef);
      const urlPromises = imagesList.items.map(async (imageRef) => {
        const url = await getDownloadURL(imageRef);
        return { url, path: imageRef.fullPath };
      });
      const images = await Promise.all(urlPromises);
      setGallery(images.reverse());
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  const loadFavoriteSalon = async (userId) => {
    try {
      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", userId),
        where("type", "==", "Salon")
      );
      const querySnapshot = await getDocs(favoritesQuery);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error("Error loading favorite salon:", error);
      return null;
    }
  };

  const handleFavoritePress = async () => {
    if (!currentUserId) {
      Alert.alert(
        "Logga in",
        "Du måste vara inloggad för att favoritmarkera användare"
      );
      navigation.navigate("Login");
      return;
    }

    if (!user || isOwnProfile) return;

    try {
      const userFavoritesRef = doc(db, "userFavorites", currentUserId);

      if (isFavorite) {
        // Remove from favorites
        dispatch(
          removeUserFavorite({
            currentUserId: currentUserId,
            userId: userId,
          })
        );
        setLocalFavoriteCount((prev) => prev - 1);

        // Update in Firestore
        const currentFavorites = userFavorites.filter(
          (fav) => fav.uid !== userId
        );
        await setDoc(
          userFavoritesRef,
          { favorites: currentFavorites },
          { merge: true }
        );
      } else {
        // Add to favorites
        const userObject = {
          uid: user.id,
          displayName: user.displayName || user.email,
          photoURL: user.photoURL,
          location: user.location,
        };

        dispatch(
          addUserFavorite({
            currentUserId: currentUserId,
            favoriteUser: userObject,
          })
        );
        setLocalFavoriteCount((prev) => prev + 1);

        // Update in Firestore
        const currentFavorites = [...userFavorites, userObject];
        await setDoc(
          userFavoritesRef,
          { favorites: currentFavorites },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      Alert.alert("Fel", "Kunde inte uppdatera favoriter");
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserData(userId);
      loadUserImages(userId);
      dispatch(loadUserFavoriteCount(userId));
      loadFavoriteSalon(userId).then(setFavoriteSalon);
    }
  }, [userId, dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}></View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.photoURL || defaultAvatar }}
            style={styles.profileImage}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>
              {user?.displayName || "Användare"}
            </Text>
            <View style={styles.favoriteContainer}>
              {isOwnProfile ? (
                <View style={styles.heartContainer}>
                  <Icon name="heart" size={24} color="#9E38EE" />
                  <Text style={styles.favoriteCount}>{localFavoriteCount}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.heartContainer}
                  onPress={handleFavoritePress}
                >
                  <Icon
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={24}
                    color="#9E38EE"
                  />
                  <Text style={styles.favoriteCount}>{localFavoriteCount}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {user?.location && (
            <Text style={styles.location}>{user.location}</Text>
          )}
        </View>

        <View style={styles.scissorsContainer}>
          <Icon name="content-cut" size={40} color="#9E38EE" />
          <Icon name="bottle-tonic-outline" size={40} color="#000" />
          <Icon name="spa-outline" size={40} color="#000" />
          <Icon name="face-woman-shimmer" size={40} color="#000" />
        </View>

        <FlatList
          data={gallery}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.url }} style={styles.galleryImage} />
            </View>
          )}
          contentContainerStyle={styles.galleryContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Inga bilder uppladdade än 💜</Text>
          }
        />
        <TouchableOpacity
          style={styles.stylistButton}
          onPress={() =>
            navigation.navigate("StylistProfile", {
              stylist: favoriteSalon
                ? {
                    id: favoriteSalon.favoriteId,
                    name: favoriteSalon.stylist,
                    salon: favoriteSalon.salon,
                    ratings: favoriteSalon.ratings || favoriteSalon.rating,
                    treatment: favoriteSalon.treatment || "Klippning",
                    distance: favoriteSalon.distance || "0",
                    price: favoriteSalon.price || "1200",
                    time: favoriteSalon.time || "14:30",
                    image: favoriteSalon.image || "",
                  }
                : {
                    id: user?.id || "default_id",
                    name: user?.displayName || "Okänd Stylist",
                    salon: user?.salon || "Okänd Salong",
                    ratings: user?.ratings || "5.0",
                    price: user?.price || "1200",
                    time: user?.time || "14:30",
                    treatment: user?.treatment || "Klippning",
                    distance: user?.distance || "0",
                  },
            })
          }
        >
          <Text style={styles.stylistButtonText}>Min Frisör</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
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
  scrollContent: {
    paddingTop: 120,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: 50,
  },
  nameContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  favoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteCount: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  scissorsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
    marginBottom: 10,
  },
  galleryContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  imageWrapper: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 2,
  },
  galleryImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  stylistButton: {
    backgroundColor: "#9E38EE",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 200,
    alignItems: "center",
  },
  stylistButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UserProfile;
