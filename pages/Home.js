import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { filterSalons, resetFilter } from "../slices/salonSlice";
import SalonList from "../SalonList";
import Footer from "../components/Footer";

function Home({ navigation }) {
  const dispatch = useDispatch();
  const filteredSalons = useSelector((state) => state.salons.filteredList);
  const [currentSection, setCurrentSection] = useState("treatments");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(filterSalons(query));
    } else {
      dispatch(resetFilter());
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentSection("treatments")}
          style={[
            styles.headerTab,
            currentSection === "treatments" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.headerText,
              currentSection === "treatments" && styles.activeHeaderText,
            ]}
          >
            Behandlingar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentSection("users")}
          style={[
            styles.headerTab,
            currentSection === "users" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.headerText,
              currentSection === "users" && styles.activeHeaderText,
            ]}
          >
            Användare
          </Text>
        </TouchableOpacity>
      </View>

      {/* Söksektion */}
      <View style={styles.searchSection}>
        <Text style={styles.searchText}>
          {currentSection === "treatments" ? "Sök behandling" : "Sök användare"}
        </Text>
        <View style={styles.searchInput}>
          <TextInput
            style={styles.input}
            placeholder={
              currentSection === "treatments"
                ? "Vad vill du göra?"
                : "Vem letar du efter?"
            }
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Innehåll */}
      <View style={{ flex: 1 }}>
        {searchQuery.trim() && currentSection === "treatments" && (
          <SalonList data={filteredSalons} navigation={navigation} />
        )}
        {currentSection === "users" && (
          <Text style={{ padding: 20 }}>Användarlistan kommer här...</Text>
        )}
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    paddingTop: 100,
    backgroundColor: "#9E38EE",
  },
  headerTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 0,
    backgroundColor: "#9E38EE",
    marginBottom: -10,
  },
  activeTab: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: "#f4f4f4",
    paddingLeft: 20,
    marginLeft: -10,
    paddingRight: 20,
    marginRight: -50,
    marginLeft: -50,
    paddingLeft: 20,
    paddingVertical: 20,
    marginBottom: -20,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  activeHeaderText: {
    color: "#000",
  },
  searchSection: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  searchText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    color: "#000",
    fontSize: 16,
  },
});
