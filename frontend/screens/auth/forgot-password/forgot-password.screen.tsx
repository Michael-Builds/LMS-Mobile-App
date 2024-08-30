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
import { Entypo, Fontisto } from "@expo/vector-icons"
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

export default function ForgotPasswordScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
  })

  const [buttonSpinner, setButtonSpinner] = useState(false)
  const [email, setEmail] = useState("")
  const [required, setRequired] = useState("")

  if (!fontsLoaded && !fontError) {
    return null
  }

  const handleResetPassword = () => {
    // Implement password reset logic here
  }

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
      <ScrollView>
        <Image
          style={styles.signInImage}
          source={require("@/assets/auth/forgot.png")}
        />
        <Text style={[styles.welcomeText, { fontFamily: "Raleway_700Bold" }]}>
          Forgot Password?
        </Text>
        <Text style={[styles.preText, { fontFamily: "Nunito_400Regular" }]}>
          Enter your email to reset your password
        </Text>

        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[styles.textInput, { fontFamily: "Nunito_400Regular" }]}
              keyboardType="email-address"
              value={email}
              placeholder="Email Address"
              onChangeText={(value) => setEmail(value)}
              autoCorrect={false}
              selectionColor="#C67cc"
              placeholderTextColor={"#C67cc"}
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

          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={handleResetPassword}
          >
            {buttonSpinner ? (
              <ActivityIndicator size="small" color={"white"} />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  { fontFamily: "Nunito_600SemiBold" },
                ]}
              >
                Submit
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.signUpRedirect}>
            <Text style={{ fontSize: 18, fontFamily: "Nunito_500Medium" }}>
              Remember your password?
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
