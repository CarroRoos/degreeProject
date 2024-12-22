import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { addBookingToFirebase } from "../slices/bookingsSlice";
import { auth } from "../config/firebase";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

const formatTime = (time) => {
  if (!time) return "00:00";
  const timeStr = time.toString();

  if (timeStr.includes(":")) return timeStr;

  const hours = timeStr.substring(0, 2);
  const minutes = timeStr.substring(2, 4);
  return `${hours}:${minutes}`;
};

function BookingConfirmation({ navigation, route }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    stylist = {},
    bookingTime = "00:00",
    bookingDate = "okänt datum",
  } = route.params || {};

  const handleAddToCalendar = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Toast.show({
        type: "error",
        text1: "Du måste vara inloggad för att boka",
      });
      return;
    }

    if (!stylist.name || !bookingTime || !bookingDate) {
      Toast.show({
        type: "error",
        text1: "Fel",
        text2: "Alla bokningsfält måste vara ifyllda.",
      });
      return;
    }

    const newBooking = {
      stylist: stylist.name,
      treatment: stylist.treatment || "Klippning",
      price: stylist.price || "Pris ej angivet",
      ratings: stylist.ratings || "5.0",
      salon: stylist.salon || "Okänd salong",
      time: bookingTime,
      date: bookingDate,
      distance: stylist.distance || "300 m",
      image: stylist.image || "https://via.placeholder.com/300x150",
      userId: currentUser.uid,
    };

    console.log("Försöker lägga till bokning:", newBooking);

    setLoading(true);
    try {
      await dispatch(addBookingToFirebase(newBooking));
      Toast.show({
        type: "success",
        text1: "Tillagd i bokningar!",
        text2: `Din bokning hos ${stylist.name || "okänd stylist"} är tillagd.`,
      });
      navigation.navigate("Bookings");
    } catch (error) {
      console.error("Error saving booking:", error.message);
      Toast.show({
        type: "error",
        text1: "Kunde inte spara bokningen",
        text2: "Försök igen senare.",
      });
    } finally {
      setLoading(false);
    }
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
          Vi ses kl {formatTime(bookingTime)} {bookingDate}
        </Text>

        <Text style={styles.bookingDetails}>
          {stylist.treatment || "Klippning"} - {stylist.price || ""} kr
        </Text>
        <Text style={styles.bookingDetails}>
          {stylist.name} på {stylist.salon}
        </Text>

        <TouchableOpacity
          style={styles.calendarButton}
          onPress={handleAddToCalendar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#9E38EE" />
          ) : (
            <Text style={styles.calendarButtonText}>Lägg till i bokningar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.closeButtonText}>Stäng</Text>
        </TouchableOpacity>
      </ScrollView>

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
    marginTop: 100,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 30,
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
    marginTop: 50,
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

export default BookingConfirmation;
