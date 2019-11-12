 /**
 * @flow
 */
import React, { Component } from 'react';
import { View, SafeAreaView, TouchableOpacity, Alert, BackHandler } from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Text } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import Timer from 'react-native-timer';
import haversine from 'haversine';
import NavigationService from '../../../../config/navigation/NavigationService';
import { startActvity, updateActivity } from '../../firebaseActions';
import Map from '../../../home/components/map';
import Stopwatch from '../../components/stopwatch';
import BluetoothHandler from '../../utils/BluetoothHandler';
import styles from './styles.js';

type MapPos = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
  minZoomLevel: number,
};

type Location = {
  time: number,
  latitude: number,
  longitude: number,
  accuracy: number,
  speed: number
}

type P = {
  navigation: any,
};

type S = {
  bluetoothHandler: BluetoothHandler,
  distance: number,
  timer: number,
  beatHeart: number,
  mapPos: MapPos,
  isRunning: boolean,
  started: boolean,
  startSteps: number,
  steps: number,
  activityKey: string,
  locations: Array<Location>
};

let pedometerSubscription = null; 
export default class Activity extends Component<P, S> {
    static navigationOptions = ({ navigation }) => {
      return {
        header: null
      };
    };

    constructor(props: P) {
      super(props);
      const { navigation } = props;
      const initialMapPos = navigation.getParam('initialMapPos', null);
      this.requestLocationPermission = this.requestLocationPermission.bind(this);
      this.getLocation = this.getLocation.bind(this);
      this.handleStartStop = this.handleStartStop.bind(this);
      this.setTimer = this.setTimer.bind(this);
      this.exitActivity = this.exitActivity.bind(this);
      this.startPedometerReader = this.startPedometerReader.bind(this);

      this.state = {
        bluetoothHandler: BluetoothHandler.getInstance(),
        mapPos: initialMapPos,
        distance: 0.0,
        timer: 0,
        beatHeart: 80, // TODO get from miband,
        isRunning: false,
        started: false,
        activityKey: "",
        startSteps: -1,        
        steps: 0,
        locations: [],
        watchID: '',
      }
    }

  componentDidMount() {
      const { navigation } = this.props;
      const activity = navigation.getParam('activity', null);

      if (activity) {
        this.setState({
          started: activity.started,
          locations: activity.locations,
          activityKey: activity.key
        });
      }
      
      BackHandler.addEventListener('hardwareBackPress', this.exitActivity);
      BackgroundGeolocation.configure({
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 50,
        distanceFilter: 50,
        notificationTitle: 'Background tracking',
        notificationText: 'enabled',
        debug: false, // __DEV__,
        startOnBoot: false,
        stopOnTerminate: true,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: __DEV__ ? 10000 : 30000,
        fastestInterval: __DEV__ ? 5000 : 45000,
        activitiesInterval: 10000,
        stopOnStillActivity: false,
      });

      BackgroundGeolocation.on('location', (location: Location) => {
        // handle your locations here
        // to perform long running operation on iOS
        // you need to create background task
        BackgroundGeolocation.startTask((taskKey: any) => {
          // execute long running task
          // eg. ajax post location
          // IMPORTANT: task has to be ended by endTask
          // console.warn(location);
          const { activityKey, locations } = this.state;
          const newLocation = { latitude: location.latitude, longitude: location.longitude };
          locations.push(newLocation);
          const newMapPos: MapPos = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
            minZoomLevel: 15,
          }
          // console.warn(activityKey);
          this.setState({ mapPos: newMapPos, locations });
          if (activityKey)
            updateActivity(activityKey, { locations: locations });
          BackgroundGeolocation.endTask(taskKey);
        });
      });

      BackgroundGeolocation.on('stationary', (stationaryLocation: Location) => {
        // handle stationary locations here
        // Actions.sendLocation(stationaryLocation);
        // console.warn(stationaryLocation);
        const { activityKey, locations } = this.state;
        const newLocation = { latitude: location.latitude, longitude: location.longitude };
        locations.push(newLocation);
        const newMapPos: MapPos = {
            latitude: stationaryLocation.latitude,
            longitude: stationaryLocation.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
            minZoomLevel: 15,
          }
        this.setState({ mapPos: newMapPos });
        if (activityKey) {          
          updateActivity(activityKey, { locations: locations, distance: this.calcDistance() });
        }
      });

      BackgroundGeolocation.on('start', () => {
        // console.log('[INFO] BackgroundGeolocation service has been started');
      });

      BackgroundGeolocation.on('stop', () => {
        // console.log('[INFO] BackgroundGeolocation service has been stopped');
      });

