import React, { useState } from "react"
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Entypo, Ionicons, SimpleLineIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito"
import { Raleway_700Bold } from "@expo-google-fonts/raleway"
import { useFonts } from "expo-font"
import { styles } from "@/styles/auth/auth"
import { router } from "expo-router"

export default function ResetPasswordScreen() {
  const [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
  })

  const [buttonSpinner, setButtonSpinner] = useState(false)
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const [userInfo, setUserInfo] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  const handlePasswordValidation = (value: string, type: string) => {
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/
    const passwordOneNumber = /(?=.*[0-9])/
    const passwordSixValue = /.{6,}/

    let errorMessage = ""

    if (!passwordSpecialCharacter.test(value)) {
      errorMessage = "Add at least one special character"
    } else if (!passwordOneNumber.test(value)) {
      errorMessage = "Add at least one number"
    } else if (!passwordSixValue.test(value)) {
      errorMessage = "Password must be more than 6 characters"
    }

    setError({
      ...error,
      [type]: errorMessage,
    })
    setUserInfo({ ...userInfo, [type]: value })
  }

  const handleResetPassword = () => {
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      setError({
        ...error,
        confirmPassword: "Passwords do not match",
      })
      return
    }

    // Implement password reset logic here

    setButtonSpinner(true)
    // Simulate an async operation
    router.push("/forgot-password")
    setTimeout(() => {
      setButtonSpinner(false)
      // Navigate to another screen or show a success message
    }, 2000)
  }

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
      <ScrollView>
        <Image
          style={styles.signInImage}
          source={require("@/assets/auth/reset.png")}
        />
        <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
          Reset Password
        </Text>
        <Text style={[styles.preText, { fontFamily: "Nunito_400Regular" }]}>
          Enter your new password and confirm it
        </Text>

        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[styles.textInput, { fontFamily: "Nunito_400Regular" }]}
              keyboardType="default"
              secureTextEntry={!isPasswordVisible}
              placeholder="Enter New Password"
              onChangeText={(text) =>
                handlePasswordValidation(text, "newPassword")
              }
              value={userInfo.newPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
              style={styles.visibleIcon}
            >
              {isPasswordVisible ? (
                <Ionicons name="eye-off-outline" size={23} color={"#747474"} />
              ) : (
                <Ionicons name="eye-outline" size={23} color={"#747474"} />
              )}
            </TouchableOpacity>
            <SimpleLineIcons
              style={styles.icon2}
              name="lock"
              size={19}
              color={"#A1A1A1"}
            />
            {error.newPassword && (
              <View style={styles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
                <Text style={styles.errorText}>{error.newPassword}</Text>
              </View>
            )}
          </View>

          <View style={{ marginBottom: 18 }}>
            <TextInput
              style={[styles.textInput, { fontFamily: "Nunito_400Regular" }]}
              keyboardType="default"
              secureTextEntry={!isPasswordVisible}
              placeholder="Confirm New Password"
              onChangeText={(text) =>
                handlePasswordValidation(text, "confirmPassword")
              }
              value={userInfo.confirmPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
              style={styles.visibleIcon}
            >
              {isPasswordVisible ? (
                <Ionicons name="eye-off-outline" size={23} color={"#747474"} />
              ) : (
                <Ionicons name="eye-outline" size={23} color={"#747474"} />
              )}
            </TouchableOpacity>
            <SimpleLineIcons
              style={styles.icon2}
              name="lock"
              size={19}
              color={"#A1A1A1"}
            />
            {error.confirmPassword && (
              <View style={styles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
                <Text style={styles.errorText}>{error.confirmPassword}</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={handleResetPassword}
        >
          {buttonSpinner ? (
            <ActivityIndicator size="small" color={"white"} />
          ) : (
            <Text
              style={[styles.buttonText, { fontFamily: "Nunito_600SemiBold" }]}
            >
              Reset Password
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  )
}
