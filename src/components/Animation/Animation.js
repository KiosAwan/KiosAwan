import React, { useState } from "react";
import { View, StyleSheet, Animated, TouchableWithoutFeedback, Text } from "react-native";

// create a component
const Animation = props => {
	const [animValue] = useState(new Animated.Value(0))
	const handleSelect = () => {
		animValue._value > 0
			? Animated.timing(animValue, {
				toValue: 0,
				duration: 5000
			}).start()
			: Animated.timing(animValue, {
				toValue: 30,
				duration: 5000
			}).start();
	}

	const renderRectangle = props => {
		return (
			<Animated.Text style={{ backgroundColor: 'blue', height: animValue }}>
				Text
			</Animated.Text>
		)
	}
	return (
		<View>
			{renderRectangle()}
			<TouchableWithoutFeedback onPress={() => handleSelect()}>
				<Text>Click Me</Text>
			</TouchableWithoutFeedback>
		</View>
	);
}

export default Animation

