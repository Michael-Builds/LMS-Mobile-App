import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import "react-native-reanimated"
import { Stack, useRouter } from "expo-router"
import CustomSplashScreen from "@/components/CustomSplashScreen"
import { checkAuth, useAutoRefreshToken } from "@/utils/Functions"
import { ToastProvider } from "react-native-toast-notifications"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  })

  const [isReady, setIsReady] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Auto-refresh token when the user is active
  useAutoRefreshToken()

  // Check authentication status on layout load
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
          router.replace("/(routes)/login")
        }
        setAuthChecked(true) 
      } catch (error) {
        console.error("Error during authentication check:", error)
      }
    }

    checkAuthentication()
  }, [])

  // Show splash screen until fonts are loaded and auth is checked
  useEffect(() => {
    if (fontsLoaded && authChecked) {
      SplashScreen.hideAsync()
      setIsReady(true) 
    }
  }, [fontsLoaded, authChecked])

  if (!fontsLoaded || !isReady || !authChecked) {
    return <CustomSplashScreen />
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(routes)/welcome-intro/index" />
        <Stack.Screen name="(routes)/login/index" />
        <Stack.Screen name="(routes)/signup/index" />
        <Stack.Screen name="(routes)/forgot-password/index" />
        <Stack.Screen
          name="(routes)/course-details/index"
          options={{
            headerShown: true,
            title: "Course Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/cart/index"
          options={{
            headerShown: true,
            title: "Cart Items",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(routes)/checkout/index"
          options={{
            headerShown: true,
            title: "Checkout",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </ToastProvider>
  )
}
