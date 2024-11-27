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
import { filterSalons, resetFilter } from "../slices/salonSlice";
import { setUsers, filterUsers, resetUsers } from "../slices/userSlice";
import SalonList from "../SalonList";
import UserList from "../UserList";
import Footer from "../components/Footer";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../config/firebase";

function Home({ navigation }) {
  const dispatch = useDispatch();
  const { filteredList } = useSelector((state) => state.salons);
  const { filteredUsers } = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("forYou");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = auth.currentUser
          ? query(usersRef, where("email", "!=", auth.currentUser.email))
          : query(usersRef);

        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setUsers(usersData));
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(filterSalons(query));
      dispatch(filterUsers(query));
    } else {
      dispatch(resetFilter());
      dispatch(resetUsers());
    }
  };

  const salonSortOptions = [
    { label: "För dig", value: "forYou" },
    { label: "Stockholm", value: "stockholm" },
    { label: "Klippning", value: "haircut" },
  ];

  const renderContent = () => {
    if (!searchQuery.trim()) {
      return <Text style={styles.heartIcon}>💜</Text>;
    }

    return (
      <>
        <Text style={styles.resultHeader}>Frisörer</Text>
        <SalonList data={filteredList} navigation={navigation} />

        <Text style={styles.resultHeader}>Användare</Text>
        <UserList data={filteredUsers} navigation={navigation} />
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
                onPress={() => setCurrentFilter(option.value)}
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

      <Footer />
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
  heartIcon: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 50,
  },
});

export default Home;
