import { StyleSheet } from "react-native"
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

export const commonStyles = StyleSheet.create({
  splashContain: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1571ba',
     
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    backgroundColor: "#1571ba",
    width: responsiveWidth(88),
    height: responsiveHeight(2.5),
    borderRadius: 5,
    marginHorizontal: 5,
  },

  dotStyle: {
    backgroundColor: "#C6C7CC",
    width: responsiveWidth(2.5),
    height: responsiveHeight(1.3),
    borderRadius: 5,
    marginHorizontal: 5,
  },

  activeDotStyle: {
    backgroundColor: "#1571ba",
    width: responsiveWidth(2.5),
    height: responsiveHeight(1.3),
    borderRadius: 5,
    marginHorizontal: 5,
  },

  title: {
    fontSize: hp("2.5%"),
    textAlign: "center",
  },

  decription: {
    fontSize: hp("2%"),
    color: "#575757",
    textAlign: "center",
  },


})
