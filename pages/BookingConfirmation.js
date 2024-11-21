import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useDispatch } from "react-redux";
import { addBooking } from "../slices/bookingsSlice";
import Footer from "../components/Footer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

function BookingConfirmation({ navigation, route }) {
  const dispatch = useDispatch();

  const {
    stylist = {},
    bookingTime = "okänd tid",
    bookingDate = "okänt datum",
  } = route.params || {};

  const handleAddToCalendar = () => {
    const newBooking = {
      id: Date.now(),
      stylist: stylist.name || "Okänd stylist",
      treatment: "Klippning",
      ratings: stylist.ratings || 0,
      reviews: stylist.reviews || 0,
      distance: "300 m", // Exempeldata
      image: "https://via.placeholder.com/300x150",
    };

    dispatch(addBooking(newBooking));

    Toast.show({
      type: "success",
      text1: "Tillagd i bokningar!",
      text2: `Din bokning hos ${stylist.name || "okänd stylist"} är tillagd.`,
    });

    navigation.navigate("Bookings");
  };

  return (
    <View style={styles.container}>
      {/* Tillbaka-knapp */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="chevron-left" size={30} color="#000" />
      </TouchableOpacity>

      {/* Ikon för framgång */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="check-circle" size={70} color="#9E38EE" />
      </View>

      {/* Rubrik och undertext */}
      <Text style={styles.heading}>Bokning klar!</Text>
      <Text style={styles.subheading}>
        Vi ses kl {bookingTime} {bookingDate}
      </Text>

      {/* Karta */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/300x150" }}
          style={styles.mapImage}
        />
      </View>

      {/* Knappar */}
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={handleAddToCalendar}
      >
        <Text style={styles.calendarButtonText}>Lägg till i min kalender</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.closeButtonText}>Stäng</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Footer />
      <Toast />
    </View>
  );
}

export default BookingConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  iconContainer: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  subheading: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  mapContainer: {
    width: "90%",
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 30,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  calendarButton: {
    backgroundColor: "#E6D9FC",
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  calendarButtonText: {
    color: "#9E38EE",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#9E38EE",
    padding: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
