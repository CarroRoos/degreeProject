import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

function UserProfile({ route }) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      {/* Profilbild */}
      <Image source={{ uri: user.image }} style={styles.profileImage} />

      {/* Namn och plats */}
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.info}>Plats: {user.location}</Text>

      {/* Profilfokus */}
      <Text style={styles.info}>Profilfokus: {user.profileFocus}</Text>

      {/* Användarnamn */}
      <Text style={styles.username}>Användarnamn: @{user.username}</Text>
    </View>
  );
}

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#9E38EE",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  username: {
    fontSize: 16,
    color: "#777",
    marginTop: 10,
    fontStyle: "italic",
  },
});
