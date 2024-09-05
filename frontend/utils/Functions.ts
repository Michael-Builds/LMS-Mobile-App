import { storeTokens, refreshToken, getAccessToken } from "@/components/urls/tokenHelpers";
import { router } from "expo-router";
import { Toast } from "react-native-toast-notifications";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { authApi } from "@/components/urls/Instances";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Utility function to handle the login process
export const handleLogin = async (email: string, password: string) => {
  try {
    const { data } = await authApi.post("/login", { email, password });
    await storeTokens(data.accessToken, data.refreshToken);
    router.push("/(tabs)");
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    Toast.show(message, { type: "danger", animationType: "zoom-in" });
    throw error;
  }
};

// Function to handle logout
export const handleLogout = async () => {
  try {
    // Call the backend logout endpoint to invalidate the session
    await authApi.get("/logout");

    // Show a success message to the user
    Toast.show("Logged out successfully", {
      type: "success",
      animationType: "zoom-in",
    });
  } catch (error) {
    console.error("Logout failed:", error);
    Toast.show("Error logging out", {
      type: "danger",
      animationType: "zoom-in",
    });
  } finally {
    // Clear tokens from AsyncStorage
    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);

    // Redirect the user to the login screen
    router.replace("/(routes)/login");
  }
};

// Check if the user is authenticated and refresh token if needed
export const checkAuth = async () => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    const refreshedToken = await refreshToken(authApi);
    if (!refreshedToken) {
      return false;
    }
  }

  return true;
};

// Decode the JWT token to get its expiration time
const getTokenExpiration = async (): Promise<number | null> => {
  const token = await getAccessToken();
  if (token) {
    const decoded: any = jwtDecode(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
  }
  return null;
};

// Check if token is expiring within the next 5 minutes
export const isTokenExpiringSoon = async (): Promise<boolean> => {
  const expirationTime = await getTokenExpiration();
  if (expirationTime) {
    const currentTime = Date.now();
    return expirationTime - currentTime <= 5 * 60 * 1000;
  }
  return false;
};

// Hook to refresh token periodically if the user is active
export const useAutoRefreshToken = () => {
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      const tokenExpiring = await isTokenExpiringSoon();
      if (tokenExpiring) {
        await refreshToken(authApi);
      }
    }, 4 * 60 * 1000); // Check every 4 minutes

    return () => clearInterval(refreshInterval);
  }, []);
};
