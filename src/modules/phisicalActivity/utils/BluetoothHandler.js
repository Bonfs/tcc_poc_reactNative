/**
 * @flow
*/
import {
  Device,
  Service,
  Characteristic,
  BleError,
  BleManager
} from "react-native-ble-plx";
import { Buffer } from "buffer";
import { CustomBluetoothProfile, DEVICE_MAC } from "./constants";

// classe responsável por se conectar a Mi Band 2
export default class BluetoothHandler {
	static instance: BluetoothHandler = null;
	manager: BleManager = null;
	device: ?Device = null;
	isConnected: boolean = false;

	constructor() {
		this.manager = new BleManager();
		this.startScan = this.startScan.bind(this);
		this.deviceConnect = this.deviceConnect.bind(this);
		this.stopScan = this.stopScan.bind(this);
		this.isDeviceConnected = this.isDeviceConnected.bind(this);
	}

	static getInstance() {
		if (BluetoothHandler.instance === null) {
			BluetoothHandler.instance = new BluetoothHandler();
		}

		return BluetoothHandler.instance
	}

	startScan() {
		this.manager.enable();

		// console.log("status: Scanner On");
		return new Promise((resolve, reject) => {
				this.manager.startDeviceScan(
				  null,
				  null,
				  (error, scannedDevice) => {
						if (error) {
							// console.warn(error);
							this.stopScan();
							reject(error);
							return;
						}

						// console.log(scannedDevice.id);
						if (scannedDevice.id === DEVICE_MAC) {
							this.stopScan();
							this.deviceConnect(scannedDevice)
								.then(() => {
									// console.log('do something');
									resolve();
									// return new Promise()
								});
							// scannedDevice.connect();
						}
				  },
				  true
				);
		});
		
	}

	async deviceConnect(device: Device) {
		const deviceConnected = await device.isConnected();

		if (deviceConnected) {
			await device.cancelConnection();
		}

		if (!deviceConnected) {
			device
				.connect()
				.then(device => {
					// console.warn('connected');
					this.device = device;
					this.isConnected = true;
					return new Promise((resolve, reject) => {
						resolve(device);
					});
				})
				.catch(console.warn);
		}
	}

	stopScan() {
		this.manager.stopDeviceScan();
	}

	async isDeviceConnected() {
		this.manager
			.isDeviceConnected(DEVICE_MAC)
			.then(connected => {
				alert(`${connected.toString()}`);
				Promise.resolve(connected);
			})
			.catch((error: any) => {
				// console.warn(error);
				Promise.resolve(false);
			});
	}

	readPedometer(callback) {
		const { device } = this;
		device.discoverAllServicesAndCharacteristics()
		.then(results => {
			// console.log(results);
			results.readCharacteristicForService(
				CustomBluetoothProfile.basic.service,
				CustomBluetoothProfile.pedometer.characteristicSteps
			)
			.then((characteristic) => {
				// console.log(characteristic);
				if (characteristic.value) {
					const data = Buffer.from(characteristic.value, "base64");
					// console.log(data);
					const steps: number = data.readUInt16LE(1);
					// console.warn(`Bluetooh.Step: ${steps}`);

					callback(steps);
				}
			});
		})
		.catch(error => console.warn(error));
	}
}

/**
device.discoverAllServicesAndCharacteristics().then(results => {
			console.log(results);
			return results.monitorCharacteristicForService(
				CustomBluetoothProfile.basic.service,
				CustomBluetoothProfile.pedometer.characteristicSteps,
				(error, characteristic) => {
					if (error) {
						console.warn(error);
						return;
					}
					console.log(characteristic);
					if (characteristic.value) {
						const data = Buffer.from(characteristic.value, "base64");
						console.log(data);
						const steps: number = data.readUInt16LE(1);
						console.warn(`Step: ${steps}`);

						callback(steps);
					}
				}
			);
		});
*/
