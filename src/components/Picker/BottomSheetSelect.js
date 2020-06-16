import React, { useEffect, useState, forwardRef } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button } from '../Button/Button';
import { View, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import Divider from '../Row/Divider';
import { Input } from '../Input/MDInput';
import { Icon } from 'native-base';
import PropTypes from 'prop-types'
import { $BorderRadius } from 'src/utils/stylehelper';

const BottomSheetSelect = props => {
	let rb
	const {
		refs = () => null,
		height = 250,
		renderItem = () => null,
		handleChangePicker = () => null,
		isSelect = true,
		data = [],
		sheetContent,
		value,
		style,
		label,
		font,
		noLabel,
		header,
		footer,
		closeOnSelect,
		children,
		onOpen,
		onClose,
		hideRender,
		hideRenderItem,
		buttonOverride,
		btnProps
	} = props
	useEffect(() => {
		refs(rb)
	}, [])
	const render = () => {
		return isSelect ? <View style={{ flex: 1 }}>
			{header}
			{header && <Divider />}
			{
				!hideRender ?
					data &&
						data.length > 0 ? <FlatList
							style={{ marginHorizontal: SizeList.base }}
							data={data}
							persistentScrollbar
							keyExtractor={(a, i) => i.toString()}
							renderItem={({ item, index }) => (
								<Button onPress={() => {
									handleChangePicker(item, index)
									closeOnSelect && rb.close()
								}} color="link" spaceBetween padding={SizeList.base}>
									{renderItem(item, index)}
								</Button>
							)}
						/> : children :
					hideRenderItem
			}
			<View style={{ padding: SizeList.base }}>
				{footer}
			</View>
		</View> : <View style={{ flex: 1, padding: SizeList.base }}>
				{sheetContent}
			</View>
	}
	const { borderRadius } = SizeList
	return <View>
		<RBSheet
			ref={ref => {
				if (!rb) rb = ref
			}}
			onClose={onClose}
			height={height}
			animationType="slide"
			onOpen={onOpen}
			closeOnDragDown
			customStyles={{
				wrapper: {},
				container: { backgroundColor: ColorsList.transparent },
				draggableIcon: { width: 75 }
			}}
		>
			<View style={{
				...$BorderRadius(borderRadius, borderRadius, 0, 0),
				backgroundColor: ColorsList.white,
				flex: 1,
				...style
			}}>
				{render()}
			</View>
		</RBSheet>
		{
			buttonOverride ? <Button color="link" padding={0} onPress={() => rb.open()} {...btnProps}>
				{buttonOverride}
			</Button> :
				<Button color="link" padding={0} onPress={() => rb.open()} {...btnProps}>
					<Input
						disabled
						font={font}
						label={label}
						value={value}
						noLabel={noLabel}
						style={{ width: '100%' }}
						renderRightAccessory={() => <Icon style={{ color: ColorsList.greyFont }} name='arrow-dropdown' />}
					/>
				</Button>
		}
	</View>
}

const BottomSheet = props => {
	const {
		renderButton,
		children,
		height,
		style: styleOverride,
		btnStyle: btnStyleOverride
	} = props
	return <BottomSheetSelect
		btnProps={{
			flexStart: true,
			style: btnStyleOverride
		}}
		height={height}
		style={styleOverride}
		buttonOverride={renderButton}
		sheetContent={children}
		isSelect={false}
	/>
}

BottomSheet.propTypes = {
	renderButton: PropTypes.any,
	children: PropTypes.any,
	height: PropTypes.number,
	style: PropTypes.object,
	btnStyle: PropTypes.object
}

BottomSheetSelect.propTypes = {
	refs: PropTypes.func,
	height: PropTypes.number,
	value: PropTypes.string,
	style: PropTypes.object,
	renderItem: PropTypes.func,
	label: PropTypes.string,
	font: PropTypes.string,
	noLabel: PropTypes.bool,
	header: PropTypes.any,
	handleChangePicker: PropTypes.func,
	footer: PropTypes.any,
	data: PropTypes.array,
	closeOnSelect: PropTypes.bool,
	children: PropTypes.any,
	onOpen: PropTypes.func,
	onClose: PropTypes.func,
	hideRender: PropTypes.bool,
	hideRenderItem: PropTypes.any,
	isSelect: PropTypes.bool,
	sheetContent: PropTypes.any
}


export { BottomSheet }
export default BottomSheetSelect