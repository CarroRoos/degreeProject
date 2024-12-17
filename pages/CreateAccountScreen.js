import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "../config/firebase";

const db = getFirestore();

export default function CreateAccountScreen({ navigation }) {
  const [accountType, setAccountType] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [stylistName, setStylistName] = useState("");
  const [salonName, setSalonName] = useState("");
  const [experience, setExperience] = useState("");
  const [specialties, setSpecialties] = useState("");

  const handleCreateAccount = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Fel", "Vänligen fyll i alla fält");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Fel", "Lösenorden matchar inte!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Fel", "Lösenordet måste vara minst 6 tecken långt");
      return;
    }

    const name = accountType === "user" ? userName : stylistName;
    if (!name.trim()) {
      Alert.alert("Fel", "Vänligen fyll i namn");
      return;
    }

    if (accountType === "stylist" && !salonName.trim()) {
      Alert.alert("Fel", "Vänligen fyll i salongens namn");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;
      await updateProfile(user, {
        displayName: name,
      });

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        photoURL: user.photoURL || "",
        accountType: accountType,
        createdAt: new Date().toISOString(),
      };

      if (accountType === "stylist") {
        Object.assign(userData, {
          salonName: salonName.trim(),
          experience: experience.trim(),
          specialties: specialties.trim(),
        });
      }

      await setDoc(doc(db, "users", user.uid), userData);

      Alert.alert(
        "Välkommen!",
        ` ${name}! 👋 Ditt konto har skapats framgångsrikt.`,
        [
          {
            text: "OK",
            onPress: () => {
              if (accountType === "stylist") {
                navigation.replace("HomeStylist");
              } else {
                navigation.replace("Home");
              }
            },
          },
        ]
      );
    } catch (error) {
      let errorMessage = "Ett fel inträffade vid registrering";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Det finns redan ett konto med denna e-postadress";
          break;
        case "auth/invalid-email":
          errorMessage = "Ogiltig e-postadress";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "E-post/lösenordsregistrering är inte aktiverad";
          break;
        case "auth/weak-password":
          errorMessage = "Lösenordet är för svagt";
          break;
      }

      Alert.alert("Registreringsfel", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAccountTypeSelection = () => (
    <View style={styles.accountTypeContainer}>
      <Text style={styles.title}>Skapa konto</Text>
      <Text style={styles.subtitle}>Hej! Vem är du?</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            accountType === "user" && styles.selectedButton,
          ]}
          onPress={() => setAccountType("user")}
        >
          <Text
            style={[
              styles.typeButtonText,
              accountType === "user" && styles.selectedButtonText,
            ]}
          >
            Användare
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            accountType === "stylist" && styles.selectedButton,
          ]}
          onPress={() => setAccountType("stylist")}
        >
          <Text
            style={[
              styles.typeButtonText,
              accountType === "stylist" && styles.selectedButtonText,
            ]}
          >
            Frisör
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserForm = () => (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ditt namn"
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="words"
        />
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Bekräfta lösenord"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
    </View>
  );

  const renderStylistForm = () => (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ditt namn"
          value={stylistName}
          onChangeText={setStylistName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Salongens namn"
          value={salonName}
          onChangeText={setSalonName}
          autoCapitalize="words"
        />
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
          placeholder="Antal års erfarenhet"
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Specialiteter (t.ex. färgning, klippning)"
          value={specialties}
          onChangeText={setSpecialties}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Bekräfta lösenord"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#FFFFFF", "#AF43F2", "#000000"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientBackground}
    >
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {!accountType ? (
          renderAccountTypeSelection()
        ) : (
          <View>
            <Text style={styles.title}>
              {accountType === "user"
                ? "Skapa användarkonto"
                : "Skapa frisörkonto"}
            </Text>
            {accountType === "user" ? renderUserForm() : renderStylistForm()}
          </View>
        )}

        <View style={styles.buttonContainer}>
          {accountType && (
            <TouchableOpacity
              style={[styles.createButton, isLoading && styles.disabledButton]}
              onPress={handleCreateAccount}
              disabled={isLoading}
            >
              <Text style={styles.createButtonText}>
                {isLoading ? "Skapar konto..." : "Skapa konto!"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>
              Har du redan ett konto? Logga in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  accountTypeContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    marginTop: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#000",
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 25,
  },
  typeButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedButton: {
    backgroundColor: "#9E38EE",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9E38EE",
  },
  selectedButtonText: {
    color: "#fff",
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
    marginVertical: 30,
  },
  createButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  createButtonText: {
    color: "#9E38EE",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginButton: {
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
