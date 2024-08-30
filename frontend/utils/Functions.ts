import { router } from "expo-router";
import axios from "axios";
import { auth } from "./Endpoints";
import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Utility function for storing tokens securely
export const storeTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.setItem("access_token", accessToken);
    await AsyncStorage.setItem("refresh_token", refreshToken);
  } catch (error) {
    throw new Error("Failed to store tokens securely");
  }
}


// Utility function to handle the login process
export const handleLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${auth}/login`, { email, password });
    const { accessToken, refreshToken } = response.data;

    // Store the tokens securely
    await storeTokens(accessToken, refreshToken);

    // Redirect to the main app after successful login
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