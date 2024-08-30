import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React from "react"
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_500Medium,
} from "@expo-google-fonts/nunito"
import { useFonts } from "expo-font"

export default function CourseLesson({
  courseDetails,
}: {
  courseDetails: CoursesType
}) {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_500Medium,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <View style={{ flex: 1, rowGap: 10 }}>
      <TouchableOpacity
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: "#E1E2E5",
          borderRadius: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        ></View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})
