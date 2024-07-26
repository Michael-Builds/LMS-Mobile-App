import { styles } from "@/styles/auth/auth"
import { commonStyles } from "@/styles/common/common.styles"
import React from "react"
import { Dimensions, Text, TouchableOpacity } from "react-native"

export default function Button({
  title,
  onPress,
}: {
  title: string
  onPress: () => void
}) {
  const { width } = Dimensions.get("window")

  return (
    <TouchableOpacity
      style={[
        commonStyles.buttonContainer,
        {
          width: width * 1 - 150,
          height: 46,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        },
      ]}
      onPress={() => onPress}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}
