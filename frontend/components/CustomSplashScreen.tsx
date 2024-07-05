import { commonStyles } from "@/styles/common/common.styles"
import React from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { Nunito_600SemiBold } from "@expo-google-fonts/nunito"
import { useFonts } from "expo-font"

export default function CustomSplashScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <View style={commonStyles.splashContain}>
      <ActivityIndicator size="large" color="#1571ba" />
      <Text
        style={[commonStyles.loadingText, { fontFamily: "Nunito_600SemiBold" }]}
      >
        Loading...
      </Text>
    </View>
  )
}
