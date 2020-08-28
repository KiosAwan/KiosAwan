import React from "react"
import LinearGradient from "react-native-linear-gradient"
import { View } from "react-native"

export default LinearBackground = props => {
	return (
		<LinearGradient
			colors={["#cd0192", "#6d1d6d"]}
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			{props.content}
		</LinearGradient>
	)
}
