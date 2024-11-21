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
import { removeFavorite } from "../slices/salonSlice";

function Favorites() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.salons.favorites || []);

  const renderFavoriteCard = ({ item }) => (
    <View style={styles.card}>
      {/* Bild */}
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        {/* Information */}
        <Text style={styles.name}>{item.treatment}</Text>
        <Text style={styles.info}>
          ⭐ {item.ratings} • {item.reviews} recensioner • {item.distance}
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Se lediga tider</Text>
        </TouchableOpacity>
        {/* Ta bort-knapp */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => dispatch(removeFavorite(item.id))}
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
          <Text style={styles.headerTitle}>Favoriter ({favorites.length})</Text>
        </View>
      </View>

      {/* Lista */}
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavoriteCard}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Inga favoriter ännu 💜</Text>
        </View>
      )}

      {/* Footer */}
      <Footer favoritesCount={favorites.length} />
    </View>
  );
}

export default Favorites;

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
});
