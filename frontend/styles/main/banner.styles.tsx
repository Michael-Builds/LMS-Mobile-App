import { StyleSheet } from "react-native"
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

export const styles = StyleSheet.create({
  wrapper: {
    marginTop: 14,
    height: hp("26%"),
    marginHorizontal: 16,
  },

  container: {
    height: hp("22%"),
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: "visible",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    bottom: -hp("3%"),
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  background: {
    width: "100%",
    height: hp("27"),
    resizeMode: "stretch",
    zIndex: 1,
  },
  dot: {
    backgroundColor: "#C6C7CC",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#1571ba",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  backgroundView: {
    position: "absolute",
    zIndex: 5,
    paddingHorizontal: 18,
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  backgroundViewContainer: {
    width: responsiveWidth(45),
    height: responsiveHeight(30),
    marginTop: -50,
  },
  backgroundViewText: {
    color: "white",
    fontSize: hp("2.7%"),
  },
  backgroundViewOffer: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 5,
  },
  backgroundViewImage: {
    width: wp("38%"),
    height: hp("22%"),
    top: -15,
  },

  backgroundViewButtonContainer: {
    borderWidth: 1.1,
    borderColor: "rgba(255,255,255,0.5)",
    width: 109,
    height: 32,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  backgroundViewButtonText: {
    color: "#FFFFFF",
  },
})
