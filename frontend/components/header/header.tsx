import useUser from "@/hooks/auth/useUser"
import { Raleway_600SemiBold } from "@expo-google-fonts/raleway"
import { Feather } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function Header() {
  const { user } = useUser()
  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity style={styles.header}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("@/assets/images/avatar.webp")
            }
            style={styles.image}
          />
        </TouchableOpacity>
        <View>
          <Text
            style={[styles.helloText, { fontFamily: "Raleway_600SemiBold" }]}
          >
            Hello,
          </Text>
          <Text style={[styles.text, { fontFamily: "Raleway_600SemiBold" }]}>
            {user?.fullname}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bellButton}>
        <View>
          <Feather name="shopping-bag" size={26} color={"black"} />
          <View style={styles.bellContainer}></View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
    width: "93%",
  },

  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  header: {
    width: 40,
    height: 40,
    marginRight: 8,
    backgroundColor: "red",
    borderRadius: 100,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  text: {
    fontSize: 16,
  },

  bellButton: {
    borderWidth: 1,
    borderColor: "#E1E2E5",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  bellContainer: {
    width: 10,
    height: 10,
    position: "absolute",
    borderRadius: 50,
    right: 0,
    top: 0,
    backgroundColor: "#1571ba",
  },

  helloText: {
    color: "#7C7C80",
    fontSize: 14,
  },
})
