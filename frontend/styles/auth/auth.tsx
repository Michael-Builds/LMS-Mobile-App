import { StyleSheet } from "react-native"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"

export const styles = StyleSheet.create({
  signInImage: {
    width: "55%",
    height: 250,
    alignSelf: "center",
    marginTop: 50,
  },

  welcomeText: {
    textAlign: "center",
    fontSize: 18,
  },

  preText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
    color: "#575757",
  },

  inputContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    rowGap: 20,
  },

  textInput: {
    height: 50,
    marginHorizontal: 16,
    borderRadius: 6,
    paddingLeft: 45,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#575757",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  icon: {
    position: "absolute",
    left: 28,
    top: 16,
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
    top: 50,
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
    fontSize: 14,
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

  verifyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  verifyHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },

  verifysubText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 22,
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: 22,
  },

  verifyInputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  verifyInputBox: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderColor: "#ddd",
    textAlign: "center",
    marginRight: 10,
    marginTop: 5,
    borderRadius: 10,
    fontSize: 20,
  },
  google: {
    height: 35,
    width: 35,
  },
})
