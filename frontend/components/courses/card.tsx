import {
  Nunito_400Regular,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import { router } from "expo-router"
import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import {
  responsiveWidth
} from "react-native-responsive-dimensions"
import {
  widthPercentageToDP as wp
} from "react-native-responsive-screen"

export default function CourseCard({ item }: { item: CoursesType }) {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/(routes)/course-details",
          params: { item: JSON.stringify(item) },
        })
      }
    >
      <View style={{ paddingHorizontal: 10 }}>
        <Image
          style={{
            width: responsiveWidth(80),
            height: 220,
            borderRadius: 5,
            alignSelf: "center",
            objectFit: "cover",
            marginTop: 5,
          }}
          source={{ uri: item?.thumbnail.url }}
        />
        <View style={{ width: wp(80) }}>
          <Text
            style={{
              fontSize: 14,
              textAlign: "left",
              marginTop: 10,
              fontFamily: "Nunito_600SemiBold",
              fontWeight: 800,
            }}
          >
            {item.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#141517",
              padding: 4,
              borderRadius: 5,
              gap: 4,
              paddingHorizontal: 10,
              height: 28,
              marginTop: 10,
            }}
          >
            <FontAwesome name="star" size={14} color={"#ffb800"} />
            <Text
              style={[styles.ratingText, { fontFamily: "Nunito_400Regular" }]}
            >
              {item.ratings}
            </Text>
          </View>
          <Text style={{ fontFamily: "Nunito_400Regular" }}>
            {item.purchased} Students
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 5,
          }}
        >
          <View style={{ flexDirection: "row", alignItems:"center", paddingVertical:12 }}>
            <Text style={{  fontSize: 16, fontWeight: 600 }}>
              ${item.price}
            </Text>
            <Text
              style={{
                color: "#808080",
                fontSize: 14,
                marginLeft: 12,
                fontFamily: "Nunito_400Regular",
                textDecorationLine: "line-through",
              }}
            >
              ${item.estimatedPrice}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="list-outline" size={20} color={"#8A8A8A"} />
            <Text style={{ marginLeft: 5 }}>{item.courseData.length}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    // marginHorizontal: 1,
    width: "100%",
    height: "auto",
    overflow: "hidden",
    margin: "auto",
    marginVertical: 15,
    padding: 8,
  },
  ratingText: {
    color: "white",
    fontSize: 14,
    marginLeft: 3,
  },
})
