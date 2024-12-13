import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function ExploreSection() {
  const availableTimes = [
    {
      service: "Klippning",
      time: "Kl. 14.30",
      distance: "300m",
      price: "1200kr",
      stylist: "Samira - Björn Axén",
      rating: 5.0,
      image: require("../assets/images/style1.png"),
    },
    {
      service: "Klippning & Styling",
      time: "Kl. 14.45",
      distance: "150m",
      price: "900kr",
      stylist: "Elin - STHLM BEAUTY",
      rating: 4.8,
      image: require("../assets/images/style2.png"),
    },
    {
      service: "Klippning & Balayage",
      time: "Kl. 16.00",
      distance: "300m",
      price: "3200kr",
      stylist: "Filip - Björn Axén",
      rating: 5.0,
      image: require("../assets/images/style3.png"),
    },
  ];

  const sections = [
    {
      title: "Frisörer nära dig",
      subtitle: "Utforska frisörer i ditt område",
      images: [
        require("../assets/images/style1.png"),
        require("../assets/images/style2.png"),
        require("../assets/images/style3.png"),
        require("../assets/images/jennifer.jpg"),
      ],
    },
    {
      title: "Bokningstider för dig",
      subtitle: "Hitta lediga tider som passar dig",
      images: [
        require("../assets/images/book7.png"),
        require("../assets/images/book7.png"),
        require("../assets/images/book7.png"),
        require("../assets/images/book7.png"),
      ],
    },
    {
      title: "Andra användare",
      subtitle: "Se vad andra användare bokar",
      images: [
        require("../assets/images/profile1.png"),
        require("../assets/images/profile2.png"),
        require("../assets/images/profile3.png"),
        require("../assets/images/profile4.png"),
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Lediga tider nära mig</Text>
      <View style={styles.availableTimesContainer}>
        {availableTimes.map((item, index) => (
          <View key={index} style={styles.timeCard}>
            <Image source={item.image} style={styles.stylistImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.serviceText}>{item.service}</Text>
                <View>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{item.rating}</Text>
                    <MaterialIcons name="verified" size={16} color="#9E38EE" />
                  </View>
                  <View style={[styles.ratingContainer, { marginTop: 4 }]}>
                    <MaterialIcons name="eco" size={16} color="#26A570" />
                  </View>
                </View>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.timeText}>{item.time}</Text>
                <Text style={styles.distanceText}>{item.distance}</Text>
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
              <Text style={styles.stylistText}>{item.stylist}</Text>
            </View>
          </View>
        ))}
      </View>

      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
          <ScrollView horizontal>
            {section.images.map((image, imageIndex) => (
              <Image key={imageIndex} source={image} style={styles.image} />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  availableTimesContainer: {
    marginBottom: 24,
  },
  timeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stylistImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginRight: 4,
    fontWeight: "600",
  },
  serviceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  timeText: {
    color: "#666",
    fontSize: 14,
  },
  distanceText: {
    color: "#666",
    fontSize: 14,
  },
  priceText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
  stylistText: {
    color: "#666",
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default ExploreSection;
