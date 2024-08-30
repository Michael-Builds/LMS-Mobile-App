import { AntDesign } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import React, { useState } from "react"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Nunito_400Regular } from "@expo-google-fonts/nunito"
export default function SearchInput() {
  const [isFocused, setIsFocused] = useState(false)

  let [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <View style={styles.filteringContainer}>
      <View
        style={[
          styles.searchContainer,
          isFocused && styles.searchContainerFocused,
        ]}
      >
        <TextInput
          style={[styles.input, { fontFamily: "Nunito_400Regular" }]}
          placeholder="Search..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCorrect={false}
          selectionColor="#C67cc"
          placeholderTextColor={"#C67cc"}
        />
        <TouchableOpacity style={styles.searchIconContainer}>
          <AntDesign name="search1" size={20} color={"#1571ba"} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  filteringContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 8,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 1,
    paddingHorizontal: 10,
    borderWidth: 0.3,
    borderColor: "gray",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  searchContainerFocused: {
    borderColor: "#1571ba",
    shadowColor: "#1571ba",
    shadowOpacity: 0.5,
    elevation: 5,
  },

  searchIconContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "black",
    paddingVertical: 10,
    width: 217,
    height: 48,
    paddingLeft: 5,
  },
})
