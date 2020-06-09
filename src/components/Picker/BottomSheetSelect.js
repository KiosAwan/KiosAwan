import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button } from '../Button/Button';
import { View, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import Divider from '../Row/Divider';
import { Input } from '../Input/MDInput';
import { Icon } from 'native-base';

const BottomSheetSelect = props => {
	let rb
	const {
		height = 200,
		value,
		style,
		renderItem,
		label,
		noLabel,
		header,
		handleChangePicker = () => { },
		footer,
		data = [],
		closeOnSelect,
		children,
		onOpen,
		hideRender,
		hideRenderItem
	} = props
	if (props.hjd) {
		console.debug(props.renderItem({}, 0))
	}
	return <View>
		<RBSheet
			ref={ref => rb = ref}
			height={height}
			animationType="slide"
			onOpen={onOpen}
			customStyles={{
				wrapper: {},
				container: { backgroundColor: ColorsList.white },
				draggableIcon: {}
			}}
		>
			{header}
			{header && <Divider />}
			{
				!hideRender ?
					data &&
						data.length > 0 ? <FlatList
							data={data}
							persistentScrollbar
							keyExtractor={(a, i) => i.toString()}
							renderItem={({ item, index }) => (
								<Button onPress={() => {
									handleChangePicker(item, index)
									closeOnSelect && rb.close()
								}} color="link" spaceBetween padding={SizeList.secondary}>
									{renderItem(item, index)}
								</Button>
							)}
						/> : children :
					hideRenderItem
			}
		</RBSheet>
		<Button style={{ ...style }} color="link" padding={0} onPress={() => rb.open()}>
			<Input
				disabled
				label={label}
				value={value}
				noLabel={noLabel}
				style={{ width: '100%' }}
				renderRightAccessory={() => <Icon style={{ color: ColorsList.greyFont }} name='arrow-dropdown' />}
			/>
		</Button>
	</View>
}

export default BottomSheetSelect