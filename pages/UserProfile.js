import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addUserFavorite, removeUserFavorite } from "../slices/userSlice";
import Footer from "../components/Footer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, storage, db } from "../config/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";

function UserProfile({ route, navigation }) {
  const dispatch = useDispatch();
  const { userId } = route.params;
  const userFavorites = useSelector((state) => state.users.userFavorites || []);
  const favoriteCounts = useSelector(
    (state) => state.users.favoriteCounts || {}
  );
  const [gallery, setGallery] = useState([]);
  const [user, setUser] = useState(null);
  const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

  const isFavorite = userFavorites.some((fav) => fav.uid === userId);
  const favoriteCount = favoriteCounts[userId] || 0;

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

  const handleFavoritePress = () => {
    if (!user || auth.currentUser?.uid === userId) return;

    if (isFavorite) {
      dispatch(removeUserFavorite(userId));
    } else {
      const userObject = {
        uid: user.id,
        displayName: user.displayName || user.email,
        photoURL: user.photoURL,
        location: user.location,
      };
      dispatch(addUserFavorite(userObject));
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserData(userId);
      loadUserImages(userId);
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerTop}></View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
      </View>

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
            {auth.currentUser?.uid !== userId ? (
              <TouchableOpacity onPress={handleFavoritePress}>
                <Icon
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color="#9E38EE"
                />
              </TouchableOpacity>
            ) : (
              <Icon name="heart" size={24} color="#9E38EE" />
            )}
            <Text style={styles.favoriteCount}>{favoriteCount}</Text>
          </View>
        </View>
        {user?.location && <Text style={styles.location}>{user.location}</Text>}
      </View>

      <View style={styles.scissorsContainer}>
        <Image
          source={require("../assets/icons/scissors2.png")}
          style={[
            styles.scissorIcon,
            { tintColor: styles.scissorIcon.tintColor("scissors2") },
          ]}
        />
        <Image
          source={require("../assets/icons/nail-polish.png")}
          style={[
            styles.scissorIcon,
            { tintColor: styles.scissorIcon.tintColor("nail-polish") },
          ]}
        />
        <Image
          source={require("../assets/icons/spa_.png")}
          style={[
            styles.scissorIcon,
            { tintColor: styles.scissorIcon.tintColor("spa_") },
          ]}
        />
        <Image
          source={require("../assets/icons/makeup_.png")}
          style={[
            styles.scissorIcon,
            { tintColor: styles.scissorIcon.tintColor("makeup_") },
          ]}
        />
      </View>

      <FlatList
        data={gallery}
        numColumns={3}
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
      <Footer />
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
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
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
  scissorIcon: {
    marginTop: 30,
    width: 40,
    height: 40,
    tintColor: (iconName) => (iconName === "scissors2" ? "#9E38EE" : "black"),
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
});

export default UserProfile;
