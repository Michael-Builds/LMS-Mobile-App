import { auth } from "@/utils/Endpoints"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { useEffect, useState } from "react"

export default function useUser() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("access_token")
        const refreshToken = await AsyncStorage.getItem("refresh_token")

        if (!accessToken || !refreshToken) {
          throw new Error("Tokens are missing")
        }

        const response = await axios.get(`${auth}/get-user`, {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        })

        // Transform the data if necessary
        const userData = response.data.user
        
        const transformedUser: User = {
          id: userData._id,
          fullname: userData.fullname,
          email: userData.email,
          avatar: userData.avatar?.url || "",
          courses: userData.courses,
          createdAt: new Date(userData.createdAt),
          updatedAt: new Date(userData.updatedAt),
        }
        setUser(transformedUser)
      } catch (error: any) {
        setError(error?.message || "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { loading, user, error }
}
