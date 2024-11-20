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

function StylistProfile({ route }) {
  const { stylist } = route.params;

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Placeholder-bild */}
        <Image
          source={{
            uri: "https://via.placeholder.com/500x200",
          }}
          style={styles.placeholderImage}
        />

        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: stylist.image }} style={styles.headerImage} />
          <Text style={styles.stylistInfo}>
            {stylist.title} hos {stylist.salon} ⭐ {stylist.ratings} -{" "}
            {stylist.reviews} recensioner
          </Text>
        </View>

        {/* Boka sektion */}
        <View style={styles.bookingSection}>
          <Text style={styles.bookingDate}>Idag</Text>
          <Text style={styles.bookingTime}>14:30</Text>
          <Text style={styles.bookingPrice}>1200 kr</Text>
          <TouchableOpacity style={styles.bookingButton}>
            <Text style={styles.bookingButtonText}>Boka</Text>
          </TouchableOpacity>
        </View>

        {/* Frisörinfo */}
        <View style={styles.stylistDetails}>
          <Text style={styles.stylistName}>{stylist.name} - Frisör</Text>
          <Text style={styles.stylistDescription}>
            15 års erfarenhet{"\n"}Innehar gesällbrev, mästarbrev{"\n"}
            Utbildning i Hairtalk{"\n"}Salong: {stylist.salon}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Favorit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Boka</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Salong</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Galleri */}
        <Text style={styles.sectionTitle}>Utvalda hårbilder</Text>
        <FlatList
          data={gallery}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.galleryImage} />
          )}
        />

        {/* Kundsektion */}
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

        {/* Fler tider */}
        <Text style={styles.sectionTitle}>Fler tider</Text>
        <View style={styles.timeSection}>
          <Text>17:00</Text>
          <Text>1200 kr</Text>
          <TouchableOpacity style={styles.bookingButton}>
            <Text style={styles.bookingButtonText}>Boka</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.timeSection}>
          <Text>18:30</Text>
          <Text>1200 kr</Text>
          <TouchableOpacity style={styles.bookingButton}>
            <Text style={styles.bookingButtonText}>Boka</Text>
          </TouchableOpacity>
        </View>

        {/* Plats */}
        <Text style={styles.sectionTitle}>Plats:</Text>
        <Text style={styles.placeText}>Karlaplan 12, 300 m</Text>
        <View style={styles.mapPlaceholder}>
          <Text>Karta här</Text>
        </View>

        {/* Hemservice */}
        <Text style={styles.sectionTitle}>Behandling hemma hos dig</Text>
        <View style={styles.timeSection}>
          <Text>20:00</Text>
          <Text>2500 kr</Text>
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
      {/* Footer */}
      <Footer />
    </View>
  );
}

export default StylistProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  placeholderImage: {
    width: "100%",
    height: 300,
    marginBottom: 10,
  },

  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  stylistInfo: {
    color: "#000",
    textAlign: "center",
    marginTop: -120,
  },
  bookingSection: {
    padding: 20,
    backgroundColor: "#7904D4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    margin: 15,
    marginTop: 20,
  },
  bookingDate: { fontSize: 18, color: "#fff" },
  bookingTime: { fontSize: 18, color: "#fff" },
  bookingPrice: { fontSize: 18, color: "#fff" },
  bookingButton: {
    backgroundColor: "#C190FF",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  bookingButtonText: { color: "#000" },
  stylistDetails: {
    padding: 20,
    marginVertical: 10,
  },
  stylistName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  stylistDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  actionButton: {
    backgroundColor: "#9E38EE",
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    marginTop: 20,
    fontWeight: "bold",
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
    margin: 20,
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
  },
  requestButton: {
    backgroundColor: "#9E38EE",
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

  scrollContent: {
    paddingBottom: 100,
  },
});
