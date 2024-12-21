import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import Footer from "../components/Footer";
import { removeBooking } from "../slices/bookingsSlice";

function Bookings() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings || []);

  const renderBookingCard = ({ item }) => {
    const formatTime = (time) => {
      if (!time) return "00:00";
      const timeStr = time.toString();

      if (timeStr.includes(":")) return timeStr;

      const hours = timeStr.substring(0, 2);
      const minutes = timeStr.substring(2, 4);
      return `${hours}:${minutes}`;
    };

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
            onPress={() => dispatch(removeBooking(item.id))}
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
          <Text style={styles.headerTitle}>
            Bokningar ({Array.isArray(bookings) ? bookings.length : 0})
          </Text>
        </View>
      </View>

      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          renderItem={renderBookingCard}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Inga bokningar ännu 💜</Text>
        </View>
      )}

      <Footer />
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
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Bookings;
