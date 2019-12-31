import React, { Component, useState } from 'react';
import { Animated, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';

const Animation = props => {
	const [animValue] = useState(new Animated.Value(true))
	const handleSelect = () => {
		animValue._value
			? Animated.timing(animValue, {
				toValue: true,
				duration: 500
			}).start()
			: Animated.timing(animValue, {
				toValue: false,
				duration: 500
			}).start();
	}
	const renderRectangle = () => {
		let rotateAnimation = animValue.interpolate({
			inputRange: [true, false],
			outputRange: [1, 1.5]
		});

		const customStyle = {
			height: animValue,
			transform: [{ scale: rotateAnimation }]
		};

		return (
			<Animated.View style={[styles.rectangle, customStyle]}>
				<TouchableWithoutFeedback onPress={() => handleSelect()}>
					<View style={{ flex: 1 }} />
				</TouchableWithoutFeedback>
			</Animated.View>
		)
	}
	return <View style={styles.container}>
		{renderRectangle()}
	</View>
}

export default Animation

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	rectangle: {
		backgroundColor: "#2c3e50",
		width: true
	}
});