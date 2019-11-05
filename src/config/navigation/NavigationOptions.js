/**
 * @format
 * @flow
 */
import React from "react";
import { Platform } from "react-native";
import { StackNavigatorConfig, BottomTabNavigatorConfig } from "react-navigation";
import Icon from "react-native-vector-icons/dist/MaterialIcons";
import { auth } from "../firebaseConstants";
import colors from "../../theme/colors";

export const stackOptions: StackNavigatorConfig = {
  initialRouteName: auth().currentUser === null ? "UserInfo" : "Home", // "Home"
  // initialRouteName: "GeneralInfo", // "Home"
  headerMode: Platform.OS === "ios" ? "float" : "screen",
  headerTransitionPreset: "fade-in-place",
  defaultNavigationOptions: {
    headerBackTitle: null,
    headerStyle: {
      backgroundColor: colors.primaryColor
    },
    headerTintColor: colors.onPrimary,
    headerTitleStyle: {
      fontWeight: "bold"
    }
  }
};

export const bottomTabOptions: BottomTabNavigatorConfig = {
  defaultNavigationOptions : ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Home') {
        iconName = 'home';
      } else if (routeName === 'Historic') {
        iconName = 'history';
      } else {
        iconName = 'home';
      }
  
      // You can return any component that you like here!
      return <Icon name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: colors.primaryColor,
    inactiveTintColor: 'gray',
  },
};
