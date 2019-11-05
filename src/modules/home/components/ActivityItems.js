import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity  } from 'react-native';
import { scale } from 'react-native-size-matters';
import Icon from "react-native-vector-icons/dist/MaterialIcons";
import { Card, Title } from 'react-native-paper';
import moment from 'moment';

import NavigationService from '../../../config/navigation/NavigationService';
import colors from '../../../theme/colors';

const ActivityItems = ({ activity, userInfo, activities }) => ({
	render() {
		console.warn(userInfo);
		return (
			<TouchableOpacity onPress={() => NavigationService.navigate('HistoricDetail', { activity, userInfo, activities })}>
				<Card style={styles.container}>
					<Title>Walking</Title>
					<Card.Content>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<View>
								<Icon name="directions-walk" size={30} color={colors.primaryColor} />
							</View>
							<View>
								<Text>Completed on: {moment(activity.date).format('MMM Do YY')}</Text>
								<Text>Duration: {activity.duration} seconds</Text>
							</View>
						</View>
					</Card.Content>
				</Card>
			</TouchableOpacity>
		);
	}
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(8)
  },
});

export default  ActivityItems;
