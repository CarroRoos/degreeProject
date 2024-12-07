import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import {
  filterSalons,
  resetFilter,
  setFilteredSalons,
} from "../slices/salonSlice";
import { setUsers, filterUsers, resetUsers } from "../slices/userSlice";
import SalonList from "../SalonList";
import UserList from "../UserList";
import Footer from "../components/Footer";
import algoliaSearch from "../AlgoliaSearchService";

function Home({ navigation }) {
  const dispatch = useDispatch();
  const { filteredList } = useSelector((state) => state.salons);
  const { filteredUsers } = useSelector((state) => state.users);
  const favorites = useSelector((state) => state.salons.favorites || []);
  const userFavorites = useSelector((state) => state.users.userFavorites || []);
  const totalFavorites = favorites.length + userFavorites.length;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("forYou");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Platsbehörighet nekades.");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log("Användarens plats inställd:", location.coords);
      } catch (error) {
        console.error("Kunde inte hämta plats:", error);
      }
    };

    getUserLocation();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    // Only include location parameters for salon search
    const searchOptions = userLocation
      ? {
          query,
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          aroundRadius: 20000,
        }
      : { query };

    setLoading(true);
    try {
      const { salongerResults, usersResults } = await algoliaSearch.search(
        query,
        searchOptions
      );
      console.log("Resultat från Algolia - Salonger:", salongerResults);
      console.log("Resultat från Algolia - Users:", usersResults);

      dispatch(setFilteredSalons(salongerResults));
      dispatch(setUsers(usersResults));
    } catch (error) {
      console.error("Sökning misslyckades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterType) => {
    setCurrentFilter(filterType);
    if (filterType === "forYou") {
      dispatch(resetFilter());
      dispatch(resetUsers());
    } else {
      dispatch(filterSalons(filterType));
      dispatch(filterUsers(filterType));
    }
  };

  const salonSortOptions = [
    { label: "För dig", value: "forYou" },
    { label: "Stockholm", value: "stockholm" },
    { label: "Klippning", value: "haircut" },
  ];

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.loadingText}>Laddar resultat...</Text>;
    }

    if (!searchQuery.trim()) {
      return <Text style={styles.heartIcon}>💜</Text>;
    }

    return (
      <>
        {filteredList?.length > 0 && (
          <>
            <Text style={styles.resultHeader}>Frisörer</Text>
            <SalonList data={filteredList} navigation={navigation} />
          </>
        )}
        {filteredUsers?.length > 0 && (
          <>
            <Text style={styles.resultHeader}>Användare</Text>
            <UserList data={filteredUsers} navigation={navigation} />
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#AF43F2", "#000000"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.searchSection}>
          <TextInput
            style={styles.input}
            placeholder="Vad söker du idag?"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </LinearGradient>

      {searchQuery.trim() && (
        <View style={styles.sortSection}>
          <View style={styles.sortOptions}>
            {salonSortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleFilter(option.value)}
                style={[
                  styles.sortOption,
                  currentFilter === option.value && styles.activeSortOption,
                ]}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    currentFilter === option.value &&
                      styles.activeSortOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <FlatList
        data={[]}
        ListHeaderComponent={renderContent}
        keyExtractor={(item, index) => index.toString()}
        style={styles.resultSection}
      />

      <Footer favoritesCount={totalFavorites} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradientBackground: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  searchSection: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 5,
    marginTop: 100,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    color: "#000",
  },
  sortSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f4f4f4",
  },
  sortOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sortOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  activeSortOption: {
    backgroundColor: "#9E38EE",
  },
  sortOptionText: {
    fontSize: 14,
    color: "#000",
  },
  activeSortOptionText: {
    color: "#fff",
  },
  resultSection: {
    flex: 1,
    marginBottom: 150,
  },
  resultHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
    backgroundColor: "#F4F4F4",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
  },
  heartIcon: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 50,
  },
});

export default Home;
