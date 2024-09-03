import { useState, useEffect } from "react"
import axios from "axios"
import { cart } from "@/utils/Endpoints"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function useCart() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchCart = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token")
      const refreshToken = await AsyncStorage.getItem("refresh_token")

      if (!accessToken || !refreshToken) {
        throw new Error("Tokens are missing")
      }

      const response = await axios.get(`${cart}/get-carts`, {
        headers: {
          "access-token": accessToken,
          "refresh-token": refreshToken,
        },
      })

      setCartItems(response.data.cart.courses || [])
    } catch (error: any) {
      setError(error?.message || "Failed to fetch cart")
    } finally {
      setLoading(false)
    }
  }

  // Function to remove an item from the cart
  const removeItemFromCart = async (courseId: string) => {
    try {
      const res = await axios.delete(`${cart}/remove-cart`, {
        data: { courseId },
      })
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.courseId._id !== courseId)
    );
      return res.data.message
    } catch (error: any) {
      setError(error?.message || "Failed to remove item from cart")
      throw new Error(error?.message || "Failed to remove item from cart")
    }
  }
  
  useEffect(() => {
    fetchCart()
  }, [])

  return { cartItems, loading, error, fetchCart, removeItemFromCart }
}
