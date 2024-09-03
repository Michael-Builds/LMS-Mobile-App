import useUser from "@/hooks/auth/useUser"
import useCart from "@/hooks/cart/useCart"
import { Nunito_400Regular } from "@expo-google-fonts/nunito"
import { Raleway_600SemiBold } from "@expo-google-fonts/raleway"
import { Feather } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import { router } from "expo-router"
import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function Header() {
  const { user } = useUser()
  const { cartItems } = useCart()

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Nunito_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  const handleAddToCart = () => {
    router.push("/(routes)/cart")
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
      <TouchableOpacity
        onPress={() => handleAddToCart()}
        style={styles.bellButton}
      >
        <View>
          <Feather name="shopping-bag" size={26} color={"black"} />
          {cartItems.length > 0 && (
            <View style={styles.bellContainer}>
              <Text
                style={{
                  color: "white",
                  fontFamily: "Nunito_400Regular",
                }}
              >
                {cartItems.length}
              </Text>
            </View>
          )}
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
    width: 20,
    height: 20,
    position: "absolute",
    borderRadius: 50,
    right: -5,
    top: -5,
    backgroundColor: "#1571ba",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    fontSize: 14,
  },

  helloText: {
    color: "#7C7C80",
    fontSize: 14,
  },
})
