import React, { useEffect, useState, useCallback } from "react";
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
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
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
import ExploreSection from "../components/ExploreSection";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

function Home({ navigation }) {
  const dispatch = useDispatch();
  const { filteredList } = useSelector((state) => state.salons);
  const { filteredUsers } = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("forYou");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const loadFavoritesCount = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const favoritesQuery = query(
          collection(db, "favorites"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(favoritesQuery);
        setFavoritesCount(querySnapshot.size);
      } catch (error) {
        console.error("Error loading favorites count:", error);
      }
    };

    loadFavoritesCount();
  }, []);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Platsbehörighet nekades.");
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

  const handleSearch = useCallback(
    async (query) => {
      setSearchQuery(query);
      if (!query.trim()) {
        dispatch(setFilteredSalons([]));
        dispatch(setUsers([]));
        return;
      }

      setLoading(true);
      try {
        const searchOptions = {
          ...(userLocation
            ? {
                aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
                aroundRadius: 20000,
              }
            : {}),
        };

        const { salongerResults, usersResults, currentTime, error } =
          await algoliaSearch.search(query, searchOptions);

        dispatch(setFilteredSalons(salongerResults));
        dispatch(setUsers(usersResults));
      } catch (error) {
        console.error("Sökning misslyckades:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, userLocation]
  );

  const handleFilter = useCallback(
    (filterType) => {
      setCurrentFilter(filterType);
      if (filterType === "forYou") {
        dispatch(resetFilter());
        dispatch(resetUsers());
      } else {
        dispatch(filterSalons(filterType));
        dispatch(filterUsers(filterType));
      }
    },
    [dispatch]
  );

  const ListHeaderComponent = useCallback(() => {
    if (loading) {
      return <Text style={styles.loadingText}>Laddar resultat...</Text>;
    }

    if (!searchQuery.trim()) {
      return <ExploreSection navigation={navigation} />;
    }

    return null;
  }, [loading, searchQuery, navigation]);

  const renderItem = useCallback(() => {
    if (!searchQuery.trim() || loading) return null;

    if (
      (!filteredList || filteredList.length === 0) &&
      (!filteredUsers || filteredUsers.length === 0)
    ) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Inga resultat hittades</Text>
        </View>
      );
    }

    return (
      <View>
        {filteredList?.length > 0 && (
          <View>
            <Text style={styles.resultHeader}>Frisörer</Text>
            <SalonList data={filteredList} navigation={navigation} />
          </View>
        )}
        {filteredUsers?.length > 0 && (
          <View>
            <Text style={styles.resultHeader}>Användare</Text>
            <UserList data={filteredUsers} navigation={navigation} />
          </View>
        )}
      </View>
    );
  }, [searchQuery, loading, filteredList, filteredUsers, navigation]);

  return (
    <LinearGradient
      colors={["#FFFFFF", "#AF43F2", "#000000"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 5 }}
      style={styles.container}
    >
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Vad söker du idag?"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => console.log("Microphone pressed")}>
          <MaterialIcons
            name="mic"
            size={24}
            color="#9E38EE"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[{ key: "content" }]}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={<View style={{ height: 150 }} />}
        keyExtractor={(item) => item.key}
        style={styles.resultSection}
        scrollEnabled={true}
        removeClippedSubviews={true}
      />

      <Footer favoritesCount={favoritesCount} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 100,
    marginHorizontal: 18,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  icon: {
    marginLeft: 10,
  },
  resultSection: {
    flex: 1,
  },
  resultHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 20,
    marginBottom: 20,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
});

export default Home;
