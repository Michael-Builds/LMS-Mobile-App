import { StyleSheet, View } from "react-native"
import React from "react"
import { FontAwesome, Ionicons } from "@expo/vector-icons"

export default function Ratings({ rating }: { rating: any }) {
  const stars = []

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <FontAwesome key={i} name="star" size={15} color={"#FF8D07"} />
      )
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <Ionicons
          key={i}
          name="star-half-outline"
          size={15}
          color={"#FF8D07"}
        />
      )
    } else {
      stars.push(
        <Ionicons key={i} name="star-outline" size={15} color={"#FF8D07"} />
      )
    }
  }

  return <View style={styles.starsContainer}>{stars}</View>
}

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: "row",
    marginVertical: 2,
    marginHorizontal: 4,
    gap: 3,
  },
})
