import useCart from "@/hooks/cart/useCart"
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito"
import { Entypo, FontAwesome } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import { LinearGradient } from "expo-linear-gradient"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Toast } from "react-native-toast-notifications"

export default function CartScreen() {
  const { cartItems, removeItemFromCart, fetchCart } = useCart()
  const [refreshing, setRefreshing] = useState(false)

  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  const handleRemoveCart = async (courseId: string) => {
    try {
      const message = await removeItemFromCart(courseId)
      Toast.show(message, {
        type: "success",
        animationType: "zoom-in",
      })
    } catch (error: any) {
      Toast.show(error.message, {
        type: "danger",
        animationType: "zoom-in",
      })
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCart()
    setRefreshing(false)
  }

  // Calculate the total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.courseId.price * item.quantity,
    0
  )

  const handleCheckout = () => {
    router.push("/(routes)/checkout")
  }

  const handleCourseDetails = (courseDetails: any) => {
    router.push({
      pathname: "/(routes)/course-details",
      params: { item: JSON.stringify(courseDetails) },
    })
  }

  const renderCartItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.cartItemContainer}>
      <TouchableOpacity onPress={() => handleCourseDetails(item.courseId)}>
        <Image
          source={{ uri: item.courseId?.thumbnail.url }}
          style={styles.thumbnail}
        />
      </TouchableOpacity>
      <View style={styles.cartItemDetails}>
        <TouchableOpacity>
          <Text style={styles.courseName}>{item.courseId.name}</Text>
        </TouchableOpacity>
        <View style={styles.courseInfoContainer}>
          <View style={styles.courseInfo}>
            <Entypo name="dot-single" size={24} color="gray" />
            <Text style={styles.courseLevel}>{item.courseId.level}</Text>
          </View>
          <View style={styles.courseInfo}>
            <FontAwesome name="dollar" size={15} color="#808080" />
            <Text style={styles.coursePrice}>{item.courseId.price}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveCart(item.courseId._id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Image
        source={require("@/assets/images/empty_cart.png")}
        style={styles.emptyCartImage}
      />
      <Text style={styles.emptyCartText}>Your Cart is Empty</Text>
    </View>
  )

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderCartItem}
        ListEmptyComponent={renderEmptyCart}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalCartPrice}>
            Total Price: $ {totalPrice.toFixed(2)}
          </Text>
        </View>
      )}
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => handleCheckout()}
        >
          <Text style={styles.proceed}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  cartItemContainer: {
    flexDirection: "row",
    marginVertical: 8,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  courseName: {
    fontFamily: "Nunito_600SemiBold",
    fontWeight: "600",
    fontSize: 16,
  },
  courseInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: -5,
  },
  courseInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  courseLevel: {
    fontSize: 16,
    color: "#808080",
    fontWeight: "600",
    fontFamily: "Nunito_400Regular",
  },
  coursePrice: {
    fontSize: 14,
    color: "#808080",
    fontWeight: "600",
    fontFamily: "Nunito_400Regular",
    marginLeft: 3,
  },
  removeButton: {
    backgroundColor: "#FF6347",
    borderRadius: 50,
    padding: 5,
    width: 100,
    alignSelf: "flex-start",
  },
  removeButtonText: {
    fontSize: 14,
    color: "white",
    fontFamily: "Nunito_600SemiBold",
    textAlign: "center",
    fontWeight: "600",
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    // height:100
  },
  emptyCartImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    backgroundColor: "transparent",
  },
  emptyCartText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Nunito_600SemiBold",
    textAlign: "center",
  },
  totalContainer: {
    alignItems: "center",
  },
  totalCartPrice: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Nunito_600SemiBold",
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: "#1571ba",
    borderRadius: 50,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
    width: "80%",
    alignSelf: "center",
  },
  proceed: {
    fontSize: 16,
    color: "white",
    fontFamily: "Nunito_400Regular",
    textAlign: "center",
  },
})
