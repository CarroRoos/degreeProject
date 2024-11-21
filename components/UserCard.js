import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function UserCard({ user }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("UserProfile", { user })}
    >
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.info}>Plats: {user.location}</Text>
      <Text style={styles.info}>Profilfokus: {user.profileFocus}</Text>
      <Text style={styles.info}>Användarnamn: {user.username}</Text>
    </TouchableOpacity>
  );
}

export default UserCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F9F9F9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: "#555",
  },
});
