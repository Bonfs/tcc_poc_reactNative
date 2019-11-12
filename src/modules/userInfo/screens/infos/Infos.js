/*
	@flow
*/
import React, { Component } from "react";
import { View, Text, Picker, TouchableOpacity, KeyboardAvoidingView, Platform  } from "react-native";
import firebase from "react-native-firebase";
import { TextInput, Button } from "react-native-paper";
import NavigationService from '../../../../config/navigation/NavigationService';
import { saveUserInfo } from "../../firebaseActions";
import styles from "./styles";

export class Infos extends Component {
	static navigationOptions = ({ navigation }) => {
    return {
      title: "User Info",
      /* headerRight: (
      	<TouchableOpacity
      		style={styles.headerButton}
      		onPress={navigation.getParam("handleSubmit")}
      	>
      		<Text style={styles.headerButtonText}>SAVE</Text>
      	</TouchableOpacity>
      ) */
    };
  };

  state = {
  	weight: "",
  	height: "",
  	age: "",
		gender: "",
		loading: false,
  };

	componentDidMount() {
		// this.props.navigation.setParams({ handleSubmit: this.handleSubmit });
		// sign in user
    const { currentUser } = firebase.auth();
    if (currentUser === null) {
      firebase.auth().signInAnonymously()
        .then((userCredential) => {
          const userUID = userCredential.user.uid;
        })
        .catch((error) => console.log(error));
    }
	}

	handleSubmit = () => {
		this.setState({ loading: true });
		const { weight, height, age, gender } = this.state;
		const bmi = this.calculateBMI(); const status = this.calculateStatus(bmi);

		if (!weight || isNaN(weight)) {
			alert("Weight must be a number and not be in blank");
		} else if (!height || isNaN(height)) {
			alert("Height must be a number and not be in blank");
		} else if (!age || isNaN(age)) {
			alert("Height must be a number and not be in blank");
		} else {
			saveUserInfo(
				{ weight, height, age, gender, bmi, status },
				(error) => {
					this.setState({ loading: false });
					NavigationService.reset("Home");
				}
			);
		}
	}

	calculateBMI = () => {
		const { weight, height } = this.state;
		const weightNumber = parseFloat(weight);
		const heightNumber = parseFloat(height) / 100;
		
		return (weightNumber / (heightNumber * heightNumber)).toFixed(2);
	};

	calculateStatus = (bmi) => {
		if (bmi <= 18.5) {
			return "Thin";
		} else if (bmi >= 18.6 && bmi <= 24.9) {
			return "Healthy";
		} else if (bmi >= 25 && bmi <= 29.9) {
			return "Overweight";
		} else {
			return "Obese";
		}
	};

	render() {
		const { weight, height, age, gender, loading } = this.state;
		const bmi = this.calculateBMI(); const status = this.calculateStatus(bmi);
		return (
			<KeyboardAvoidingView
				style={styles.container}
				behavior="padding"
				enabled={Platform.OS === 'ios' ? true : false}
			>
				<TextInput
					keyboardType="number-pad"
					mode='outlined'
	        label='Weight (KG)'
	        value={weight}
	        onChangeText={text => this.setState({ weight: text })}
	      />
	      <TextInput
					keyboardType="number-pad"
					mode='outlined'
	        label='Heigt (cm)'
	        value={height}
	        onChangeText={text => this.setState({ height: text })}
	      />
	      <TextInput
					keyboardType="number-pad"
					mode='outlined'
	        label='Age'
	        value={age}
	        onChangeText={text => this.setState({ age: text })}
	      />
	      <Picker
				  selectedValue={gender}
				  style={{height: 50, width: "100%"}}
				  onValueChange={(itemValue, itemIndex) =>
				    this.setState({gender: itemValue})
				  }>
				  <Picker.Item label="Select your biological sex" value="" />
				  <Picker.Item label="Male" value="male" />
				  <Picker.Item label="Female" value="female" />
				</Picker>
				<View style={styles.imcContainer}>
					<Text style={styles.bmiText}>{isNaN(bmi) ? '0' : bmi}</Text>
					<Text style={styles.bmiText}>{status.toUpperCase()}</Text>
				</View>
				<Button mode="contained" loading={loading} onPress={this.handleSubmit}>
					Save
				</Button>
			</KeyboardAvoidingView> 
		);
	}
}

export default Infos;
