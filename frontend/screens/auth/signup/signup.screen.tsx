import AuthButton from "@/components/buttons/auth.button"
import { styles } from "@/styles/auth/auth"
import { auth } from "@/utils/Endpoints"
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito"
import {
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway"
import {
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { useFonts } from "expo-font"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import React, { useState } from "react"
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import { Toast } from "react-native-toast-notifications"

export default function SignUpScreen() {
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
    fullname: "",
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

  const handleSignUp = async () => {
    setRequired("")

    if (!userInfo.fullname || !userInfo.email || !userInfo.password) {
      setRequired("This field is required")
      return
    }
    setButtonSpinner(true)

    try {
      const res = await axios.post(`${auth}/register`, {
        fullname: userInfo.fullname,
        email: userInfo.email,
        password: userInfo.password,
      })

      await AsyncStorage.setItem("activation-token", res.data.activationToken)

      Toast.show(res.data.message, {
        type: "success",
        animationType: "zoom-in",
      })
      setUserInfo({
        fullname: "",
        email: "",
        password: "",
      })
      setButtonSpinner(false)
      router.push("/verifyAccount")
    } catch (err: any) {
      Toast.show("Error Creating Account", {
        type: "danger",
        animationType: "zoom-in",
      })
    }
  }

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
      <ScrollView>
        <Image
          style={styles.signInImage}
          source={require("@/assets/auth/auth.png")}
        />
        <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
          Create Account
        </Text>
        <Text style={[styles.preText, { fontFamily: "Nunito_400Regular" }]}>
          Sign up to get started
        </Text>

        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[styles.textInput, { fontFamily: "Nunito_400Regular" }]}
              keyboardType="default"
              value={userInfo.fullname}
              placeholder="Full Name"
              onChangeText={(value) => {
                setUserInfo({ ...userInfo, fullname: value })
              }}
            />
            <Fontisto
              style={styles.icon}
              name="person"
              size={20}
              color={"#A1A1A1"}
            />
            {!userInfo.fullname && required && (
              <View style={styles.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
                <Text style={styles.errorText}>This field is required</Text>
              </View>
            )}
          </View>
          <View>
            <TextInput
              style={[styles.textInput, { fontFamily: "Nunito_400Regular" }]}
              keyboardType="email-address"
              value={userInfo.email}
              placeholder="Email Address"
              onChangeText={(value) => {
                setUserInfo({ ...userInfo, email: value.toLowerCase() })
              }}
            />
            <Fontisto
              style={styles.icon}
              name="email"
              size={20}
              color={"#A1A1A1"}
            />
            {!userInfo.email && required && (
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
              placeholder="Enter Password"
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
          <AuthButton
            title="Sign Up"
            onPress={handleSignUp}
            loading={buttonSpinner}
          />
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
              <Image
                style={styles.google}
                source={require("@/assets/auth/google.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="github" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.signUpRedirect}>
            <Text style={{ fontSize: 18, fontFamily: "Nunito_500Medium" }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text
                style={{
                  fontFamily: "Nunito_600SemiBold",
                  fontSize: 18,
                  color: "#1571ba",
                  marginLeft: 5,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}
