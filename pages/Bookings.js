import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import Footer from "../components/Footer";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { removeBookingFromFirebase } from "../slices/bookingsSlice";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadBookings(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadBookings = async (userId) => {
    if (!userId) return;

    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(bookingsQuery);
      const fetchedBookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(fetchedBookings);
      console.log("Laddade bokningar:", fetchedBookings);
    } catch (error) {
      console.error("Fel vid laddning av bokningar:", error);
    }
  };

  const formatTime = (time) => {
    if (!time) return "00:00";
    const timeStr = time.toString();

    if (timeStr.includes(":")) return timeStr;

    const hours = timeStr.substring(0, 2);
    const minutes = timeStr.substring(2, 4);
    return `${hours}:${minutes}`;
  };

  const handleRemoveBooking = async (bookingId) => {
    console.log("Försöker ta bort bokning med ID:", bookingId);

    if (!bookingId) {
      console.error("Ogiltigt bookingId:", bookingId);
      Toast.show({
        type: "error",
        text1: "Fel",
        text2: "Boknings-ID saknas eller är ogiltigt.",
      });
      return;
    }

    try {
      await dispatch(removeBookingFromFirebase(bookingId));
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );

      Toast.show({
        type: "success",
        text1: "Bokning borttagen",
        text2: "Din bokning har tagits bort.",
      });
    } catch (error) {
      console.error("Fel vid borttagning av bokning:", error);
      Toast.show({
        type: "error",
        text1: "Kunde inte ta bort bokningen",
        text2: "Ett oväntat fel inträffade. Försök igen.",
      });
    }
  };

  const renderBookingCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.stylist}</Text>
          <Text style={styles.salonInfo}>hos {item.salon}</Text>
          <View style={styles.bookingDetails}>
            <Text style={styles.timePrice}>
              Kl: {formatTime(item.time)} • {item.price} kr
            </Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveBooking(item.id)}
          >
            <Text style={styles.removeButtonText}>Ta bort</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerTop}></View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bokningar ({bookings.length})</Text>
        </View>
      </View>

      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBookingCard}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Inga bokningar ännu 💜</Text>
        </View>
      )}

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
  headerTop: {
    backgroundColor: "#9E38EE",
    height: 70,
  },
  header: {
    backgroundColor: "#9E38EE",
    paddingBottom: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    padding: 0,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
  salonInfo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "left",
  },
  bookingDetails: {
    marginTop: 5,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  timePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: "#CA95FF",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#999",
  },
});

export default Bookings;
