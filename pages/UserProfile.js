import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";
import Footer from "../components/Footer";

export default function UserProfile({ route, navigation }) {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log("Försöker hämta användardata för userId:", userId);
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          console.log("Hittade användardata:", userDoc.data());
          setUserData(userDoc.data());
        } else {
          console.log("Ingen användardata hittades för userId:", userId);
          setError("Användaren hittades inte");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("Kunde inte ladda användardata");
      }
    };

    const loadUserImages = async () => {
      try {
        console.log("Loading images for user:", userId);
        const imagesRef = ref(storage, `users/${userId}/images`);
        const imagesList = await listAll(imagesRef);
        console.log("Found images:", imagesList.items.length);

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
        setError("Kunde inte ladda bilder");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    loadUserImages();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Laddar...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
            uri: userData?.photoURL || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
          onError={(error) =>
            console.log("Profile image error:", error.nativeEvent.error)
          }
        />
        <Text style={styles.profileName}>
          {userData?.displayName || userData?.email || "Användare"}
        </Text>
      </View>

      <View style={styles.scissorsContainer}>
        <Image
          source={require("../assets/icons/scissors2.png")}
          style={[styles.scissorIcon, { tintColor: "#9E38EE" }]}
        />
        <Image
          source={require("../assets/icons/nail-polish.png")}
          style={[styles.scissorIcon, { tintColor: "black" }]}
        />
        <Image
          source={require("../assets/icons/spa_.png")}
          style={[styles.scissorIcon, { tintColor: "black" }]}
        />
        <Image
          source={require("../assets/icons/makeup_.png")}
          style={[styles.scissorIcon, { tintColor: "black" }]}
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
  profileName: {
    fontSize: 20,
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
  scissorIcon: {
    marginTop: 30,
    width: 40,
    height: 40,
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
