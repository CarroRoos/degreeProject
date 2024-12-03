import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const UserList = ({ data, navigation }) => {
  const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

  const renderUser = ({ item }) => (
    <TouchableOpacity
      key={item.uid}
      style={styles.userCard}
      onPress={() => navigation.navigate("UserProfile", { userId: item.uid })}
    >
      <View style={styles.cardContent}>
        <Image
          source={{ uri: item.photoURL || defaultAvatar }}
          style={styles.profileImage}
        />
        <View style={styles.textContent}>
          <Text style={styles.userName}>{item.displayName}</Text>
          <Text style={styles.location}>Malmö</Text>
          <Text style={styles.categories}>Hår, naglar, massage, pedikyr</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderUser}
      keyExtractor={(item) => item.uid || item.objectID}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
    padding: 15,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 15,
  },
  textContent: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  categories: {
    fontSize: 12,
    color: "#888",
  },
});

export default UserList;
