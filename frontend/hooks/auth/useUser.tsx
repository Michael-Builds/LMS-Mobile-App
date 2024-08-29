import { auth } from "@/utils/Endpoints"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { useEffect, useState } from "react"

export default function useUser() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User>()
  const [error, setError] = useState("")

  useEffect(() => {
    const subscriptions = async () => {
      const accessToken = await AsyncStorage.getItem("access_token")
      const refreshToken = await AsyncStorage.getItem("refresh_token")

      await axios
        .get(`${auth}/get-user`, {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        })
        .then((res: any) => {
          setUser(res.data.user)
          setLoading(false)
        })
        .catch((error: any) => {
          setError(error?.message)
          setLoading(false)
        })
    }
    subscriptions()
  }, [])
  return { loading, user, error }
}
