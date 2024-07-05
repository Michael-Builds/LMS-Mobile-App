import { StyleSheet } from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions"

export const styles = StyleSheet.create({
  firstContainer: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: wp("35%"),
    height: hp("22%"),
  },

  titleWrapper: {
    flexDirection: "row",
    marginTop: -55,
    alignItems: "center",
    justifyContent: "center",
  },

  titleTextShape1: {
    position: "absolute",
    left: -28,
    top: -20,
  },

  titleText: {
    fontSize: hp("3.2%"),
    textAlign: "center",
  },

  titleTextShape2: {
    position: "absolute",
    right: -40,
    top: -20,
  },

  titleShape3: {
    position: "absolute",
    left: 60,
  },

  titleText2: {
    fontSize: hp("2.5%"),
    marginTop: hp("1%"),
    color: "#1571ba",
  },

  dscpWrapper: {
    marginTop: 30,
  },

  dscpText: {
    textAlign: "center",
    fontSize: hp("2%"),
    color: "#575757",
  },

  buttonWrapper: {
    backgroundColor: "#1571ba",
    width: wp("92%"),
    paddingVertical: 14,
    borderRadius: 3,
    marginTop: 50,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: hp("1.9%"),
  },

  welcomeButtonStyle: {
    backgroundColor: "#1571ba",
    width: responsiveWidth(88),
    height: responsiveHeight(5.5),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
})
