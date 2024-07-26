import { Image, Text, TouchableOpacity, View } from "react-native"
import React from "react"
import { Nunito_400Regular, Nunito_500Medium, Nunito_700Bold } from "@expo-google-fonts/nunito"
import { Raleway_700Bold } from "@expo-google-fonts/raleway"
import { useFonts } from "expo-font"
import { LinearGradient } from "expo-linear-gradient"
import { styles } from "@/styles/onboarding/onboarding"
import { router } from "expo-router"

export default function OnBoardingScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_700Bold,
    Nunito_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View style={styles.firstContainer}>
        <View>
          <Image source={require("@/assets/logo1.png")} style={styles.logo} />
        </View>

        <View style={styles.titleWrapper}>
          {/* <Image style={styles.titleTextShape1} /> */}
          <Text style={[styles.titleText, { fontFamily: "Raleway_700Bold" }]}>
            Start Learning With
          </Text>
          {/* <Image style={styles.titleTextShape2} /> */}
        </View>

        <View>
          <Image style={styles.titleShape3} />
          <Text style={[styles.titleText2, { fontFamily: "Raleway_700Bold" }]}>
            HTU
          </Text>
        </View>

        <View style={styles.dscpWrapper}>
          <Text style={[styles.dscpText, { fontFamily: "Nunito_400Regular" }]}>
            Explore a variety of interactive lessons,
          </Text>
          <Text style={[styles.dscpText, { fontFamily: "Nunito_400Regular" }]}>
            video, quizzze & assignment
          </Text>
        </View>

        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => router.push("/(routes)/welcome-intro")}
        >
          <Text style={[styles.buttonText, { fontFamily: "Nunito_400Regular" }]}>
            Getting Started
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}
