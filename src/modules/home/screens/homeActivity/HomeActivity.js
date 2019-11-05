/**
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { PermissionsAndroid, View, Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Button, Snackbar  } from 'react-native-paper';
import { DataSnapshot } from 'react-native-firebase';
import NavigationService from '../../../../config/navigation/NavigationService';
import BluetoothHandler from '../../../phisicalActivity/utils/BluetoothHandler';
import Map from '../../components/map';
import { getActivitiesRef } from '../../firebaseActions';
import styles from './styles';

let activitiesRef = null;
export default class HomeActivity extends Component {
  constructor(props) {
    super(props);
    this.requestLocationPermission = this.requestLocationPermission.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.goToPhisicalActivity = this.goToPhisicalActivity.bind(this);

    this.state = {
      mapPos: undefined,
      visible: false,
      bluetoothHandler: BluetoothHandler.getInstance(),
      watchID: '',
    }
  }

  componentDidMount() {
    // console.warn(PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION));
    this.requestLocationPermission();
    activitiesRef = getActivitiesRef();
    activitiesRef
      .once('value', (activitiesSnapshot) => {
        activitiesSnapshot.forEach((activitySnapshot) => {
          const activity = activitySnapshot.toJSON();
          activity.key = activitySnapshot.key;
          if (!activity.finished) {
            // goto activityScreen
            NavigationService.navigate('Activity', { activity });
            // console.warn("has unfinished activity");
          }
        })
      });

    const { bluetoothHandler } = this.state;
      bluetoothHandler
        .startScan()
        .then(() => {
          console.log('conected');
          this.setState({ visible: true });
        })
        .catch(error => console.warn(error));
  }

  componentWillUnmount() {
    if (activitiesRef !== null) {
      activitiesRef.off();
    }
    /* if (this.state.watchID === 0) {
      Geolocation.clearWatch(this.state.watchID);
    } */
  }

  checkIfHasStartedActivities() {}

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App Location Permission',
          message:
            'TCC POC RN needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can get user location');
        this.getLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
          console.log(position);
          const { latitude, longitude } = position.coords;
          const mapPos = {
            latitude,
            longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
            minZoomLevel: 15,
        };
        // console.warn(mapPos);
        this.setState({ mapPos });
      },
      (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
          if (error.code === 1) {
            this.requestLocationPermission();
          }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    const watchID = Geolocation.watchPosition(
      (position) => {
          console.log(position);
          const { latitude, longitude } = position.coords;
          const mapPos = {
            latitude,
            longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
            minZoomLevel: 15,
        };
        // console.warn(mapPos);
        this.setState({ mapPos });
      },
      (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
          if (error.code === 1) {
            this.requestLocationPermission();
          }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    
    console.log(`watchID: ${watchID}`); 
    this.setState({ watchID });
  }

  goToPhisicalActivity() {
    requestAnimationFrame(() => {
      const { mapPos } = this.state;
      // console.warn("pressed");
      NavigationService.navigate("Activity", { initialMapPos: mapPos });
    });
  }

  render() {
    const { mapPos, visible } = this.state;
    return (
      <View style={{ flex: 1 }}>        
        {
          mapPos
            ? (
              <Map showsUserLocation mapPos={mapPos} />
            )
            : (
              <Map showsUserLocation />
            )
        }
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.goToPhisicalActivity}
            mode="contained"
            style={{ width: '100%', borderRadius: 50, }}
          >
            Start
          </Button>
        </View>
        <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
        >
          Conected!
        </Snackbar>
      </View>
    );
  }
}

