/**
 * @format
 * @flow
 */
import React from 'react';
import {
  createAppContainer,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import BluetoothScreen from '../../Bluetooth';
import HomeHistoricScreen from '../../modules/home/screens/homeHistoric';
import HomeActivityScreen from '../../modules/home/screens/homeActivity';
import ActivityScreen from '../../modules/phisicalActivity/screens/activity';
import UserInfoScreen from '../../modules/userInfo/screens/infos';
import HistoricDetailScreen from '../../modules/historic/screens/historicDetails';
import GeneralInfo from '../../modules/generalInfo/screens/graphs';
import { stackOptions, bottomTabOptions } from './NavigationOptions';

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeActivityScreen,
    Historic: HomeHistoricScreen,
  },
  bottomTabOptions,
);

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: TabNavigator,
      navigationOptions: {
        title: 'TCC POC',
      }
    },
    Activity: {
      screen: ActivityScreen,
    },
    UserInfo: {
      screen: UserInfoScreen,
    },
    HistoricDetail: {
      screen: HistoricDetailScreen,
    },
    GeneralInfo: {
      screen: GeneralInfo,
      navigationOptions: {
        title: 'General Info',
      }
    },
    Bluetooth: {
      screen: BluetoothScreen,
    }
  },
  stackOptions
);

export default createAppContainer(AppNavigator);
