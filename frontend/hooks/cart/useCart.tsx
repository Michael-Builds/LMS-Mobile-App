import { useState, useEffect } from "react"
import axios from "axios"
import { cart } from "@/utils/Endpoints"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { cartApi } from "@/components/urls/Instances"

export default function useCart() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Function to fetch cart items
  const fetchCart = async () => {
    try {
      const response = await cartApi.get("/get-carts")
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
      const response = await cartApi.delete("/remove-cart", {
        data: { courseId },
      })

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.courseId._id !== courseId)
      )

      return response.data.message
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
