/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import MapView, { Polyline  } from 'react-native-maps';
import moment from 'moment';
import { verticalScale } from 'react-native-size-matters';
import haversine from 'haversine';

import NavigationService from '../../../../config/navigation/NavigationService';
import styles from './styles';

export default class HistoricDetails extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Walking',
		};
	};

	calcDistance = () => {
		const { navigation } = this.props;
		const activity = navigation.getParam('activity', null);
		// console.log(activity);

		if (activity.locations.length > 0) {
			let distance = 0;
			// console.log(activity.locations);
			for (let i = 0; i < activity.locations.length-1; i++) {
				distance += haversine(activity.locations[i], activity.locations[i+1]);
			}
			return distance.toFixed(2);
		} else {
			return 0;
		}
	}

	calcCalories = () => {
		const { navigation } = this.props;
		const activity = navigation.getParam('activity', null);
		const userInfo = navigation.getParam('userInfo', null);
		// console.warn(userInfo);

		const { weight, height, gender, age } = userInfo;
		const { steps, duration } = activity;

		const durationInMinutes = duration / 60;
		const caloricSpent = (0.05 * weight) * durationInMinutes; // índice de uma caminhada leve

		return caloricSpent.toFixed(2);
	}

	toGeneralInfo = () => {
		const { navigation } = this.props;
		const activity = navigation.getParam('activity', null);
		const userInfo = navigation.getParam('userInfo', null);
		const activities = navigation.getParam('activities', null);
		NavigationService.navigate('GeneralInfo', { activity, userInfo, activities });
	}

	render() {
		const { navigation } = this.props;
		const activity = navigation.getParam('activity', null);
		/* const userInfo = navigation.getParam('userInfo', null);
		const activities = navigation.getParam('activities', null); */
		return (
			<View style={styles.container}>
				<View style={styles.stepContainer}>
					<Text style={styles.stepText}>{activity.steps ? activity.steps : 0}</Text>
					<Text style={styles.stepTextSub}>Steps</Text>
					<Text style={styles.dateText}>{moment(activity.date).format('MMM Do YY')}</Text>
				</View>

				<View style={styles.infoContiner}>
					<View>
						<Title style={styles.textData}>{activity.duration} sec</Title>
						<Title>Duration</Title>
					</View>
					<View>
						<Title style={styles.textData}>{ this.calcDistance() }</Title>
						<Title>Distance (km)</Title>
					</View>
				</View>
				<View>
					<Title style={styles.textData}>{ this.calcCalories() }</Title>
					<Title style={{ alignSelf: 'center' }}>Calories (Kcal)</Title>
				</View>
				<MapView
					minZoomLevel={0}
					showsUserLocation={false}
					followsUserLocation={false}
					cacheEnabled
					loadingEnabled
					style={{
						height: verticalScale(330),
						width: '100%',
					}}
					region={{
						latitude:  activity.startPosition.latitude,
						longitude: activity.startPosition.longitude,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
						minZoomLevel: 15,
						}
					}
				>
					<Polyline
						coordinates={activity.locations}
						strokeColor="#1aa2ff" // fallback for when `strokeColors` is not supported by the map-provider
						strokeWidth={6}
					/>
				</MapView>
				<View style={styles.moreInfoContainer}>
					<Button mode="contained" onPress={this.toGeneralInfo}>
						More Info
					</Button>
				</View>
			</View>
		);
	}
}
