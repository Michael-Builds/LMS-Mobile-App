import Button from "@/components/button/button"
import { styles } from "@/styles/auth/auth"
import React, { useRef, useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { Nunito_400Regular, useFonts} from "@expo-google-fonts/nunito"
import { router } from "expo-router"

export default function VerifyAccountScreen() {
  const [code, setCode] = useState(new Array(4).fill(""))
  const inputs = useRef<(TextInput | null)[]>([])
  
  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  // Function to handle input change
  const handleInput = (text: any, index: any) => {
    const newCode = [...code] // Copy current code state
    newCode[index] = text // Update the code at the specified index
    setCode(newCode) // Update state with new code

    if (text && index < 3) {
      inputs.current[index + 1]?.focus()
    }
    if (text === "" && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = () => {}

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
      <View style={{ marginTop: 8 }}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
      <TouchableOpacity onPress={()=> router.back()}>
        <Text
          style={{ fontSize: 16, paddingTop: 18,fontFamily: "Nunito_400Regular"}} >
          Return to login
        </Text>
      </TouchableOpacity>
    </View>
  )
}
