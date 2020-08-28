import React from "react"
import { View } from "react-native"
import { RowChild } from "../Helper/RowChild"
import { Text } from "../Text/CustomText"

export const RowOpposite = props => (
	<View
		style={{ ...RowChild, justifyContent: "space-between", marginBottom: 5 }}>
		<Text>{props.title}</Text>
		<Text>{props.content}</Text>
	</View>
)
