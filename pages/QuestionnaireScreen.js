import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../config/firebase";

export default function QuestionnaireScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({
    visitLength: null,
    hairLength: null,
    hairThickness: null,
    visitFrequency: null,
    interests: [],
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.displayName) {
      setUserName(user.displayName);
    }
  }, []);

  const toggleOption = (category, value) => {
    if (category === "interests") {
      setSelectedOptions((prev) => ({
        ...prev,
        interests: prev.interests.includes(value)
          ? prev.interests.filter((item) => item !== value)
          : [...prev.interests, value],
      }));
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        [category]: prev[category] === value ? null : value,
      }));
    }
  };

  const handleNext = () => {
    navigation.navigate("Home");
  };

  const handleSkip = () => {
    navigation.navigate("Home");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={["#CE1F93", "#A64EFF", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Hej {userName}!</Text>
          <Text style={styles.subtitle}>
            För att visa de bästa behandlingarna för dig, svara på frågorna
            nedan.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hår</Text>

            <Text style={styles.question}>Hur långt besök?</Text>
            <View style={styles.optionsRow}>
              {["30 min", "1 - 2 h", "2 h - mer"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selectedOptions.visitLength === option &&
                      styles.optionSelected,
                  ]}
                  onPress={() => toggleOption("visitLength", option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions.visitLength === option &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.question}>Längd på håret</Text>
            <View style={styles.optionsRow}>
              {["Öron", "Axlar", "Långt"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selectedOptions.hairLength === option &&
                      styles.optionSelected,
                  ]}
                  onPress={() => toggleOption("hairLength", option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions.hairLength === option &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.question}>Hårets tjocklek</Text>
            <View style={styles.optionsRow}>
              {["Tunt", "Mellan", "Tjockt"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selectedOptions.hairThickness === option &&
                      styles.optionSelected,
                  ]}
                  onPress={() => toggleOption("hairThickness", option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions.hairThickness === option &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.question}>Hur ofta?</Text>
            <View style={styles.optionsRow}>
              {["4 - 6 v", "Månader", "År"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selectedOptions.visitFrequency === option &&
                      styles.optionSelected,
                  ]}
                  onPress={() => toggleOption("visitFrequency", option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions.visitFrequency === option &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Vad intresserar dig inom hår</Text>
          <Text style={styles.infoText}>Du kan ändra dina svar senare</Text>
          <View style={styles.optionsGrid}>
            {[
              "Klippning",
              "Babayage",
              "Barberare",
              "Färgning",
              "Toning",
              "Extensions",
              "Slingor",
              "Föning",
            ].map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.option,
                  selectedOptions.interests.includes(interest) &&
                    styles.optionSelected,
                ]}
                onPress={() => toggleOption("interests", interest)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.interests.includes(interest) &&
                      styles.optionTextSelected,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Nästa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Hoppa över</Text>
          </TouchableOpacity>
        </ScrollView>
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
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 160,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  option: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    backgroundColor: "#fff",
  },
  optionSelected: {
    backgroundColor: "#8D29F3",
    borderColor: "#000",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#A64EFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
});
