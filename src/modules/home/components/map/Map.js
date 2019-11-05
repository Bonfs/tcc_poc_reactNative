/**
 * @flow 
 * */
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import MapView from 'react-native-maps';

type P = {
    showsUserLocation: boolean,
    followsUserLocation: boolean,
    height: number,
    mapPos: any,
    liteMode: boolean,
    markerColor: string,
};

type S = {};

export default class Map extends PureComponent<P, S> {
    static defaultProps = {
        mapPos: {
            latitude: -3.74259555,
            longitude: -38.500003998674366,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
            minZoomLevel: 15,
        },
        street: "TCC POC React Native",
        height: "100%",
        showsUserLocation: false,
        followsUserLocation: false,
        liteMode: false,
        markerColor: 'red',
    };

    render() {
        const { showsUserLocation, followsUserLocation, height, mapPos } = this.props;
        return (
            <MapView
                minZoomLevel={0}
                showsUserLocation={showsUserLocation}
                followsUserLocation={followsUserLocation}
                cacheEnabled
                loadingEnabled
                style={{
                    height,
                    width: '100%',
                }}
                region={mapPos}
            />
        );
    }
}
