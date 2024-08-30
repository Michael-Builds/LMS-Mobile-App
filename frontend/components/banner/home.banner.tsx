import { bannerDataSlider } from "@/constants/constants"
import { styles } from "@/styles/main/banner.styles"
import React from "react"
import { Image, View } from "react-native"
import Swiper from "react-native-swiper"

export default function HomeBannerSlider() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Swiper
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          autoplay={true}
          autoplayTimeout={4}
          loop={true}
          showsPagination={true}
          paginationStyle={styles.pagination}
          scrollEnabled={true}
        >
          {bannerDataSlider.map((item: BannerDataTypes, index: number) => (
            <View key={index} style={styles.slide}>
              <Image source={item.bannerImageUrl} style={styles.image} />
              <View style={styles.overlay} />
            </View>
          ))}
        </Swiper>
      </View>
    </View>
  )
}
