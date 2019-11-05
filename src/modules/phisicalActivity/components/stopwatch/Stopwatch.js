/**
 * @flow
 */
import React, { PureComponent } from "react";
import { Text, View } from "react-native";
import TimeFormatter from "minutes-seconds-milliseconds";
import moment from "moment";
import Timer from "react-native-timer";
import styles from "./styles";

type P = {
  isRunning: boolean,
  timer: number,
  setTimer: (time: number) => void
};

type S = {};

class Stopwatch extends PureComponent<P, S> {
	constructor(props: P) {
    super(props);

    this.timeCounter = this.timeCounter.bind(this);
  }

	componentDidMount() {
		this.timeCounter();
	}

	componentWillUnmount() {
		Timer.clearTimeout(this);
  }

	timeCounter() {
		const { isRunning, timer, setTimer } = this.props;
		Timer.setTimeout(
			this,
			"counter",
			() => {
				if (isRunning) {
					setTimer(timer + 1);
				}
				this.timeCounter();
			},
			1000
		);
	}

	render() {
		const { timer } = this.props;
		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.timer}>{ moment().hour(0).minute(0).second(timer).format("HH:mm:ss") }</Text>
				</View>
			</View>
		);
	}
}

export default Stopwatch;
