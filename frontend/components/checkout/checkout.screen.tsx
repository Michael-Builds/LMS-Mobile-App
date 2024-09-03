import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useCart from '@/hooks/cart/useCart'

export default function CheckoutScreen() {
    const { cartItems, fetchCart } = useCart()
    console.log( fetchCart)
    
  return (
    <View>
      <Text>CheckoutScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({})