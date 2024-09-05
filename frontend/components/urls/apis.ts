import axios from "axios";
import { getAccessToken, refreshToken } from "./tokenHelpers";
import { Toast } from "react-native-toast-notifications";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to create a new Axios instance with token refresh handling
export const createApiInstance = (baseURL: string) => {
    const api = axios.create({ baseURL });

    // Add access token to each request
    api.interceptors.request.use(
        async (config) => {
            const token = await getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Handle token expiration (401)
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newAccessToken = await refreshToken(api);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch {
                    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
                    Toast.show("Session expired, please log in again", {
                        type: "danger",
                        animationType: "zoom-in",
                    });
                    router.replace("/(routes)/login");
                }
            }
            return Promise.reject(error);
        }
    );

    return api;
};
