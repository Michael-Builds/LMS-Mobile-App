import CourseLesson from "@/components/courses/course.lesson"
import ReviewCard from "@/components/reviews/review"
import { cartApi } from "@/components/urls/Instances"
import useCart from "@/hooks/cart/useCart"
import { cart } from "@/utils/Endpoints"
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import axios from "axios"
import { useFonts } from "expo-font"
import { LinearGradient } from "expo-linear-gradient"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Toast } from "react-native-toast-notifications"

export default function CourseDetailScreen() {
  const [activeSection, setActiveSection] = useState<  "About" | "Lessons" | "Reviews" >("About")
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)
  const { cartItems, addItemToCart } = useCart()
  const { item } = useLocalSearchParams()
  const courseData: CoursesType = JSON.parse(item as string)

  useEffect(() => {
    if (courseData && courseData.purchased) {
      setIsPurchased(true)
    }
  }, [courseData])

  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_500Medium,
  })


  if (!fontsLoaded && !fontError) {
    return null
  }

  const handleAddToCart = async () => {
    const courseExistsInCart = cartItems.some(
      (cartItem) => cartItem.courseId._id === courseData._id
    )

    if (courseExistsInCart) {
      router.push("/(routes)/cart")
      return
    }

    try {
      const message = await addItemToCart(courseData._id)
      Toast.show(message, {
        type: "success",
        animationType: "zoom-in",
      })

      router.push("/(routes)/cart")
    } catch (error) {
      Toast.show("Failed to add to cart", {
        type: "danger",
        animationType: "zoom-in",
      })
    }
  }

  const handleEnrollNow = () => {
    // Logic to enroll directly or navigate to the checkout page
    Toast.show("Enrolling now...", {
      type: "success",
      animationType: "zoom-in",
    })
    router.push("/(routes)/checkout")
  }

  const renderButton = (label: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeSection === label && styles.activeTabButton,
      ]}
      onPress={() => setActiveSection(label as any)}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeSection === label && styles.activeTabButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case "About":
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionHeader}>About Course</Text>
            <Text style={styles.sectionDescription}>
              {isDescriptionExpanded
                ? courseData.description
                : courseData.description.slice(0, 302)}
            </Text>
            {courseData.description.length > 302 && (
              <TouchableOpacity
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <Text style={styles.showMoreText}>
                  {isDescriptionExpanded ? "Show Less -" : "Show More +"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )
      case "Lessons":
        return <CourseLesson courseDetails={courseData} />
      case "Reviews":
        return (
          <View style={styles.reviewsContainer}>
            {courseData.reviews.map((review, index) => (
              <ReviewCard reviewsData={review} key={index} />
            ))}
          </View>
        )
      default:
        return null
    }
  }

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Best Seller</Text>
          </View>
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <FontAwesome name="star" size={14} color="#FFB800" />
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

        <View style={styles.sectionListContainer}>
          <Section
            title="Course Prerequisites"
            items={courseData.prerequisites}
          />
          <Section title="Course Benefits" items={courseData.benefits} />
        </View>

        <View style={styles.tabContainer}>
          {renderButton("About")}
          {renderButton("Lessons")}
          {renderButton("Reviews")}
        </View>

        {renderSectionContent()}
      </ScrollView>

      <View style={styles.footerContainer}>
        {isPurchased ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(routes)/cart")}
            // onPress={() => router.push("/(routes)/course/" + courseData._id)}
          >
            <Text style={styles.actionButtonText}>Go to Course</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAddToCart()}
            >
              <Text style={styles.actionButtonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.enrollButton]}
              onPress={handleEnrollNow}
            >
              <Text style={styles.actionButtonText}>Enroll Now</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </LinearGradient>
  )
}

const Section = ({
  title,
  items,
}: {
  title: string
  items: { title: string }[]
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {items.map((item, index) => (
      <View key={index} style={styles.listItem}>
        <Ionicons name="checkmark-done-outline" size={15} />
        <Text style={styles.listItemText}>{item.title}</Text>
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  headerContainer: {
    marginHorizontal: 16,
  },
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
  sectionListContainer: {
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    marginHorizontal: 16,
    backgroundColor: "#E1E9F8",
    borderRadius: 50,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 42,
  },
  activeTabButton: {
    backgroundColor: "#1571ba",
    borderRadius: 50,
  },
  tabButtonText: {
    fontFamily: "Nunito_600SemiBold",
  },
  activeTabButtonText: {
    color: "#ffffff",
  },
  sectionContent: {
    marginHorizontal: 16,
    marginVertical: 25,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Nunito_600SemiBold",
  },
  sectionDescription: {
    color: "#525258",
    fontSize: 16,
    marginTop: 10,
    textAlign: "justify",
    fontFamily: "Nunito_500Medium",
  },
  showMoreText: {
    marginTop: 3,
    color: "#2467EC",
    fontSize: 14,
  },
  reviewsContainer: {
    marginHorizontal: 16,
    marginVertical: 25,
    rowGap: 25,
  },
  footerContainer: {
    flexDirection: "row", // Align children in a row
    justifyContent: "space-between", // Distribute space between buttons
    backgroundColor: "#FFFFFF",
    marginVertical: 11,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1, // Make the button take equal space
    backgroundColor: "#1571ba",
    paddingVertical: 12,
    borderRadius: 50,
    marginHorizontal: 5, // Space between the buttons
  },
  enrollButton: {
    backgroundColor: "#3c8a3f", // Different color for "Enroll Now"
  },
  disabledButton: {
    backgroundColor: "#808080",
  },
  actionButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
  },
})
