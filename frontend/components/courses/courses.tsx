import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useRef, useState } from "react"
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito"
import { useFonts } from "expo-font"
import { router } from "expo-router"
import axios from "axios"
import { course } from "@/utils/Endpoints"
import CourseCard from "./card"
export default function Courses() {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }
  const [courses, setCourse] = useState<CoursesType[]>([])
  const [loading, seLoading] = useState(true)
  const flatListRef = useRef(null)

  useEffect(() => {
    axios
      .get(`${course}/get-courses`)
      .then((res: any) => {
        setCourse(res.data.courses)
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
  return (
    <View style={{ flex: 1, marginHorizontal: 16, marginTop: -2 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontFamily: "Nunito_400Regular" }}>Popular Courses</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/courses")}>
          <Text
            style={{
              fontSize: 14,
              color: "#1571ba",
              fontFamily: "Nunito_600SemiBold",
            }}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={courses}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <CourseCard item={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({})
