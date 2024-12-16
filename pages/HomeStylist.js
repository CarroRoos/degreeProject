import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import FooterStylist from "../components/FooterStylist";

const getPlaceholderImage = (name) => {
  return {
    uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`,
  };
};

const BookingCard = ({ name, service, time }) => (
  <View style={styles.bookingCard}>
    <Image source={getPlaceholderImage(name)} style={styles.bookingImage} />
    <View style={styles.bookingInfo}>
      <Text style={styles.bookingName}>{name}</Text>
      <Text style={styles.bookingService}>{service}</Text>
      <Text style={styles.bookingTime}>{time}</Text>
    </View>
    <TouchableOpacity style={styles.messageButton}>
      <Ionicons name="chatbubble-outline" size={24} color="#666" />
    </TouchableOpacity>
  </View>
);

const ServiceCard = ({
  rating,
  isFavorite,
  title,
  time,
  distance,
  price,
  stylist,
}) => (
  <View style={styles.serviceCard}>
    <Image source={getPlaceholderImage(stylist)} style={styles.serviceImage} />
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingText}>⭐ {rating}</Text>
      {isFavorite && <Icon name="shopping" size={16} color="#9747FF" />}
    </View>
    <View style={styles.serviceInfo}>
      <Text style={styles.serviceTitle}>{title}</Text>
      <View style={styles.serviceDetails}>
        <Text style={styles.serviceTime}>Kl. {time}</Text>
        <Text style={styles.serviceDistance}>{distance}m</Text>
        <Text style={styles.servicePrice}>{price}kr</Text>
      </View>
      <Text style={styles.stylistName}>{stylist}</Text>
    </View>
  </View>
);

const MarketplaceCard = ({ title, distance, price, seller }) => (
  <View style={styles.marketplaceCard}>
    <View style={styles.marketplaceInfo}>
      <Text style={styles.marketplaceTitle}>{title}</Text>
      <View style={styles.marketplaceDetails}>
        <Text style={styles.marketplaceDistance}>{distance}m</Text>
        <Text style={styles.marketplacePrice}>{price}kr</Text>
      </View>
      <Text style={styles.marketplaceSeller}>{seller}</Text>
    </View>
    <Image
      source={{ uri: "https://via.placeholder.com/100" }}
      style={styles.marketplaceImage}
    />
  </View>
);

const HomeStylist = () => {
  const upcomingBookings = [
    {
      id: 1,
      name: "Frida Nord",
      service: "Klippning",
      time: "14:30 - 15:45",
    },
    {
      id: 2,
      name: "Sanna Nilsson",
      service: "Slingor",
      time: "15:45 - 18:00",
    },
  ];

  const tomorrowBookings = [
    {
      id: 3,
      name: "Alissa Alm",
      service: "Klippning",
      time: "09:00 - 10:00",
    },
  ];

  const potentialCustomers = [
    {
      id: 1,
      rating: "5.0",
      isFavorite: true,
      title: "Klippning",
      time: "13.30-15.50",
      distance: "300",
      price: "1200",
      stylist: "Samira - Björn Axén",
    },
    {
      id: 2,
      rating: "4.8",
      isFavorite: true,
      title: "Klippning & Styling",
      time: "14.45",
      distance: "150",
      price: "900",
      stylist: "Elin - STHLM BEAUTY",
    },
    {
      id: 3,
      rating: "5.0",
      isFavorite: true,
      title: "Klippning & Balayage",
      time: "16.00",
      distance: "300",
      price: "3200",
      stylist: "Filip - Björn Axén",
    },
  ];

  return (
    <LinearGradient
      colors={["#FFFFFF", "#AF43F2", "#000000"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 5 }}
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.welcomeText}>Välkommen tillbaka!</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nästa bokningar</Text>
          {upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} {...booking} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imorgon:</Text>
          {tomorrowBookings.map((booking) => (
            <BookingCard key={booking.id} {...booking} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Potentiella kunder nära dig</Text>
          {potentialCustomers.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketplace</Text>
          <MarketplaceCard
            title="Dyson hårfön med tillbehör"
            distance="100"
            price="2 000"
            seller="Sofi - Salong Vita - Hämtas på salongen"
          />
        </View>
      </ScrollView>

      <FooterStylist />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 20,
    paddingTop: 150,
    paddingBottom: 80,
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    color: "#000",
  },
  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 15,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookingService: {
    fontSize: 14,
    color: "#666",
  },
  bookingTime: {
    fontSize: 14,
    color: "#666",
  },
  messageButton: {
    padding: 10,
  },
  serviceCard: {
    backgroundColor: "white",
    margin: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: "100%",
    height: 200,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 15,
  },
  ratingText: {
    marginRight: 5,
    fontSize: 12,
  },
  serviceInfo: {
    padding: 15,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  serviceTime: {
    fontSize: 14,
    color: "#666",
  },
  serviceDistance: {
    fontSize: 14,
    color: "#666",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  stylistName: {
    fontSize: 14,
    color: "#666",
  },
  marketplaceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    margin: 10,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  marketplaceInfo: {
    flex: 1,
  },
  marketplaceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  marketplaceDetails: {
    flexDirection: "row",
    marginBottom: 5,
  },
  marketplaceDistance: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  marketplacePrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  marketplaceSeller: {
    fontSize: 14,
    color: "#666",
  },
  marketplaceImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default HomeStylist;
