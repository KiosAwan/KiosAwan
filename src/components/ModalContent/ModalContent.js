import React, { useEffect, useState } from "react"
import {
	View,
	Image,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from "react-native"
import { Text } from "../Text/CustomText"
import { SizeList } from "src/styles/size"
import { getImageSize } from "src/utils/authhelper"

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height
const ModalContent = props => {
	const [imageStyle, setImageStyle] = useState({})
	useEffect(() => {
		getImageSize(props.image).then(({ ratio: { width, height } }) => {
			setImageStyle({ width: width / 2, height: height / 2 })
		})
	}, [])
	return (
		<TouchableOpacity onPress={props.closeModal} style={styles.touchableStyle}>
			<View style={[styles.wrapView, props.style]}>
				<Image style={imageStyle} source={props.image} />
				<Text align="center" style={{ marginBottom: SizeList.padding }}>
					{props.infoText}
				</Text>
				{props.children && (
					<View style={{ marginBottom: SizeList.padding }}>
						{props.children}
					</View>
				)}
			</View>
		</TouchableOpacity>
	)
}
export default ModalContent

const styles = StyleSheet.create({
	touchableStyle: {
		width,
		height,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,.5)",
	},
	wrapView: {
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: SizeList.bodyPadding * 3,
		paddingHorizontal: SizeList.padding,
		backgroundColor: "white",
		borderRadius: SizeList.borderRadius,
	},
})
