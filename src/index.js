/**
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import { SafeAreaView, StyleSheet, StatusBar, View, Text } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import colors from './theme/colors';
import AppNavigation from "./config/navigation";
import NavigationService from "./config/navigation/NavigationService";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primaryColor,
    accent: colors.secondaryColor,
  },
};

export default class App extends Component {
  render() {
    return (
      <PaperProvider theme={theme}>
        <StatusBar backgroundColor={colors.primaryDarkColor} barStyle="light-content" />
        <AppNavigation ref={ref => NavigationService.onRef(ref)} />
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
