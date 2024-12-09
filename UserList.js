import React, { useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserFavorite,
  removeUserFavorite,
  loadUserFavorites,
} from "./slices/userSlice";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth } from "./config/firebase";

const UserCard = memo(({ user, onPress, onFavoritePress, isFavorited }) => {
  const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

  return (
    <View style={styles.userCard}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.cardContent}>
          <Image
            source={{ uri: user.photoURL || defaultAvatar }}
            style={styles.profileImage}
          />
          <View style={styles.textContent}>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.location}>
              {user.location || "Plats ej angiven"}
            </Text>
            <Text style={styles.categories}>
              {user.categories?.join(", ") || "Kategorier ej angivna"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onFavoritePress(user)}
          >
            <Icon
              name={isFavorited ? "favorite" : "favorite-border"}
              size={24}
              color={isFavorited ? "#9E38EE" : "#666"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const UserList = ({ data, navigation }) => {
  const dispatch = useDispatch();
  const userFavorites = useSelector((state) => state.users.userFavorites || []);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser && (!userFavorites || userFavorites.length === 0)) {
      dispatch(loadUserFavorites(currentUser.uid));
    }
  }, [dispatch]);

  const isFavorite = useCallback(
    (user) => {
      return userFavorites.some((fav) => fav.uid === user.uid);
    },
    [userFavorites]
  );

  const handleFavoritePress = useCallback(
    async (user) => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "Du måste vara inloggad för att favoritmarkera");
        return;
      }

      try {
        if (isFavorite(user)) {
          await dispatch(
            removeUserFavorite({
              currentUserId: currentUser.uid,
              userId: user.uid,
            })
          ).unwrap();
        } else {
          await dispatch(
            addUserFavorite({
              currentUserId: currentUser.uid,
              favoriteUser: user,
            })
          ).unwrap();
        }
      } catch (error) {
        console.error("Error handling user favorite:", error);
        Alert.alert("Fel", "Kunde inte uppdatera favorit");
      }
    },
    [dispatch, isFavorite]
  );

  const handleUserPress = useCallback(
    (user) => {
      navigation.navigate("UserProfile", { userId: user.uid });
    },
    [navigation]
  );

  const renderUser = useCallback(
    ({ item }) => (
      <UserCard
        user={item}
        onPress={() => handleUserPress(item)}
        onFavoritePress={handleFavoritePress}
        isFavorited={isFavorite(item)}
      />
    ),
    [handleUserPress, handleFavoritePress, isFavorite]
  );

  const keyExtractor = useCallback((item) => {
    if (!item) return `user-${Date.now()}`;
    return item.uid || item.id || item.objectID || `user-${Date.now()}`;
  }, []);

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Inga användare hittades</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderUser}
      keyExtractor={keyExtractor}
      style={styles.list}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      showsVerticalScrollIndicator={false}
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default memo(UserList);