      BackgroundGeolocation.on('authorization', (status: any) => {
        // console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
        if (status !== BackgroundGeolocation.AUTHORIZED) {
          // we need to set delay or otherwise alert may not be shown
          Timer.setTimeout(
            this,
            'backgroundGeolocationAuthorization',
            () => {
              Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
                { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
              ])
            },
            1000
          );
        }
      });

      BackgroundGeolocation.on('background', () => {
        // console.log('[INFO] App is in background');
      });

      BackgroundGeolocation.on('foreground', () => {
        // console.log('[INFO] App is in foreground');
      });
    }

    componentWillUnmount() {
      const { activityKey, timer, watchID } = this.state;
      BackHandler.removeEventListener('hardwareBackPress', this.exitActivity);
      Timer.clearTimeout(this);
      if (activityKey) {
        updateActivity(activityKey, { finished: true, duration: timer, distance: this.calcDistance() });
      }
      if (watchID === 0) {
        Geolocation.stop(watchID);
      }
    }

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
          // console.log('You can get location');
          this.getLocation();
        } else {
          // console.log('Location permission denied');
        }
      } catch (err) {
        // console.warn(err);
      }
    }
    
    getLocation() {
      Geolocation.getCurrentPosition(
        (position) => {
            // console.log(position);
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
            // console.log(error.code, error.message);
            if (error.code === 1) {
              this.requestLocationPermission();
            }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
  
      const watchID = Geolocation.watchPosition(
        (position) => {
            // console.log(position);
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
            // console.log(error.code, error.message);
            if (error.code === 1) {
              this.requestLocationPermission();
            }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      this.setState({ watchID });
    }

    async handleStartStop() {
      const { isRunning, started, mapPos } = this.state;
      requestAnimationFrame(() => {        
        // check if timer is running
        if (!isRunning) {
          BackgroundGeolocation.start();
        } else {
          BackgroundGeolocation.stop();
        }
        // check if activity has started
        if (!started) {
          // this.startPedometerReader();
          this.startPedometerReader();
          const activityRef = startActvity(
            {
              started: true,
              finished: false,
              date: new Date(),
              startPosition: { latitude: mapPos.latitude, longitude: mapPos.longitude },
              duration: 0,
              positions: []
            },
            () => {}
          );
          this.setState({ isRunning: !isRunning, started: true, activityKey: activityRef.key });
        } else {
          this.setState({ isRunning: !isRunning });  
        }        
      });
    }

    setTimer(time: number) {
      this.setState({ timer: time });
    }

    exitActivity() {
      const { activityKey, timer } = this.state;
      Alert.alert(
        'Exit',
        'You wish leave activity?',
        [
          {
            text: 'No',
            onPress: () => console.log('cancelled'),
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => {
              BackgroundGeolocation.stop();
              if (activityKey) updateActivity(activityKey, { finished: true, duration: timer });
              BackHandler.removeEventListener(
                'hardwareBackPress',
                this.exitActivity
              );
              NavigationService.navigate('Home');
            }
          }
        ],
        { cancelable: false }
      );
      return true;
    }

    startPedometerReader() {
      Timer.setTimeout(
        this,
        'steps',
        () => {
          const { bluetoothHandler, isRunning } = this.state;
          if (isRunning) {
          bluetoothHandler
            .readPedometer((steps) => {
              const { activityKey, startSteps } = this.state;
              if (startSteps === -1) {
                // console.warn('startSteps', steps);
                if (activityKey)
                  updateActivity(activityKey, { steps: 0 });
                this.setState({ steps: 0, startSteps: steps });
              } else {

                if (activityKey)
                  updateActivity(activityKey, { steps: steps - startSteps });
                // console.warn(steps);
                this.setState({ steps: steps - startSteps });
              }              
            });
          }
          this.startPedometerReader();
        },
        1000
      );      
    }

    calcDistance = () => {
      const { locations } = this.state;
  
      let distance = 0;
      if (locations.length > 0) {
        for (let i = 0; i < locations.length - 1; i++) {
          distance += haversine(locations[i], locations[i+1]);
        }
        // console.log(`calcDistance? ${distance}`);
        return distance.toFixed(2);
      } else {
          distance;
      }
    }

    render() {
      const { mapPos, isRunning, timer, distance, steps } = this.state;
      return (
          <SafeAreaView  style={{ flex: 1 }}>
            <Appbar style={[styles.top, styles.appBar]}>
              <View style={styles.headerContainer}>
                <View>
                  <Text style={[styles.text, styles.textCenter]}>{this.calcDistance()}KM</Text>
                  <Text style={[styles.text, styles.textWeight]}>DISTANCE</Text>
                </View>
                <View>
                  <Stopwatch isRunning={isRunning} timer={timer} setTimer={this.setTimer} />
                  <Text style={[styles.text, styles.textWeight]}>DURATION</Text>
                </View>
                <View>                  
                  <Text style={[styles.text, styles.textCenter]}>{steps}</Text>
                  <Text style={[styles.text, styles.textWeight]}>Steps</Text>
                </View>
              </View>
            </Appbar>
            {
              mapPos
                ? (
                  <View>
                    <Map showsUserLocation followsUserLocation mapPos={mapPos} />
                  </View>
                )
                : (
                  <Map showsUserLocation followsUserLocation />
                )
            }
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={this.handleStartStop}>
                <View style={[styles.playButton, { backgroundColor: isRunning ? '#DD0000' : '#27AE60' }]}>
                  <Icon name={isRunning ? 'pause' : 'play-arrow'} size={scale(50)} color='#fff' />
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
      );
    }
}
