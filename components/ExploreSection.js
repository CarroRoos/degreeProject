import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

function ExploreSection() {
  const sections = [
    {
      title: "Frisörer nära dig",
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
    {
      title: "Bokningstider för dig",
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
    {
      title: "Andra användare i ditt område",
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <ScrollView horizontal>
            {section.images.map((imageUrl, imageIndex) => (
              <Image
                key={imageIndex}
                source={{ uri: imageUrl }}
                style={styles.image}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
});

export default ExploreSection;
