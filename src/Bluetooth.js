/**
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button
} from "react-native";
import {
  Device,
  Service,
  Characteristic,
  BleError,
  BleManager
} from "react-native-ble-plx";
import { Buffer } from "buffer";
import { CustomBluetoothProfile, DEVICE_MAC } from "./constants";

const instructions: string = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const AB = function() {
  let args = [...arguments];

  // Convert all arrays to buffers
  args = args.map(function(i) {
    if (i instanceof Array) {
      return Buffer.from(i);
    }
    return i;
  });

  // Merge into a single buffer
  let buf = Buffer.concat(args);

  // Convert into ArrayBuffer
  let ab = new ArrayBuffer(buf.length);
  let view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
};

type Props = {};
type State = {
  status: string,
  device: ?Device,
  connected: boolean
};

export default class Bluetooth extends Component<Props, State> {
  manager: BleManager;
  constructor(props: Props) {
    super(props);
    this.manager = new BleManager();
    this.state = {
      status: "Scanner Off",
      device: null,
      connected: false
    };
  }

  static navigationOptions = {
    title: "Home"
  };

  componentDidMount() {
    this.scanDevice();
  }

  componentWillUnmount() {
    this.manager.destroy();
  }

  scanDevice = async () => {
    this.manager.enable();

    this.setState({ status: "Scanner On" });
    this.manager.startDeviceScan(
      null,
      null,
      (error, scannedDevice) => {
        if (error) {
          console.warn(error);
          this.stopScan();
          return;
        }

        console.warn(scannedDevice.id);
        if (scannedDevice.id === DEVICE_MAC) {
          this.stopScan();
          this.deviceConnect(scannedDevice);
          // scannedDevice.connect();
        }
      },
      true
    );
  };

  deviceConnect = async (device: Device) => {
    const deviceConnected = await device.isConnected();

    if (deviceConnected) {
      await device.cancelConnection();
    }

    if (!deviceConnected) {
      device
        .connect()
        .then(device => {
          this.setState({ device: device, connected: true });
        })
        .catch(console.warn);
    }
  };

  stopScan = () => {
    this.setState({ status: "Scanner Off" });
    this.manager.stopDeviceScan();
  };

  isConnected = async () => {
    this.manager
      .isDeviceConnected(DEVICE_MAC)
      .then(connected => {
        alert(`${connected.toString()}`);
        Promise.resolve(connected);
      })
      .catch((error: any) => {
        console.warn(error);
        Promise.resolve(false);
      });
  };

  readDeviceCharacteristic = async () => {
    const { device } = this.state;

    this.hrmRead();
  };

  arrayToBase64 = (array, size = 3) => {
    const buffer = Buffer.alloc(size, array);
    return buffer.toString("base64");
  };

  // Heart Rate
  async hrmRead() {
    const { device } = this.state;
    const valueBase64 = Buffer.from([0x15, 0x02, 0x00]);
    let base64String = btoa(String.fromCharCode(...valueBase64));

    const buffer = Buffer.alloc(3, [0x15, 0x02, 0x00]);
    device?.discoverAllServicesAndCharacteristics().then(resultDevice => {
      console.warn(resultDevice);
      resultDevice
        .writeCharacteristicWithResponseForService(
          CustomBluetoothProfile.heartRate.service,
          CustomBluetoothProfile.heartRate.controlCharacteristic,
          buffer.toString("base64")
        )
        .then(characteristc => {
          console.log(characteristc);
          characteristc
            .writeWithResponse(buffer.toString("base64"))
            .then(c => {
              console.log(c);
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    });
    /* try {
      device
        ?.writeCharacteristicWithResponseForService(
          CustomBluetoothProfile.heartRate.service,
          CustomBluetoothProfile.heartRate.controlCharacteristic,
          base64String
        )
        .then(characteristic => {
          console.log(characteristic);
        })
        .catch(error => console.log);
    } catch (error) {
      console.log(error);
    } */
  }

  async hrmStart() {
    /* await this.char.hrm_ctrl.writeValue(AB([0x15, 0x02, 0x00]));
    await this.char.hrm_ctrl.writeValue(AB([0x15, 0x01, 0x00]));
    await this.char.hrm_ctrl.writeValue(AB([0x15, 0x01, 0x01]));

    // Start pinging HRM
    this.hrmTimer = this.hrmTimer || setInterval(() => {
      console.log('Pinging HRM')
      this.char.hrm_ctrl.writeValue(AB([0x16]));
    },12000); */
  }

  async hrmStop() {
    /* clearInterval(this.hrmTimer);
    this.hrmTimer = undefined;
    await this.char.hrm_ctrl.writeValue(AB([0x15, 0x01, 0x00])); */
  }

  // Pedometer
  readPedometer = () => {
    const { device } = this.state;
    device?.discoverAllServicesAndCharacteristics().then(results => {
      console.log(results);
      results.monitorCharacteristicForService(
        CustomBluetoothProfile.basic.service,
        CustomBluetoothProfile.pedometer.characteristicSteps,
        (error, characteristic) => {
          if (error) {
            console.warn('error');
            return;
          }
          console.log(characteristic);
          if (characteristic.value) {
            const data = Buffer.from(characteristic.value, "base64");
            console.log(data);
            const steps: number = data.readUInt16LE(1);
            console.warn(`Step: ${steps}`);
          }
        }
      );
    });
  };

  render() {
    const { status, device, connected } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcome}>{status}</Text>
        <Text style={styles.instructions}>
          {connected ? `Connected to ${device.name}` : "No connected device"}
        </Text>
        <Text style={styles.instructions}>{instructions}</Text>
        {/* <Button title="Connected" onPress={this.connect} /> */}
        <Button title="Is Connected" onPress={this.isConnected} />
        <Button
          title="Get Pedometer"
          onPress={this.readPedometer}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
