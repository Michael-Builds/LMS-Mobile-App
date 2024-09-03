import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { Image } from "react-native"

export default function ReviewCard({
  reviewsData,
}: {
  reviewsData: ReviewType
}) {
  const avatarUrl = reviewsData.user?.avatar

  return (
    <View style={{ flexDirection: "row" }}>
      <Image
        style={{ width: 50, height: 50, borderRadius: 100 }}
        source={{
          uri: avatarUrl || require("@/assets/images/avatar.webp"),
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({})
