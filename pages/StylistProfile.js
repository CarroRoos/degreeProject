import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import Footer from "../components/Footer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../slices/salonSlice";

function StylistProfile({ route, navigation }) {
  const { stylist } = route.params;

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.salons.favorites || []);
  const favoriteCounts = useSelector(
    (state) => state.salons.favoriteCounts || {}
  );
  const isFavorite = favorites.some((fav) => fav.id === stylist.id);
  const favoriteCount = favoriteCounts[stylist.id] || 0;

  const getImage = (imageName) => {
    try {
      switch (imageName) {
        case "freddie":
          return require("../assets/images/freddie.jpg");
        case "samira":
          return require("../assets/images/samira.jpg");
        case "jennifer":
          return require("../assets/images/jennifer.jpg");
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error loading image for ${imageName}:`, error);
      return null;
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(stylist.id));
    } else {
      dispatch(addFavorite(stylist));
    }
  };

  const gallery = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  const customerGallery = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  const handleBooking = () => {
    navigation.navigate("BookingConfirmation", {
      stylistName: stylist.name,
      bookingTime: "14:30",
      bookingDate: "11 september",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={
            getImage(stylist.image) || {
              uri: "https://via.placeholder.com/500x200",
            }
          }
          style={styles.placeholderImage}
        />

        <View style={styles.header}>
          <Text style={styles.stylistInfo}>
            hos {stylist.salon} ⭐ {stylist.ratings} - recensioner
          </Text>
        </View>

        <View style={styles.bookingSection}>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingDate}>Idag</Text>
            <Text style={styles.bookingTime}>14:30</Text>
            <Text style={styles.bookingPrice}>1200 kr</Text>
          </View>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={handleBooking}
          >
            <Text style={styles.bookingButtonText}>Boka</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stylistDetails}>
          <View style={styles.stylistHeader}>
            <View style={styles.favoriteContainer}>
              <Text style={styles.roleText}>Frisör</Text>
              <TouchableOpacity
                style={styles.heartButton}
                onPress={toggleFavorite}
              >
                <View style={styles.heartContainer}>
                  <MaterialCommunityIcons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={40}
                    color={isFavorite ? "#9E38EE" : "#777"}
                  />
                  <Text style={styles.favoriteCount}>{favoriteCount}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.stylistDescription}>
            15 års erfarenhet{"\n"}Innehar gesällbrev, mästarbrev{"\n"}
            Utbildning i Hairtalk{"\n"}Salong: {stylist.salon}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Utvalda hårbilder</Text>
        <FlatList
          data={gallery}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.galleryImage} />
          )}
        />

        <Text style={styles.sectionTitle}>Kund: Frida Nord</Text>
        <FlatList
          data={customerGallery}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.galleryImage} />
          )}
        />
        <TouchableOpacity style={styles.customerButton}>
          <Text style={styles.customerButtonText}>Till Frida</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Fler tider</Text>
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>17:00</Text>
          <Text style={styles.timePrice}>1200 kr</Text>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={handleBooking}
          >
            <Text style={styles.bookingButtonText}>Boka</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>18:30</Text>
          <Text style={styles.timePrice}>1200 kr</Text>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={handleBooking}
          >
            <Text style={styles.bookingButtonText}>Boka</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Plats:</Text>
        <Text style={styles.placeText}>Karlaplan 12, 300 m</Text>
        <View style={styles.mapPlaceholder}>
          <Text>Karta här</Text>
        </View>

        <Text style={styles.sectionTitle}>Behandling hemma hos dig</Text>
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>20:00</Text>
          <Text style={styles.timePrice}>2500 kr</Text>
          <TouchableOpacity style={styles.requestButton}>
            <Text style={styles.requestButtonText}>Förfrågan</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Låt frisören komma hem till dig</Text>
        <Text style={styles.homeServiceText}>
          Om det är enklast att genomföra det hemma hos dig, då ordnar vi det.
          Priset gäller klipp, färg och styling.
        </Text>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 40,
    marginTop: 90,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  stylistInfo: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  bookingSection: {
    padding: 20,
    backgroundColor: "#7904D4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: -5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  bookingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingDate: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 10,
  },
  bookingTime: {
    fontSize: 16,
    color: "#fff",
    marginRight: 10,
  },
  bookingPrice: {
    fontSize: 16,
    color: "#fff",
    marginRight: 10,
  },
  bookingButton: {
    backgroundColor: "#C190FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  bookingButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stylistDetails: {
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: "#f3e6ff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stylistHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  favoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleText: {
    fontSize: 24,
    color: "#555",
    marginRight: 10,
  },
  heartButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteCount: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  stylistDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    fontWeight: "bold",
    color: "#000",
  },
  galleryImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  customerButton: {
    backgroundColor: "#9E38EE",
    padding: 10,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  customerButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  timeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#F9F9F9",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  timePrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  requestButton: {
    backgroundColor: "#C190FF",
    padding: 10,
    borderRadius: 8,
  },
  requestButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  mapPlaceholder: {
    backgroundColor: "#ddd",
    height: 150,
    marginHorizontal: 20,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  placeText: {
    fontSize: 16,
    color: "#000",
    marginHorizontal: 20,
    marginBottom: 5,
  },
  homeServiceText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default StylistProfile;
