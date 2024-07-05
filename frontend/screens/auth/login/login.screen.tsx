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
import {
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_500Medium,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito"
import {
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway"
import { useFonts } from "expo-font"
import { styles } from "@/styles/auth/auth"
import { router } from "expo-router"

export default function LoginScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Raleway_600SemiBold,
  })

  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const [buttonSpinner, setButtonSpinner] = useState(false)
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  })

  const [required, setRequired] = useState("")
  const [error, setError] = useState({
    password: "",
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  const handlePasswordValidation = (value: string) => {
    const password = value
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/
    const passwordOneNumber = /(?=.*[0-9])/
    const passwordSixValue = /.{6,}/

    if (!passwordSpecialCharacter.test(password)) {
      setError({
        ...error,
        password: "Add at least one special character",
      })
    } else if (!passwordOneNumber.test(password)) {
      setError({
        ...error,
        password: "Add at least one number",
      })
    } else if (!passwordSixValue.test(password)) {
      setError({
        ...error,
        password: "Password must be more than 6 characters",
      })
    } else {
      setError({
        ...error,
        password: "",
      })
    }
    setUserInfo({ ...userInfo, password: value })
  }

  const handleSignIn = () => {}

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
      <ScrollView>
        <Image
          style={styles.signInImage}
          source={require("@/assets/auth/auth.png")}
        />
        <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
          Welcome Back!
        </Text>
        <Text style={[styles.preText, { fontFamily: "Nunito_400Regular" }]}>
          Login to Continue
        </Text>

        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[styles.textInput, { fontFamily: "Nunito_400Regular" }]}
              keyboardType="email-address"
              value={userInfo.email}
              placeholder="Email Address"
              onChangeText={(value) => {
                setUserInfo({ ...userInfo, email: value })
              }}
            />
            <Fontisto
              style={styles.icon}
              name="email"
              size={20}
              color={"#A1A1A1"}
            />
            {required && (
              <View style={styles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
                <Text style={styles.errorText}>This field is required</Text>
              </View>
            )}
          </View>

          <View>
            <TextInput
              style={[styles.textInput, { fontFamily: "Nunito_400Regular" }]}
              keyboardType="default"
              secureTextEntry={!isPasswordVisible}
              defaultValue=""
              placeholder="******"
              onChangeText={handlePasswordValidation}
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
            {error.password && (
              <View style={styles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
                <Text style={styles.errorText}>{error.password}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={() => router.push("/forgot-password")}>
            <Text
              style={[
                styles.forgotSection,
                { fontFamily: "Nunito_600SemiBold" },
              ]}
            >
              Forgot Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonWrapper} onPress={handleSignIn}>
            {buttonSpinner ? (
              <ActivityIndicator size="small" color={"white"} />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  { fontFamily: "Nunito_600SemiBold" },
                ]}
              >
                Login
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.option}>Or</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity>
              <FontAwesome name="google" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="github" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.signUpRedirect}>
            <Text style={{ fontSize: 18, fontFamily: "Nunito_600SemiBold" }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text
                style={{
                  fontFamily: "Nunito_600SemiBold",
                  fontSize: 18,
                  color: "#1571ba",
                  marginLeft: 5,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}
