import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import algoliaSearch from "../AlgoliaSearchService";

function ExploreSection({ navigation }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarUsers, setSimilarUsers] = useState([]);

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

      if (availableTimes.length > 0) {
        setLoading(false);
        return;
      }

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

        if (response.usersResults && response.usersResults.length > 0) {
          const formattedUsers = response.usersResults
            .slice(0, 4)
            .map((user) => ({
              id: user.objectID,
              displayName: user.displayName,
              photoURL: user.photoURL,
              location: user.location,
              email: user.email,
              uid: user.uid,
              categories: user.categories || [],
            }));
          setSimilarUsers(formattedUsers);
        }
      } catch (error) {
        console.error("Fel vid hämtning av data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [userLocation, availableTimes.length]);

  const formatTime = (time) => {
    if (!time) return "00:00";
    const timeStr = time.toString();
    const hours = timeStr.substring(0, 2);
    const minutes = timeStr.substring(2, 4);
    return `${hours}:${minutes}`;
  };

  const handleCardPress = (item) => {
    if (!navigation) {
      console.error("Navigation is undefined");
      return;
    }

    navigation.navigate("StylistProfile", {
      stylist: {
        id: item.id,
        name: item.stylist,
        salon: item.salon,
        ratings: item.ratings,
        image: item.image,
        price: item.price,
        time: formatTime(item.time),
        treatment: item.treatment,
        distance: item.distance,
      },
    });
  };

  const renderTimeCard = (item) => {
    const handleBookPress = (event) => {
      event.stopPropagation();
      navigation.navigate("StylistProfile", {
        stylist: {
          id: item.id,
          name: item.stylist,
          salon: item.salon,
          ratings: item.ratings || "5.0",
          image: item.image,
          price: item.price || "N/A",
          time: formatTime(item.time),
          treatment: item.treatment || "Okänd behandling",
          distance: item.distance || "0",
        },
      });
    };

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.timeCard}
        onPress={() => handleCardPress(item)}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.stylistImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialIcons name="person" size={24} color="#888" />
            </View>
          )}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{item.ratings}</Text>
            <MaterialIcons name="verified" size={14} color="#9E38EE" />
          </View>
          {item.isEco && (
            <View style={styles.ecoContainer}>
              <MaterialIcons name="eco" size={16} color="#26A570" />
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.salonText}>{item.stylist}</Text>
          <Text style={styles.treatmentText}>{item.treatment}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.timeText}>Kl. {formatTime(item.time)}</Text>
            <View style={styles.rightAlignedContainer}>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={handleBookPress}
              >
                <Text style={styles.bookButtonText}>Boka</Text>
              </TouchableOpacity>
              <Text style={styles.priceText}>{item.price} kr</Text>
            </View>
          </View>
          <Text style={styles.stylistText}>{item.salon}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUserSection = () => {
    if (similarUsers.length === 0) return null;

    return (
      <View style={styles.userSection}>
        <Text style={styles.sectionTitle}>Användare med liknande intresse</Text>
        <View style={styles.userList}>
          {similarUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() =>
                navigation.navigate("UserProfile", { userId: user.id })
              }
            >
              {user.photoURL && user.photoURL.trim() !== "" ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.userImage}
                />
              ) : (
                <View style={styles.emptyImageCircle} />
              )}
              <Text style={styles.userName}>{user.displayName}</Text>
              {user.location && (
                <Text style={styles.userLocation}>{user.location}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
      {renderUserSection()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mainTitle: {
    fontSize: 16,
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
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 12,
    alignItems: "center",
  },
  stylistImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  ratingText: {
    marginRight: 2,
    fontWeight: "600",
    fontSize: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  salonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  treatmentText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightAlignedContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: 8,
  },
  detailsColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 8,
  },
  timeText: {
    color: "#666",
    fontSize: 13,
    marginRight: 8,
  },
  ecoContainer: {
    marginRight: 8,
  },
  priceText: {
    marginTop: 4,
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
    marginTop: 20,
  },
  userSection: {
    marginTop: 16,
  },
  userList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  userCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  userLocation: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: "#9E38EE",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: -20,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  emptyImageCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
  },
});

export default ExploreSection;
