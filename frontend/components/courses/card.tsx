import { Nunito_400Regular, Nunito_600SemiBold } from "@expo-google-fonts/nunito";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";

export default function CourseCard({ item }: { item: CoursesType }) {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleCoursePress = () => {
    router.push({
      pathname: "/(routes)/course-details",
      params: { item: JSON.stringify(item) },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleCoursePress}>
      <View style={styles.content}>
        <Image
          style={styles.thumbnail}
          source={{ uri: item?.thumbnail.url }}
        />
        <Text style={styles.courseName}>{item.name}</Text>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingBox}>
            <FontAwesome name="star" size={14} color="#ffb800" />
            <Text style={styles.ratingText}>{item.ratings}</Text>
          </View>
          <Text style={styles.studentsText}>{item.purchased} Students</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price}</Text>
            {item.estimatedPrice && (
              <Text style={styles.estimatedPrice}>${item.estimatedPrice}</Text>
            )}
          </View>
          <View style={styles.lessonInfo}>
            <Ionicons name="list-outline" size={20} color="#8A8A8A" />
            <Text style={styles.lessonCount}>{item.courseData.length}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: responsiveWidth(70), // Setting a defined width
    marginVertical: 15,
    marginHorizontal: 10, // Adds spacing between cards
    padding: 8,
    overflow: "hidden",
  },
  content: {
    paddingHorizontal: 10,
  },
  thumbnail: {
    width: "100%", // Make the image take full width of the card
    height: 220,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 5,
  },
  courseName: {
    fontSize: 14,
    textAlign: "left",
    marginTop: 10,
    fontFamily: "Nunito_600SemiBold",
    fontWeight: "800",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141517",
    padding: 4,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 28,
  },
  ratingText: {
    color: "white",
    fontSize: 14,
    marginLeft: 3,
    fontFamily: "Nunito_400Regular",
  },
  studentsText: {
    fontFamily: "Nunito_400Regular",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  estimatedPrice: {
    color: "#808080",
    fontSize: 14,
    marginLeft: 12,
    fontFamily: "Nunito_400Regular",
    textDecorationLine: "line-through",
  },
  lessonInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonCount: {
    marginLeft: 5,
    fontFamily: "Nunito_400Regular",
  },
});
