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

  const renderBookingCard = ({ item }) => (
    <View style={styles.card}>
      {/* Bild */}
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/300x150" }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        {/* Information */}
        <Text style={styles.name}>{item.treatment || "Okänd behandling"}</Text>
        <Text style={styles.info}>
          ⭐ {item.ratings || "0"} • {item.reviews || "0"} recensioner •{" "}
          {item.distance || "okänd plats"}
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Kontakta {item.stylist || "okänd stylist"}
          </Text>
        </TouchableOpacity>
        {/* Ta bort-knapp */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => dispatch(removeBooking(item.id))}
        >
          <Text style={styles.removeButtonText}>Ta bort</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header med två lila sektioner */}
      <View>
        <View style={styles.headerTop}></View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Bokningar ({Array.isArray(bookings) ? bookings.length : 0})
          </Text>
        </View>
      </View>

      {/* Lista */}
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

      {/* Footer */}
      <Footer />
    </View>
  );
}

export default Bookings;

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
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
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
  },
  image: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#9E38EE",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
