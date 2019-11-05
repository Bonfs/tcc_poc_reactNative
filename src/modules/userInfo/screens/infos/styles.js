import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import colors from "../../../../theme/colors";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: scale(8),
	},
	imcContainer: {
		width: "100%",
		marginTop: verticalScale(32),
		justifyContent: "center",
		alignItems: "center"
	},
	bmiText: {
		fontSize: scale(36),
		fontWeight: "bold",
		color: "#333"
	},
	headerButton: {
		marginRight: scale(12)
	},
	headerButtonText: {
		color: "#fff",
		fontSize: scale(18)
	}
});

export default styles;
