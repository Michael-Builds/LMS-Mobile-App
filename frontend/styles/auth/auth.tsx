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
  signInImage: {
    width: "55%",
    height: 300,
    alignSelf: "center",
    marginTop: 60,
  },

  welcomeText: {
    textAlign: "center",
    fontSize: 24,
  },

  preText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#575757",
  },

  inputContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    rowGap: 20,
  },

  textInput: {
    height: 55,
    marginHorizontal: 16,
    borderRadius: 6,
    paddingLeft: 40,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#575757",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  icon: {
    position: "absolute",
    left: 28,
    top: 17.5,
  },

  icon2: {
    position: "absolute",
    left: 28,
    top: 17.5,
    marginTop: -2,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    position: "absolute",
    top: 55,
  },

  visibleIcon: {
    position: "absolute",
    right: 30,
    top: 15,
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -1,
  },

  forgotSection: {
    marginHorizontal: 16,
    textAlign: "right",
    fontSize: 16,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },

  buttonWrapper: {
    backgroundColor: "#1571ba",
    width: wp("86%"),
    paddingVertical: 14,
    borderRadius: 5,
    marginTop: 2,
    marginLeft: "auto",
    marginRight: "auto",
  },

  signUpRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    marginBottom: 20,
    alignItems: "center",
  },

  option: {
    textAlign: "center",
    marginTop: -10,
    marginBottom: -10,
  },

  altLogins: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    gap: 20,
  },
  
})
