import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Footer from "../components/Footer";

function Profile() {
  const user = {
    name: "Frida Nord",
    image: "https://your-image-url-here.com/profile.jpg",
    stylist: "Samira Berg",
    gallery: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header med två lila sektioner */}
      <View>
        <View style={styles.headerTop}></View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
      </View>

      {/* Profilinformation */}
      <View style={styles.profileSection}>
        <Image source={{ uri: user.image }} style={styles.profileImage} />
        <Text style={styles.profileName}>{user.name}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>Redigera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.buttonText}>Dela profil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Galleri */}
      <FlatList
        data={user.gallery}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.galleryImage} />
        )}
        contentContainerStyle={styles.galleryContainer}
      />

      {/* Stylistinfo */}
      <View style={styles.stylistSection}>
        <Text style={styles.stylistText}>Frisör: {user.stylist}</Text>
        <TouchableOpacity style={styles.stylistButton}>
          <Text style={styles.stylistButtonText}>Till {user.stylist}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
}

export default Profile;

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
    width: "60%",
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
  galleryContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  stylistSection: {
    alignItems: "center",
    marginTop: -100,
    paddingVertical: 10,
  },
  stylistText: {
    fontSize: 16,
    marginBottom: 10,
  },
  stylistButton: {
    backgroundColor: "#9E38EE",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: -180,
  },
  stylistButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
