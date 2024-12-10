import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import Footer from "../components/Footer";
import { auth, storage, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { setCurrentUser, clearUserFavorites } from "../slices/userSlice";
import { clearFavorites } from "../slices/salonSlice";

function Profile({ navigation }) {
  const dispatch = useDispatch();
  const [gallery, setGallery] = useState([]);
  const [user, setUser] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favoriteSalon, setFavoriteSalon] = useState(null);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

  const loadUserImages = async (userId) => {
    setLoadingGallery(true);
    try {
      const imagesRef = ref(storage, `users/${userId}/images`);
      const imagesList = await listAll(imagesRef);

      const urlPromises = imagesList.items.map(async (imageRef) => {
        const url = await getDownloadURL(imageRef);
        return {
          url,
          path: imageRef.fullPath,
        };
      });

      const images = await Promise.all(urlPromises);
      setGallery(images.reverse());
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const loadFavoriteCount = async (userId) => {
    try {
      const favoritesQuery = query(
        collection(db, "favorites"),
        where("favoriteId", "==", userId),
        where("type", "==", "User")
      );
      const querySnapshot = await getDocs(favoritesQuery);
      return querySnapshot.size;
    } catch (error) {
      console.error("Error loading favorite count:", error);
      return 0;
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

  const handleDeleteImage = async (imagePath) => {
    Alert.alert(
      "Ta bort bild",
      "Är du säker på att du vill ta bort denna bild?",
      [
        {
          text: "Avbryt",
          style: "cancel",
        },
        {
          text: "Ta bort",
          style: "destructive",
          onPress: async () => {
            try {
              const imageRef = ref(storage, imagePath);
              await deleteObject(imageRef);

              setGallery((prevGallery) =>
                prevGallery.filter((img) => img.path !== imagePath)
              );

              Alert.alert("Klart!", "Bilden har tagits bort");
            } catch (error) {
              console.error("Error deleting image:", error);
              Alert.alert("Fel", "Kunde inte ta bort bilden");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(setCurrentUser(null));
      dispatch(clearUserFavorites());
      dispatch(clearFavorites());
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Fel vid utloggning", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadUserImages(currentUser.uid);

        const count = await loadFavoriteCount(currentUser.uid);
        setFavoriteCount(count);

        const salon = await loadFavoriteSalon(currentUser.uid);
        setFavoriteSalon(salon);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (auth.currentUser) {
        loadUserImages(auth.currentUser.uid);
        loadFavoriteCount(auth.currentUser.uid).then(setFavoriteCount);
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}></View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
      </View>

      {loadingGallery ? (
        <ActivityIndicator size="large" color="#9E38EE" />
      ) : (
        <FlatList
          data={gallery}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.url }} style={styles.galleryImage} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteImage(item.path)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={
            <>
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: user?.photoURL || defaultAvatar }}
                  style={styles.profileImage}
                />
                <View style={styles.nameContainer}>
                  <Text style={styles.profileName}>
                    {user?.displayName || user?.email || "Användare"}
                  </Text>
                  <View style={styles.favoriteContainer}>
                    <Icon name="heart" size={24} color="#9E38EE" />
                    <Text style={styles.favoriteCount}>{favoriteCount}</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate("EditProfile")}
                  >
                    <Text style={styles.buttonText}>+ bilder</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => navigation.navigate("EditMyProfile")}
                  >
                    <Text style={styles.buttonText}>Redigera</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>Logga ut</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.scissorsContainer}>
                <Image
                  source={require("../assets/icons/scissors2.png")}
                  style={[styles.scissorIcon, { tintColor: "#9E38EE" }]}
                />
                <Image
                  source={require("../assets/icons/nail-polish.png")}
                  style={[styles.scissorIcon, { tintColor: "#000" }]}
                />
                <Image
                  source={require("../assets/icons/spa_.png")}
                  style={[styles.scissorIcon, { tintColor: "#000" }]}
                />
                <Image
                  source={require("../assets/icons/makeup_.png")}
                  style={[styles.scissorIcon, { tintColor: "#000" }]}
                />
              </View>
            </>
          }
          ListFooterComponent={
            <>
              {gallery.length === 0 && (
                <Text style={styles.emptyText}>
                  Inga bilder uppladdade än 💜
                </Text>
              )}
              <TouchableOpacity
                style={styles.stylistButton}
                onPress={() =>
                  navigation.navigate("StylistProfile", {
                    stylist: favoriteSalon || {
                      salon: "Standard Salong",
                      ratings: "4.8",
                      reviews: "0 recensioner",
                      name: "Ingen favorit vald",
                    },
                  })
                }
              >
                <Text style={styles.stylistButtonText}>Min Frisör</Text>
              </TouchableOpacity>
            </>
          }
          contentContainerStyle={styles.flatListContent}
        />
      )}
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
  flatListContent: {
    paddingTop: 120,
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginTop: 40,
  },
  favoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  favoriteCount: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#9E38EE",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  shareButton: {
    backgroundColor: "#9E38EE",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  scissorsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
    marginBottom: 10,
  },
  scissorIcon: {
    marginTop: 30,
    width: 40,
    height: 40,
  },
  imageWrapper: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 2,
    position: "relative",
  },
  galleryImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    right: 5,
    top: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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

export default Profile;
