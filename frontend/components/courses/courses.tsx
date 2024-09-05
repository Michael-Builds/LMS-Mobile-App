import React, { useEffect, useState } from "react"
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useFonts } from "expo-font"
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito"
import { router } from "expo-router"
import CourseCard from "./card"
import { courseApi } from "../urls/Instances"
import Loader from "../loaders/loader"

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
  })

  // Fetch courses from the API
  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseApi.get("/get-courses")
      setCourses(response.data.courses)
      setError(null)
    } catch (error: any) {
      setError("Failed to fetch courses")
      console.error("Failed to fetch courses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Courses</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/courses")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loader />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={courses}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <CourseCard item={item} />}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: -2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#1571ba",
    fontFamily: "Nunito_600SemiBold",
  },
  flatListContent: {
    paddingVertical: 10,
  },
})
