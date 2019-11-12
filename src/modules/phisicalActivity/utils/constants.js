// @flow

export const CustomBluetoothProfile = {
  basic: {
    service: "0000fee0-0000-1000-8000-00805f9b34fb",
    service2: "0000fee1-0000-1000-8000-00805f9b34fb",
    batteryCharacteristic: "00000006-0000-3512-2118-0009af100700"
  },
  heartRate: {
    service: "0000180d-0000-1000-8000-00805f9b34fb",
    measurementCharacteristic: "00002a37-0000-1000-8000-00805f9b34fb",
    descriptor: "00002902-0000-1000-8000-00805f9b34fb",
    controlCharacteristic: "00002a39-0000-1000-8000-00805f9b34fb"
  },
  pedometer: {
    characteristicSteps: "00000007-0000-3512-2118-0009af100700"
  }
};

export const DEVICE_MAC = "E7:75:2F:8B:C4:98";
