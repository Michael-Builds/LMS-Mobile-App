import React from "react"
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native"
import { styles } from "@/styles/auth/auth"

interface AuthButtonProps {
  title: string
  onPress: () => void
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  fontFamily?: string
}

export default function AuthButton({
  title,
  onPress,
  loading = false,
  style,
  textStyle,
  fontFamily = "Nunito_600SemiBold",
}: AuthButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.buttonWrapper, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={"white"} />
      ) : (
        <Text style={[styles.buttonText, textStyle, { fontFamily }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}
