import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import algoliaSearch from "../AlgoliaSearchService";

function ExploreSection({ navigation }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Platsbehörighet nekades");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Kunde inte hämta plats:", error);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!userLocation) return;

      try {
        setLoading(true);

        const now = new Date();
        const currentHour = now.getHours();

        const searchOptions = {
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          aroundRadius: 20000,
          filters: `time >= ${currentHour}`,
          hitsPerPage: 2,
        };

        const response = await algoliaSearch.search("", searchOptions);

        if (response.salongerResults && response.salongerResults.length > 0) {
          const formattedTimes = response.salongerResults.map((salon) => ({
            id: salon.objectID,
            salon: salon.salon,
            treatment: salon.treatment,
            stylist: salon.stylist,
            price: salon.price,
            time: salon.time,
            image: salon.image,
            ratings: salon.ratings || "5.0",
            isEco: true,
            distance: salon.distance || "",
          }));

          setAvailableTimes(formattedTimes);
        }
      } catch (error) {
        console.error("Fel vid hämtning av data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [userLocation]);

  const handleCardPress = (item) => {
    if (!navigation) {
      console.error("Navigation is undefined");
      return;
    }

    const formattedTime = item.time.toString().padStart(2, "0");

    navigation.navigate("StylistProfile", {
      stylist: {
        id: item.id,
        name: item.stylist,
        salon: item.salon,
        ratings: item.ratings,
        image: item.image,
        price: item.price,
        time: formattedTime,
        treatment: item.treatment,
        distance: item.distance,
      },
    });
  };

  const renderTimeCard = (item) => {
    const formattedTime = item.time.toString().padStart(2, "0");

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.timeCard}
        onPress={() => handleCardPress(item)}
        activeOpacity={0.7}
      >
        <Image
          source={
            item.image
              ? { uri: item.image }
              : require("../assets/images/style1.png")
          }
          style={styles.stylistImage}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.salonText}>{item.stylist}</Text>
            <View>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.ratings}</Text>
                <MaterialIcons name="verified" size={16} color="#9E38EE" />
              </View>
              {item.isEco && (
                <View style={[styles.ratingContainer, { marginTop: 4 }]}>
                  <MaterialIcons name="eco" size={16} color="#26A570" />
                </View>
              )}
            </View>
          </View>
          <Text style={styles.treatmentText}>{item.treatment}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.timeText}>Kl. {formattedTime}:00</Text>
            <Text style={styles.priceText}>{item.price} kr</Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.stylistText}>{item.salon}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Letar efter lediga tider...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Närmaste lediga tider</Text>
      <View style={styles.availableTimesContainer}>
        {availableTimes.length > 0 ? (
          availableTimes.map(renderTimeCard)
        ) : (
          <Text style={styles.noTimesText}>Inga frisörer hittades</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  availableTimesContainer: {
    marginBottom: 16,
  },
  timeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    flexDirection: "row",
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
    marginRight: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  salonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 0,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    marginRight: 2,
    fontWeight: "600",
    fontSize: 12,
  },
  treatmentText: {
    fontSize: 14,
    color: "#444",
    marginTop: -20,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  timeText: {
    color: "#666",
    fontSize: 13,
  },
  priceText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stylistText: {
    color: "#666",
    fontSize: 13,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
  noTimesText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
});

export default ExploreSection;
