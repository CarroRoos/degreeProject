import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import SalonCard from "./components/SalonCard";

const SalonList = ({ data, navigation }) => {
  const categories = [
    {
      title: "Tidigaste",
      data: [...data].sort((a, b) => a.time.localeCompare(b.time))[0],
    },
    {
      title: "Billigaste",
      data: [...data].sort((a, b) => a.price - b.price)[0],
    },
    {
      title: "Närmaste",
      data: [...data].sort((a, b) => a.distance.localeCompare(b.distance))[0],
    },
  ];

  const handleBooking = (salon) => {
    navigation.navigate("BookingConfirmation", { salon });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{item.title}</Text>
            {item.data ? (
              <>
                <SalonCard salon={item.data} navigation={navigation} />
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBooking(item.data)}
                >
                  <Text style={styles.bookButtonText}>Boka</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.emptyText}>Ingen frisör tillgänglig.</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Inga frisörer tillgängliga.</Text>
        }
        // Lägger till extra space efter sista kategorin
        ListFooterComponent={<View style={styles.footerSpace} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  categorySection: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9E38EE",
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
  footerSpace: {
    height: 80,
  },
  bookButton: {
    backgroundColor: "#CA95FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SalonList;
