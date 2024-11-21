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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function Profile({ route }) {
  const user = {
    name: "Frida Nord",
    image: "https://via.placeholder.com/150",
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

  const { isUserProfile, userProfile } = route.params || {};
  const displayedUser = isUserProfile ? userProfile : user;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View>
        <View style={styles.headerTop}></View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
      </View>

      {/* Profilinformation */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: displayedUser.image }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{displayedUser.name}</Text>
        {isUserProfile ? (
          <Text style={styles.profileCategory}>
            Kategori: {displayedUser.category?.join(", ") || "Ej angiven"}
          </Text>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.buttonText}>Redigera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.buttonText}>Dela profil</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Ikoner */}
      <View style={styles.iconsRow}>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="content-cut"
            size={40}
            color="#9E38EE"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="spa-outline"
            size={40}
            color="#9E38EE"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="lipstick" size={40} color="#9E38EE" />
        </TouchableOpacity>
      </View>

      {/* Galleri */}
      <FlatList
        data={displayedUser.gallery}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.galleryImage} />
        )}
        contentContainerStyle={styles.galleryContainer}
      />

      {/* Stylistinfo */}
      {!isUserProfile && (
        <View style={styles.stylistSection}>
          <Text style={styles.stylistText}>Frisör: {user.stylist}</Text>
          <TouchableOpacity style={styles.stylistButton}>
            <Text style={styles.stylistButtonText}>Till {user.stylist}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <Footer disableHighlight={!isUserProfile} />
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
  profileCategory: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
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
  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    marginTop: 40,
    marginBottom: 0,
    gap: 0,
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
    marginTop: -130,
  },
  stylistButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
