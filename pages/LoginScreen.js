import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ navigation }) {
  const handleLogin = () => {
    navigation.navigate("Home");
  };

  return (
    <LinearGradient
      colors={["#CE1F93", "#A64EFF", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        {}
        <View>
          <Text style={styles.title}>Hej! ✄</Text>
          <Text style={styles.subtitle}>Logga in på ditt konto</Text>
        </View>

        {}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="E-postadress"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Lösenord"
            secureTextEntry
          />
        </View>

        {}
        <TouchableOpacity>
          <Text style={styles.forgotText}>Glömt mitt lösenord</Text>
        </TouchableOpacity>

        {}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Logga in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.altButton}
            onPress={() => navigation.navigate("CreateAccount")}
          >
            <Text style={styles.altButtonText}>Skapa konto</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    color: "#fff",
    marginBottom: 20,
    marginTop: 100,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
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
  forgotText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    textDecorationLine: "underline",
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
