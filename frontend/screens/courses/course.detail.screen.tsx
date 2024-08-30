import React, { useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native"
import { useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_500Medium,
} from "@expo-google-fonts/nunito"
import CourseLesson from "@/components/courses/course.lesson"

export default function CourseDetailScreen() {
  const [activeButton, setActiveButton] = useState("About")
  const [isExpanded, setIsExpanded] = useState(false)

  const { item } = useLocalSearchParams()

  const courseData: CoursesType = JSON.parse(item as any)

  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_500Medium,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  const renderButton = (label: string) => {
    const isActive = activeButton === label
    return (
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isActive ? "#1571ba" : "transparent",
            borderRadius: isActive ? 50 : 0,
          },
        ]}
        onPress={() => setActiveButton(label)}
      >
        <Text
          style={[styles.buttonText, { color: isActive ? "#ffffff" : "#000" }]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 25 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: 16 }}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Best Seller</Text>
          </View>
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <FontAwesome name="star" size={14} color={"#FFB800"} />
              <Text style={styles.ratingText}>{courseData.ratings}</Text>
            </View>
          </View>
          <Image
            source={{ uri: courseData.thumbnail.url }}
            style={styles.thumbnail}
          />
        </View>

        <Text style={styles.courseTitle}>{courseData.name}</Text>

        <View style={styles.priceContainer}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceText}>${courseData.price}</Text>
            <Text style={styles.estimatedPriceText}>
              ${courseData.estimatedPrice}
            </Text>
          </View>
          <Text style={styles.studentCount}>
            {courseData.purchased} students
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Prerequisites</Text>
            {courseData.prerequisites.map(
              (item: PrerequisitesType, index: number) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="checkmark-done-outline" size={15} />
                  <Text style={styles.listItemText}>{item.title}</Text>
                </View>
              )
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Benefits</Text>
            {courseData.benefits.map((item: BenefitType, index: number) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="checkmark-done-outline" size={15} />
                <Text style={styles.listItemText}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {renderButton("About")}
          {renderButton("Lessons")}
          {renderButton("Reviews")}
        </View>
        {activeButton === "About" && (
          <View
            style={{
              marginHorizontal: 16,
              marginVertical: 25,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 500,
                fontFamily: "Nunito_600SemiBold",
              }}
            >
              About Course
            </Text>
            <Text
              style={{
                color: "#525258",
                fontSize: 16,
                marginTop: 10,
                textAlign: "justify",
                fontFamily: "Nunito_500Medium",
              }}
            >
              {isExpanded
                ? courseData.description
                : courseData.description.slice(0, 302)}
            </Text>
            {courseData.description.length > 302 && (
              <TouchableOpacity
                style={{ marginTop: 3 }}
                onPress={() => setIsExpanded(!isExpanded)}
              >
                <Text
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center",
                    color: "#2467EC",
                    fontSize: 14,
                  }}
                >
                  {isExpanded ? "Show More" : "Show Less"}
                  {isExpanded ? "-" : "+"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {activeButton === "Lessons" && (
          <View
            style={{
              marginHorizontal: 16,
              marginVertical: 25,
            }}
          >
            <CourseLesson courseDetails={courseData} />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#FFB013",
    borderRadius: 54,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    marginLeft: 8,
  },

  badgeText: {
    color: "black",
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
  },
  ratingContainer: {
    position: "absolute",
    zIndex: 4,
    right: 0,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141517",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 8,
  },
  ratingText: {
    color: "white",
    marginLeft: 8,
    fontFamily: "Nunito_400Regular",
  },
  thumbnail: {
    width: "100%",
    height: 230,
    borderRadius: 6,
  },
  courseTitle: {
    marginHorizontal: 16,
    marginTop: 15,
    fontSize: 20,
    fontFamily: "Nunito_600SemiBold",
    fontWeight: "700",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
    paddingTop: 5,
  },
  priceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 15,
    fontFamily: "Nunito_400Regular",
    paddingVertical: 5,
  },
  estimatedPriceText: {
    color: "#808080",
    fontSize: 14,
    marginLeft: 15,
    fontFamily: "Nunito_400Regular",
    textDecorationLine: "line-through",
  },
  studentCount: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
  },
  sectionContainer: {
    flexDirection: "column",
  },
  section: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    fontWeight: "600",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    gap: 6,
    marginTop: 5,
  },
  listItemText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    marginHorizontal: 16,
    backgroundColor: "#E1E9F8",
    borderRadius: 50,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 42,
  },
  buttonText: {
    fontFamily: "Nunito_600SemiBold",
  },
})
