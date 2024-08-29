import * as SecureStore from "expo-secure-store"
import { router } from "expo-router";
import axios from "axios";
import { auth } from "./Endpoints";
import { Toast } from "react-native-toast-notifications";

// Utility function for storing tokens securely
export const storeTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    await SecureStore.setItemAsync("access_token", accessToken)
    await SecureStore.setItemAsync("refresh_token", refreshToken)
  } catch (error) {
    throw new Error("Failed to store tokens securely")
  }
}


// Utility function to handle the login process
export const handleLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${auth}/login`, { email, password });
    const { accessToken, refreshToken } = response.data;

    await storeTokens(accessToken, refreshToken);

    // Toast.show("Logged in successfully", {
    //   type: "success",
    //   animationType: "zoom-in",
    // });

    router.push("/(tabs)");
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "An error occurred during login";
    Toast.show(errorMessage, {
      type: "danger",
      animationType: "zoom-in",
    });
    throw error;
  }
};