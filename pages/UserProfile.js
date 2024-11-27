import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";

export default function UserProfile({ route, navigation }) {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [userImages, setUserImages] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    const loadUserImages = async () => {
      try {
        const imagesRef = collection(db, `users/${userId}/images`);
        const querySnapshot = await getDocs(imagesRef);
        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserImages(images);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadUserData();
    loadUserImages();
  }, [userId]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Laddar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: userData.photoURL || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{userData.displayName}</Text>
        </View>

        <View style={styles.gallery}>
          <Text style={styles.galleryTitle}>Galleri</Text>
          <FlatList
            data={userImages}
            numColumns={3}
            renderItem={({ item }) => (
              <Image source={{ uri: item.url }} style={styles.galleryImage} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  gallery: {
    padding: 10,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  galleryImage: {
    width: "33%",
    aspectRatio: 1,
    margin: 1,
    borderRadius: 8,
  },
});
