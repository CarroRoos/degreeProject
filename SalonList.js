import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

const SalonList = ({ data }) => {
  const getImage = (imageName) => {
    try {
      switch (imageName) {
        case "freddie":
          return require("./assets/images/freddie.jpg");
        case "samira":
          return require("./assets/images/samira.jpg");
        case "jennifer":
          return require("./assets/images/jennifer.jpg");
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error loading image for ${imageName}:`, error);
      return null;
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* Visa bild om den finns */}
          {getImage(item.image) && (
            <Image source={getImage(item.image)} style={styles.profileImage} />
          )}
          <View style={styles.info}>
            <Text style={styles.treatment}>{item.treatment}</Text>
            <View style={styles.row}>
              <Text style={styles.time}>Kl. {item.time}</Text>
              <Text style={styles.distance}>{item.distance}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <Text style={styles.stylist}>
              {item.stylist} på {item.salon}
            </Text>
            <Text style={styles.rating}>⭐ {item.ratings}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Börja skriva för att söka.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#F2E7FF",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  treatment: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: "#555",
    marginRight: 10,
  },
  distance: {
    fontSize: 14,
    color: "#555",
    marginRight: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  stylist: {
    fontSize: 14,
    color: "#777",
  },
  rating: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
});

export default SalonList;
