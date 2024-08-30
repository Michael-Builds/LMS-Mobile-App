import HomeBannerSlider from "@/components/banner/home.banner"
import Courses from "@/components/courses/courses"
import Header from "@/components/header/header"
import SearchInput from "@/components/search/search"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { ScrollView, StatusBar } from "react-native"

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ paddingTop: 50, flex: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1571ba" />
      <Header />
      <ScrollView>
        <SearchInput />
        <HomeBannerSlider />
        <Courses />
      </ScrollView>
    </LinearGradient>
  )
}
