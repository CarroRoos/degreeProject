import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase";

export default function EditProfile({ navigation }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Permission result:", permissionResult);

        if (permissionResult.status !== "granted") {
          Alert.alert(
            "Behörighet krävs",
            "Vi behöver din tillåtelse för att komma åt dina bilder"
          );
          return;
        }
      }

      console.log("Launching image picker...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("Picker result:", result);

      if (!result.canceled) {
        const newImage = {
          uri: result.assets[0].uri,
          uploaded: false,
        };
        console.log("Adding new image:", newImage);
        setSelectedImages((prev) => {
          const updated = [...prev, newImage];
          console.log("Updated selected images:", updated);
          return updated;
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Fel", "Kunde inte välja bild: " + error.message);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setIsUploading(true);
      console.log("Starting upload process for uri:", uri);

      const response = await fetch(uri);
      console.log("Fetch response received");
      const blob = await response.blob();
      console.log("Blob created, size:", blob.size);

      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error("No user ID found");
        Alert.alert("Fel", "Du måste vara inloggad för att ladda upp bilder");
        return false;
      }

      const fileName = `image_${Date.now()}.jpg`;
      console.log("Creating image reference with filename:", fileName);
      const imageRef = ref(storage, `users/${userId}/images/${fileName}`);

      console.log("Starting upload to Firebase");
      const uploadResult = await uploadBytes(imageRef, blob);
      console.log("Upload completed:", uploadResult);

      const downloadURL = await getDownloadURL(imageRef);
      console.log("Download URL received:", downloadURL);

      Alert.alert("Klart!", "Bilden har laddats upp");
      return true;
    } catch (error) {
      console.error("Detailed upload error:", error);
      console.error("Error stack:", error.stack);
      Alert.alert(
        "Fel vid uppladdning",
        `Detaljerat fel: ${error.message}\nFörsök igen eller kontakta support om problemet kvarstår.`
      );
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAll = async () => {
    try {
      console.log("Starting handleUploadAll");
      const unuploadedImages = selectedImages.filter((img) => !img.uploaded);
      console.log("Unuploaded images count:", unuploadedImages.length);

      if (unuploadedImages.length === 0) {
        Alert.alert("Info", "Inga nya bilder att ladda upp");
        return;
      }

      setIsUploading(true);

      for (let i = 0; i < unuploadedImages.length; i++) {
        const image = unuploadedImages[i];
        console.log(`Attempting upload ${i + 1} of ${unuploadedImages.length}`);

        try {
          const success = await uploadImage(image.uri);
          console.log(`Upload ${i + 1} result:`, success);

          if (success) {
            setSelectedImages((prev) =>
              prev.map((img) =>
                img.uri === image.uri ? { ...img, uploaded: true } : img
              )
            );
          } else {
            throw new Error("Upload returned false");
          }
        } catch (uploadError) {
          console.error(`Error uploading image ${i + 1}:`, uploadError);

          const userChoice = await new Promise((resolve) => {
            Alert.alert(
              "Uppladdningsfel",
              `Kunde inte ladda upp bild ${i + 1} av ${
                unuploadedImages.length
              }. Vill du fortsätta med resterande bilder?`,
              [
                {
                  text: "Avbryt",
                  onPress: () => resolve("cancel"),
                  style: "cancel",
                },
                {
                  text: "Fortsätt",
                  onPress: () => resolve("continue"),
                },
              ]
            );
          });

          if (userChoice === "cancel") {
            console.log("User cancelled remaining uploads");
            break;
          }
        }
      }
    } catch (error) {
      console.error("Fatal error in handleUploadAll:", error);
      Alert.alert("Fel", "Ett oväntat fel uppstod vid uppladdning av bilder");
    } finally {
      setIsUploading(false);
      console.log("HandleUploadAll completed");
    }
  };

  const handleRemoveImage = (uri) => {
    console.log("Removing image:", uri);
    setSelectedImages((prev) => {
      const filtered = prev.filter((img) => img.uri !== uri);
      console.log("Remaining images:", filtered);
      return filtered;
    });
  };

  const handleDone = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redigera profil</Text>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageGrid}>
          {selectedImages.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.preview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(image.uri)}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
              {image.uploaded && (
                <View style={styles.uploadedBadge}>
                  <Text style={styles.uploadedText}>✓</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => {
            console.log("Pick image button pressed");
            pickImage();
          }}
        >
          <Text style={styles.buttonText}>Välj bild</Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <TouchableOpacity
            style={[
              styles.uploadButton,
              {
                backgroundColor: "#7904D4",
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              },
              isUploading && styles.disabledButton,
            ]}
            onPress={() => {
              console.log("Upload button pressed - starting upload process");
              console.log("Current selected images:", selectedImages);
              Alert.alert(
                "Bekräfta uppladdning",
                "Vill du ladda upp den valda bilden?",
                [
                  {
                    text: "Avbryt",
                    style: "cancel",
                  },
                  {
                    text: "Ladda upp",
                    onPress: () => {
                      console.log("Upload confirmed by user");
                      handleUploadAll();
                    },
                  },
                ]
              );
            }}
            disabled={isUploading}
          >
            <Text style={[styles.buttonText, { fontSize: 18 }]}>
              {isUploading ? "Laddar upp..." : "Ladda upp valda bilder"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.buttonText}>Klar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 100,
    marginBottom: 25,
    textAlign: "center",
    color: "#7904D4",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  imageContainer: {
    width: "31%",
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
  },
  removeButton: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  uploadedBadge: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "rgba(52, 199, 89, 0.9)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  uploadedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
  uploadButton: {
    backgroundColor: "#9E38EE",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doneButton: {
    backgroundColor: "#7904D4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
