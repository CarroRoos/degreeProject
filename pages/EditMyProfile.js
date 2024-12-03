import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, storage, db } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const EditMyProfile = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categories = ["Hår", "Naglar", "Massage", "Skönhet"];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setLocation(data.location || "");
        setSelectedCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSave = async () => {
    try {
      let photoURL = auth.currentUser.photoURL;

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(
          storage,
          `users/${auth.currentUser.uid}/profile.jpg`
        );
        await uploadBytes(imageRef, blob);
        photoURL = await getDownloadURL(imageRef);
        await updateProfile(auth.currentUser, { photoURL });
      }

      const userData = {
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL,
        location,
        categories: selectedCategories,
        uid: auth.currentUser.uid,
      };

      await setDoc(doc(db, "users", auth.currentUser.uid), userData, {
        merge: true,
      });

      await fetch(
        `https://UBHJYH9DZZ-dsn.algolia.net/1/indexes/users/${auth.currentUser.uid}`,
        {
          method: "PUT",
          headers: {
            "X-Algolia-API-Key": "b0fb4ded362b98421a89e30a99a8f1ef",
            "X-Algolia-Application-Id": "UBHJYH9DZZ",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            objectID: auth.currentUser.uid,
            ...userData,
          }),
        }
      );

      Alert.alert("Klart!", "Din profil har uppdaterats");
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Fel", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Redigera Profil</Text>
      </View>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        <Image
          source={{
            uri:
              image ||
              auth.currentUser?.photoURL ||
              "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Ändra profilbild</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ort</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Ange din ort"
        />
      </View>

      <Text style={styles.label}>Kategorier</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategories.includes(category) && styles.selectedCategory,
            ]}
            onPress={() => toggleCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategories.includes(category) &&
                  styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Spara ändringar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#9E38EE",
    paddingVertical: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changePhotoText: {
    color: "#9E38EE",
    fontWeight: "bold",
  },
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#9E38EE",
  },
  selectedCategory: {
    backgroundColor: "#9E38EE",
  },
  categoryText: {
    color: "#9E38EE",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#9E38EE",
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditMyProfile;
