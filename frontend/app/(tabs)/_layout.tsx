import useUser from "@/hooks/auth/useUser"
import { styles } from "@/styles/main/main.style"
import { Tabs } from "expo-router"
import { Image, Text, View } from "react-native"
import { Nunito_600SemiBold } from "@expo-google-fonts/nunito"
import { useFonts } from "expo-font"

export default function TabsLayout() {
  let [fontsLoaded, fontError] = useFonts({ Nunito_600SemiBold })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName, label

          if (route.name === "index") {
            iconName = require("@/assets/icons/home.png")
            label = "Home"
          } else if (route.name === "search/index") {
            iconName = require("@/assets/icons/search.png")
            label = "Search"
          } else if (route.name === "courses/index") {
            iconName = require("@/assets/icons/book.png")
            label = "Courses"
          } else if (route.name === "profile/index") {
            // user?.avatar ||
            iconName = require("@/assets/icons/user.png")
            label = "Profile"
          }

          return (
            <View style={{ alignItems: "center" }}>
              <Image
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#1571ba" : color,
                }}
                source={iconName}
              />
              <Text
                style={{
                  color: focused ? "#1571ba" : color,
                  fontSize: 11,
                  marginTop: 6,
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                {label}
              </Text>
            </View>
          )
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "red",
      })}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="courses/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  )
}
