import { StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import colors from '../../../../theme/colors';

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	stepContainer: {
		alignItems: 'center',
	},
	stepText: {
		fontSize: scale(46),
	},
	stepTextSub: {
		fontSize: scale(30),
		fontWeight: 'bold',
	},
	dateText: {
		fontWeight: '200',
	},
	textData: {
		fontSize: scale(24),
		alignSelf: 'center'
		// marginLeft: scale(20)
	},
	infoContiner: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	moreInfoContainer: {
		padding: scale(16),
		position: 'absolute',
    bottom: 0,
		left: 0,
		right: 0
	}
});

export default styles;
