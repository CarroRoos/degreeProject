import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

const UserList = ({ data, navigation }) => {
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() =>
        navigation.navigate("Profile", {
          isUserProfile: true,
          userProfile: item,
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.userImage} />
      <View>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userLocation}>{item.location}</Text>
        <Text style={styles.userCategory}>
          {item.category.includes("all")
            ? "Naglar, hår och massage"
            : item.category.join(", ")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderUserItem}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Inga användare matchar din sökning.
          </Text>
        </View>
      }
    />
  );
};

export default UserList;

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  userCategory: {
    fontSize: 14,
    color: "#9E38EE",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
