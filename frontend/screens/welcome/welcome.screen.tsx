import React from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito"
import { Raleway_700Bold } from "@expo-google-fonts/raleway"
import { useFonts } from "expo-font"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import AppIntroSlider from "react-native-app-intro-slider"
import { onboardingSwiperData } from "@/constants/constants"
import { commonStyles } from "@/styles/common/common.styles"
import { styles } from "@/styles/onboarding/onboarding"

export default function WelcomeIntroScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_700Bold,
    Nunito_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  const renderItem = ({ item }: { item: onboardingSwiperDataType }) => (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9", "#E8EEF9"]}
      style={{ flex: 1, paddingHorizontal: 16 }}
    >
      <View style={{ marginTop: 120 }}>
        <Image
          source={item.image}
          style={{
            alignSelf: "center",
            marginBottom: 30,
            width: 350,
            height: 250,
          }}
        />
        <Text style={[commonStyles.title, { fontFamily: "Raleway_700Bold" }]}>
          {item.title}
        </Text>
        <View style={{ marginTop: 15 }}>
          <Text
            style={[
              commonStyles.decription,
              { fontFamily: "Nunito_400Regular" },
            ]}
          >
            {item.description}
          </Text>
          <Text
            style={[
              commonStyles.decription,
              { fontFamily: "Nunito_400Regular" },
            ]}
          >
            {item.sortDescription}
          </Text>
          <Text
            style={[
              commonStyles.decription,
              { fontFamily: "Nunito_400Regular" },
            ]}
          >
            {item.sortDescription2}
          </Text>
        </View>
      </View>
    </LinearGradient>
  )

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={onboardingSwiperData}
      onDone={() => {
        router.push("/login")
      }}
      onSkip={() => {
        router.push("/login")
      }}
      renderNextButton={() => (
        <View style={[styles.welcomeButtonStyle, {marginBottom:30}]}>
          <Text
            style={[styles.buttonText, { fontFamily: "Nunito_400Regular" }]}
          >
            Next
          </Text>
        </View>
      )}
      renderDoneButton={() => (
        <View style={[styles.welcomeButtonStyle, {marginBottom:30}]}>
          <Text
            style={[styles.buttonText, { fontFamily: "Nunito_400Regular" }]}
          >
            Done
          </Text>
        </View>
      )}
      showSkipButton={false}
      dotStyle={commonStyles.dotStyle}
      bottomButton={true}
      activeDotStyle={commonStyles.activeDotStyle}
    />
  )
}
