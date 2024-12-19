import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
      stylist: stylist.name,
      treatment: stylist.treatment || "Klippning",
      price: stylist.price || "Pris ej angivet",
      ratings: stylist.ratings || 0,
      salon: stylist.salon || "Okänd salong",
      time: bookingTime,
      date: bookingDate,
      distance: stylist.distance || "300 m",
      image: stylist.image || "https://via.placeholder.com/300x150",
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="chevron-left" size={30} color="#000" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="check-circle"
            size={70}
            color="#9E38EE"
          />
        </View>

        <Text style={styles.heading}>Bokning klar!</Text>
        <Text style={styles.subheading}>
          Vi ses kl {bookingTime} {bookingDate}
        </Text>

        <Text style={styles.bookingDetails}>
          {stylist.treatment || "Klippning"} - {stylist.price || ""}kr
        </Text>
        <Text style={styles.bookingDetails}>
          {stylist.name} på {stylist.salon}
        </Text>

        <View style={styles.mapPlaceholder}>
          <MaterialCommunityIcons
            name="compass-outline"
            size={80}
            color="#aaa"
          />
        </View>

        <TouchableOpacity
          style={styles.calendarButton}
          onPress={handleAddToCalendar}
        >
          <Text style={styles.calendarButtonText}>
            Lägg till i min kalender
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.closeButtonText}>Stäng</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 10,
    zIndex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 120,
    paddingBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
  },
  subheading: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    fontWeight: "bold",
  },
  bookingDetails: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
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
  mapPlaceholder: {
    backgroundColor: "#f5f5f5",
    height: 150,
    width: "80%",
    marginVertical: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default BookingConfirmation;
