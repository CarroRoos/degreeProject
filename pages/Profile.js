import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import Footer from "../components/Footer";
import { auth, storage } from "../config/firebase";
import { signOut } from "firebase/auth";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";

function Profile({ route, navigation }) {
  const [gallery, setGallery] = useState([]);
  const [user, setUser] = useState(null);

  const loadUserImages = async (userId) => {
    try {
      console.log("Loading images for user:", userId);
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
      console.log("All loaded images:", images);
      setGallery(images.reverse());
    } catch (error) {
      console.error("Error loading images:", error);
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
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Fel vid utloggning", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadUserImages(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (auth.currentUser) {
        loadUserImages(auth.currentUser.uid);
      }
    });

    return unsubscribe;
  }, [navigation]);

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
          source={{
            uri: user?.photoURL || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>
          {user?.displayName || user?.email || "Användare"}
        </Text>
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

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logga ut</Text>
        </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteImage(item.path)}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
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
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 10,
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
    backgroundColor: "rgba(255, 0, 0, 0.7)",
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
});

export default Profile;
