import React, { useState, useEffect } from "react";
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
import { db, auth } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function StylistProfile({ route, navigation }) {
  const { stylist } = route.params;
  const currentUserId = auth.currentUser?.uid;

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const gallery = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  const customerGallery = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  useEffect(() => {
    const loadFavoriteData = async () => {
      try {
        const favoriteQuery = query(
          collection(db, "favorites"),
          where("userId", "==", currentUserId),
          where("favoriteId", "==", stylist.id),
          where("type", "==", "Salon")
        );
        const favoriteSnapshot = await getDocs(favoriteQuery);
        setIsFavorite(!favoriteSnapshot.empty);

        const countQuery = query(
          collection(db, "favorites"),
          where("favoriteId", "==", stylist.id),
          where("type", "==", "Salon")
        );
        const countSnapshot = await getDocs(countQuery);
        setFavoriteCount(countSnapshot.size);
      } catch (error) {
        console.error("Error loading favorite data:", error);
      }
    };

    loadFavoriteData();
  }, [currentUserId, stylist.id]);

  const toggleFavorite = async () => {
    try {
      const docRef = doc(db, "favorites", `${currentUserId}-${stylist.id}`);
      if (isFavorite) {
        await deleteDoc(docRef);
        setIsFavorite(false);
        setFavoriteCount((prev) => Math.max(prev - 1, 0));
      } else {
        await setDoc(docRef, {
          userId: currentUserId,
          favoriteId: stylist.id,
          type: "Salon",
          stylistName: stylist.name,
          salonName: stylist.salon,
          image: stylist.image,
          rating: stylist.ratings,
        });
        setIsFavorite(true);
        setFavoriteCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleBooking = (selectedTime) => {
    navigation.navigate("BookingConfirmation", {
      stylist: {
        name: stylist.name,
        ratings: stylist.ratings,
        salon: stylist.salon,
        image: stylist.image,
        treatment: stylist.treatment || "Klippning",
        price: stylist.price,
        distance: stylist.distance,
      },
      bookingTime: selectedTime,
      bookingDate: "Idag",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{
            uri: stylist.image || "https://via.placeholder.com/500x200",
          }}
          style={styles.placeholderImage}
        />

        <View style={styles.header}>
          <Text style={styles.stylistInfo}>
            <Text style={styles.stylistName}>{stylist.name} </Text>
            hos {stylist.salon} ⭐ {stylist.ratings} - recensioner
          </Text>
        </View>

        <View style={styles.bookingSection}>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingDate}>Idag</Text>
            <Text style={styles.bookingTime}>{stylist.time || "14:30"}</Text>
            <Text style={styles.bookingPrice}>
              {stylist.price || "1200"} kr
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={() => handleBooking(stylist.time || "14:30")}
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
                <MaterialCommunityIcons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={40}
                  color={isFavorite ? "#9E38EE" : "#777"}
                />
                <Text style={styles.favoriteCount}>{favoriteCount}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.stylistDescription}>
            15 års erfarenhet{"\n"}Innehar gesällbrev, mästarbrev{"\n"}
            Utbildning i Hairtalk{"\n"}Salong: {stylist.salon}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Fler tider</Text>
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>17:00</Text>
          <Text style={styles.timePrice}>{stylist.price || "1200"} kr</Text>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={() => handleBooking("17:00")}
          >
            <Text style={styles.bookingButtonText}>Boka</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.timeText}>18:30</Text>
          <Text style={styles.timePrice}>{stylist.price || "1200"} kr</Text>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={() => handleBooking("18:30")}
          >
            <Text style={styles.bookingButtonText}>Boka</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Plats:</Text>
        <Text style={styles.placeText}>Karlaplan 12, {stylist.distance} m</Text>
        <View style={styles.mapPlaceholder}>
          <Text>Karta här</Text>
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

        <Text style={styles.sectionTitle}>Kund: Amira</Text>
        <FlatList
          data={customerGallery}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.galleryImage} />
          )}
        />
        <TouchableOpacity
          style={styles.customerButton}
          onPress={() =>
            navigation.navigate("UserProfile", {
              userId: "BzoYt1Z5EpY4oIqGOLBvYFMllJp1",
            })
          }
        >
          <Text style={styles.customerButtonText}>Till Amira</Text>
        </TouchableOpacity>

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
  stylistName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
