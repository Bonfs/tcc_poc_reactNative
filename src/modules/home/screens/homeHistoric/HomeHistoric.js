/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { DataSnapshot } from 'react-native-firebase';
import { getActivitiesRef, getUserInfo } from '../../firebaseActions';
import ActivityItems from '../../components/ActivityItems';
import styles from './styles';

let userREF = null;
let activitiesRef = null;
export default class HomeHistoric extends Component<*, *> {
	state = {
    activities: [],
    userInfo: {},
	}

	componentDidMount() {
    userREF = getUserInfo();
    userREF
      .on('value', (userSnapshot: DataSnapshot) => {
        const user = userSnapshot.toJSON();
        const userInfo = user.infos;
        // console.warn(user.infos);

        activitiesRef = getActivitiesRef();
        activitiesRef
          .on('value', (activitiesSnapshot: DataSnapshot) => {
            const activities = [];
            activitiesSnapshot.forEach((activitySnapshot: DataSnapshot) => {
              const activity = activitySnapshot.toJSON();
              activity.key = activitySnapshot.key;
              console.log(activity);
              activities.push(activity);
            });

            this.setState({ activities, userInfo });
          });

        // this.setState({ userInfo });
      });
	}

	componentWillUnmount() {
		if (userREF !== null) {
      userREF.off();
    }

    if (activitiesRef !== null) {
      activitiesRef.off();
    }
	}

  render() {
    const { activities, userInfo } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
        	style={{ flex: 1 }}
				  data={activities}
				  keyExtractor={(item) => item.key}
				  renderItem={({item}) => <ActivityItems activities={activities} userInfo={userInfo} activity={item} />}
          ItemSeparatorComponent={() => <View style={{ margin: 8 }} />}
          ListEmptyComponent={() => <Text style={styles.emptyText}>No Activities</Text>}
				/>
      </View>
    );
  }
}
