import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addUserFavorite, removeUserFavorite } from "./slices/userSlice";
import Icon from "react-native-vector-icons/MaterialIcons";

const UserList = ({ data, navigation }) => {
  const dispatch = useDispatch();
  const userFavorites = useSelector((state) => state.users.userFavorites || []);
  const currentUserId = useSelector((state) => state.users.currentUserId);
  const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

  const handleFavoritePress = (user) => {
    if (userFavorites.some((fav) => fav.uid === user.uid)) {
      dispatch(
        removeUserFavorite({
          currentUserId: currentUserId,
          userId: user.uid,
        })
      );
    } else {
      dispatch(
        addUserFavorite({
          currentUserId: currentUserId,
          favoriteUser: user,
        })
      );
    }
  };

  const renderUser = ({ item }) => {
    const isFavorite = userFavorites.some((fav) => fav.uid === item.uid);

    return (
      <View style={styles.userCard}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserProfile", { userId: item.uid })
          }
        >
          <View style={styles.cardContent}>
            <Image
              source={{ uri: item.photoURL || defaultAvatar }}
              style={styles.profileImage}
            />
            <View style={styles.textContent}>
              <Text style={styles.userName}>{item.displayName}</Text>
              <Text style={styles.location}>
                {item.location || "Plats ej angiven"}
              </Text>
              <Text style={styles.categories}>
                {item.categories?.join(", ") || "Kategorier ej angivna"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleFavoritePress(item)}
            >
              <Icon
                name={isFavorite ? "favorite" : "favorite-border"}
                size={24}
                color={isFavorite ? "#9E38EE" : "#666"}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const getKey = (item) => {
    if (item.uid) return `user-${item.uid}`;
    if (item.id) return `user-${item.id}`;
    if (item.objectID) return `user-${item.objectID}`;
    return `user-${Math.random()}`;
  };

  return (
    <FlatList
      data={data}
      renderItem={renderUser}
      keyExtractor={getKey}
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
  favoriteButton: {
    padding: 8,
  },
});

export default UserList;
