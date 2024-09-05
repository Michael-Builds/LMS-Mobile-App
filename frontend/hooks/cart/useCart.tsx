import { useState, useEffect, useCallback } from "react"
import { cartApi } from "@/components/urls/Instances"

export default function useCart() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchCart = useCallback(async () => {
    setLoading(true)
    try {
      const response = await cartApi.get("/get-carts")
      setCartItems(response.data.cart.courses || [])
    } catch (error: any) {
      setError(error?.message || "Failed to fetch cart")
    } finally {
      setLoading(false)
    }
  }, [])

  // Add item to cart
  const addItemToCart = async (courseId: string) => {
    try {
      const response = await cartApi.post("/add-to-cart", {
        courseId,
        quantity: 1,
      })
      if (response.data.success) {
        await fetchCart()
        return response.data.message
      } else {
        throw new Error(response.data.message)
      }
    } catch (error: any) {
      setError(error?.message || "Failed to add item to cart")
      throw error
    }
  }

  // Remove item from cart
  const removeItemFromCart = async (courseId: string) => {
    try {
      const response = await cartApi.delete("/remove-cart", {
        data: { courseId },
      })
      if (response.data.success) {
        await fetchCart()
        return response.data.message
      } else {
        throw new Error(response.data.message)
      }
    } catch (error: any) {
      setError(error?.message || "Failed to remove item from cart")
      throw error
    }
  }

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return {
    cartItems,
    loading,
    error,
    fetchCart,
    addItemToCart,
    removeItemFromCart,
  }
}
