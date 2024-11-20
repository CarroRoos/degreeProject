import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import SalonCard from "./components/SalonCard";

const SalonList = ({ data, navigation }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <SalonCard salon={item} navigation={navigation} />
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          Börja skriva för att söka behandlingar.
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
});

export default SalonList;
