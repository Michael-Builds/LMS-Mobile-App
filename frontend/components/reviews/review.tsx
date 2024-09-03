import {
  Nunito_400Regular,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito"
import { useFonts } from "expo-font"
import React from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import Ratings from "../courses/ratings"

export default function ReviewCard({
  reviewsData,
}: {
  reviewsData: ReviewType
}) {
  const avatarUrl = reviewsData.user?.avatar?.url
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
  })
  if (!fontsLoaded && !fontError) {
    return null
  }
  return (
    <View style={{ flexDirection: "row" }}>
      <Image
        style={{ width: 50, height: 50, borderRadius: 100 }}
        source={
          avatarUrl && avatarUrl.trim() !== ""
            ? { uri: avatarUrl }
            : require("@/assets/images/avatar.webp")
        }
      />
      <View style={{ marginHorizontal: 8, flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Nunito_600SemiBold",
                  marginRight: 8,
                }}
              >
                {reviewsData.user?.fullname}
              </Text>
              <View style={{ marginVertical: 3 }}>
                <Ratings rating={reviewsData.rating} />
              </View>
              <Text
                style={{
                  fontFamily: "Nunito_400Regular",
                }}
              >
                {reviewsData.comment}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})
