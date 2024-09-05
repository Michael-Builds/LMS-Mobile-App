import AsyncStorage from "@react-native-async-storage/async-storage";

// Store tokens securely
export const storeTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.multiSet([
    ["access_token", accessToken],
    ["refresh_token", refreshToken],
  ]);
};

// Get access token
export const getAccessToken = async () => {
  return await AsyncStorage.getItem("access_token");
};

// Get refresh token
export const getRefreshToken = async () => {
  return await AsyncStorage.getItem("refresh_token");
};

// Refresh token logic
export const refreshToken = async (apiInstance: any) => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token found");

  const { data } = await apiInstance.post(`/refresh-token`, null, {
    headers: { "refresh-token": refreshToken },
  });

  const { accessToken, refreshToken: newRefreshToken } = data;
  await storeTokens(accessToken, newRefreshToken);
  return accessToken;
};
