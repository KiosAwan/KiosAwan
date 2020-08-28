import React, { useState } from "react"
import { Text } from "src/components/Text/CustomText"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Wrapper } from "src/components/View/Wrapper"
import { AwanPopup } from "src/components/ModalContent/Popups"
import { Button } from "src/components/Button/Button"
import { ColorsList } from "src/styles/colors"
import { SizeList } from "src/styles/size"
import Icon from "react-native-vector-icons/FontAwesome5"
import Divider from "src/components/Row/Divider"

const DropdownSelect = props => {
	const { data, placeholder, value, onSelect, renderItem, style } = props
	const [dropdownVisible, setDropdownVisible] = useState(false)
	const [nativeEvent, setNativeEvent] = useState({})
	const _layout = event => {
		const { nativeEvent } = event
		console.debug(Object.keys(event._dispatchInstances))
		setNativeEvent(nativeEvent)
	}
	return (
		<View style={{ position: "relative" }} onLayout={_layout}>
			<TouchableOpacity onPress={() => setDropdownVisible(true)}>
				<View style={[style]}>
					<Text color={!value && ColorsList.transparent}>{placeholder}</Text>
					<Wrapper justify="space-between" style={styles.selectWrapper}>
						<Text>{value ? value : placeholder}</Text>
						<Icon color={ColorsList.greyFont} size={15} name="chevron-down" />
					</Wrapper>
				</View>
			</TouchableOpacity>
			<AwanPopup.Menu
				noTitle
				visible={dropdownVisible}
				backdropDismiss={() => setDropdownVisible(false)}
				style={[styles.dropdownStyle]}
				// , nativeEvent.layout ? {
				// top: nativeEvent.layout.y + nativeEvent.layout.height
				// } : null]}
				contentStyle={[styles.dropdownContentStyle]}>
				{data.rMap((item, i) => [
					<Button
						onPress={() => {
							setDropdownVisible(false)
							onSelect({ item, index: i })
						}}
						key={i}
						wrapper={{ justify: "flex-start" }}
						color="link">
						{renderItem({ item, index: i })}
					</Button>,
					data.length - 1 != i && <Divider />,
				])}
			</AwanPopup.Menu>
		</View>
	)
}

export default DropdownSelect

const styles = StyleSheet.create({
	contentWrapper: {
		position: "absolute",
		zIndex: 1,
	},
	selectWrapper: {
		marginVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: ColorsList.greyAuthHard,
	},
	dropdownStyle: {
		top: 0,
	},
	dropdownContentStyle: {
		elevation: 3,
		backgroundColor: ColorsList.whiteColor,
	},
})
