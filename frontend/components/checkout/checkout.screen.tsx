import { StyleSheet, Text, View } from "react-native"
import React, { useState, useEffect } from "react"
import useCart from "@/hooks/cart/useCart"

export default function CheckoutScreen() {
  const { cartItems } = useCart()

  useEffect(() => {
    console.log("Our carts", cartItems)
  })

  return (
    <View>
      <Text>CheckoutScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({})
