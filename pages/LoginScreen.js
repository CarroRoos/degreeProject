import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../slices/userSlice";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Fel", "Vänligen fyll i både email och lösenord");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) {
        throw new Error("Användarprofil hittades inte");
      }

      const userData = userDoc.data();

      dispatch(setCurrentUser(userCredential.user.uid));

      setTimeout(() => {
        navigation.navigate(
          userData.accountType === "stylist" ? "HomeStylist" : "Home"
        );
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Ett fel inträffade vid inloggning";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Ogiltig e-postadress";
          break;
        case "auth/user-disabled":
          errorMessage = "Detta konto har inaktiverats";
          break;
        case "auth/user-not-found":
          errorMessage = "Ingen användare hittades med denna e-postadress";
          break;
        case "auth/wrong-password":
          errorMessage = "Felaktigt lösenord";
          break;
        case "auth/too-many-requests":
          errorMessage = "För många försök. Vänligen försök igen senare";
          break;
      }

      Alert.alert("Inloggningsfel", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#AF43F2", "#000000"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientBackground}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Hej! ✄</Text>
            <Text style={styles.subtitle}>Logga in på ditt konto</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="E-postadress"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Lösenord"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Loggar in..." : "Logga in"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.altButton}
              onPress={() => navigation.navigate("CreateAccount")}
            >
              <Text style={styles.altButtonText}>Skapa konto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    marginTop: 100,
  },
  subtitle: {
    fontSize: 18,
    color: "#000",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#9E38EE",
    fontSize: 18,
    fontWeight: "bold",
  },
  altButton: {
    alignItems: "center",
  },
  altButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
