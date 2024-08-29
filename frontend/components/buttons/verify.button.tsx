import React from "react";
import { Dimensions, Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { commonStyles } from "@/styles/common/common.styles";

interface VerifyButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean; 
}

export default function VerifyButton({ title, onPress, loading = false }: VerifyButtonProps) {
  const { width } = Dimensions.get("window");

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
      onPress={onPress} 
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={"#fff"} style={{ marginRight: 8 }} />
      ) : (       
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {title}
      </Text>
      )}

    </TouchableOpacity>
  );
}

