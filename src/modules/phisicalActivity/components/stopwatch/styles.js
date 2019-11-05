import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	timer: {
		textAlign: "center",
		fontWeight: "bold",
		color: "#FFF",
	  	fontSize: scale(24)
	}
});

export default styles;
