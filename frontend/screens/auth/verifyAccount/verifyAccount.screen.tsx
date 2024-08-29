import { styles } from "@/styles/auth/auth"
import React, { useRef, useState } from "react"
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Nunito_400Regular, useFonts } from "@expo-google-fonts/nunito"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { auth } from "@/utils/Endpoints"
import { Toast } from "react-native-toast-notifications"
import VerifyButton from "@/components/buttons/verify.button"

export default function VerifyAccountScreen() {
  const [code, setCode] = useState(new Array(4).fill(""))
  const inputs = useRef<(TextInput | null)[]>([])
  const [buttonSpinner, setButtonSpinner] = useState(false)

  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  // Function to handle input change
  const handleInput = (text: any, index: any) => {
    const newCode = [...code]
    newCode[index] = text
    setCode(newCode)

    if (text && index < 3) {
      inputs.current[index + 1]?.focus()
    }
    if (text === "" && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  // Function to handle form submission
  const handleSubmit = async () => {
    setButtonSpinner(true)
    const otp = code.join("")
    try {
      const activation_token = await AsyncStorage.getItem("activation-token")

      await axios.post(`${auth}/account-activate`, {
        activation_token,
        activation_code: otp,
      })

      Toast.show("Account activated successfully!", {
        type: "success",
        animationType: "zoom-in",
      })
      setCode(new Array(4).fill(""))
      router.push("/login")
    } catch (err: any) {
      let errorMessage = "An error occurred. Please try again."
      if (err.response) {
        errorMessage = err.response.data.message || "Invalid OTP Code"
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection."
      } else {
        errorMessage = err.message
      }
      Toast.show(errorMessage, {
        type: "danger",
        animationType: "zoom-in",
      })
    } finally {
      setButtonSpinner(false)
    }
  }

  return (
    <View style={styles.verifyContainer}>
      <Text style={styles.verifyHeaderText}>Verification Code</Text>
      <Text style={styles.verifysubText}>
        We've sent a verification code to your email address
      </Text>
      <View style={styles.verifyInputContainer}>
        {code.map((_, index) => (
          <TextInput
            style={styles.verifyInputBox}
            key={index}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleInput(text, index)}
            value={code[index]}
            ref={(el) => (inputs.current[index] = el)}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <TouchableOpacity style={{ marginTop: 8 }}>
        <VerifyButton title="Submit" onPress={handleSubmit} loading={buttonSpinner} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text
          style={{
            fontSize: 16,
            paddingTop: 18,
            fontFamily: "Nunito_400Regular",
          }}
        >
          Go back
        </Text>
      </TouchableOpacity>
    </View>
  )
}
