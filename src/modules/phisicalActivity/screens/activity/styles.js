import { StyleSheet } from "react-native";
import { verticalScale, scale } from "react-native-size-matters";
import colors from "../../../../theme/colors";

const styles = StyleSheet.create({
	top: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  appBar: {
  	flex: 1,
  	height: verticalScale(175),
  },
  headerContainer: {
  	flex: 1,
  	width: "100%",
		flexDirection: "row",
    justifyContent: "space-around",
  },
  text: {
  	color: "#FFF",
  	fontSize: scale(24)
  },
  textCenter: {
  	textAlign: "center"
  },
  textWeight: {
  	fontWeight: "bold"
  },
  buttonContainer: {
  	flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0
  },
  playButton: {
  	width: scale(100),
  	height: scale(100),
  	borderRadius: scale(50),
  	justifyContent: "center",
  	alignItems: "center",
  }
});

export default styles;
