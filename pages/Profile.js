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
  const [menuVisible, setMenuVisible] = useState(false);
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
      dispatch(setCurrentUser(null));
      dispatch(clearUserFavorites());
      dispatch(clearFavorites());

      await signOut(auth);
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

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Icon name="cog" size={24} color="#fff" />
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  navigation.navigate("EditProfile");
                  setMenuVisible(false);
                }}
              >
                <Icon name="image-plus" size={20} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Lägg till bilder</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  navigation.navigate("EditMyProfile");
                  setMenuVisible(false);
                }}
              >
                <Icon name="account-edit" size={20} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Redigera profil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.lastButton]}
                onPress={() => {
                  handleLogout();
                  setMenuVisible(false);
                }}
              >
                <Icon name="logout" size={20} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Logga ut</Text>
              </TouchableOpacity>
            </View>
          )}
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
              </View>

              <View style={styles.scissorsContainer}>
                <Icon name="content-cut" size={40} color="#9E38EE" />
                <Icon name="bottle-tonic-outline" size={40} color="#000" />
                <Icon name="spa-outline" size={40} color="#000" />
                <Icon name="face-woman-shimmer" size={40} color="#000" />
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
                    stylist: favoriteSalon
                      ? {
                          id: favoriteSalon.favoriteId,
                          name: favoriteSalon.stylist,
                          salon: favoriteSalon.salon,
                          ratings:
                            favoriteSalon.ratings || favoriteSalon.rating,
                          treatment: favoriteSalon.treatment || "Klippning",
                          distance: favoriteSalon.distance || "0",
                          price: favoriteSalon.price || "1200",
                          time: favoriteSalon.time || "14:30",
                          image: favoriteSalon.image || "",
                        }
                      : {
                          salon: "Standard Salong",
                          ratings: "4.8",
                          reviews: "0 recensioner",
                          name: "Ingen favorit vald",
                          treatment: "Klippning",
                          price: "1200",
                          time: "14:30",
                          distance: "0",
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
    backgroundColor: "#9E38EE",
    height: 70,
  },
  header: {
    backgroundColor: "#9E38EE",
    paddingBottom: 20,
    alignItems: "center",
    position: "relative",
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1000,
  },
  dropdownMenu: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    width: 180,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1000,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 19,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  scissorsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
    marginBottom: 10,
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
    alignItems: "center",
  },
  stylistButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  lastButton: {
    borderBottomWidth: 0,
  },
  buttonIcon: {
    marginRight: 12,
    color: "#9E38EE",
  },
  buttonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Profile;
