import React, { useEffect } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button } from '../Button/Button';
import { View, FlatList, ViewPropTypes } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import Divider from '../Row/Divider';
import { Input } from '../Input/MDInput';
import { Icon } from 'native-base';
import PropTypes from 'prop-types'
import { $BorderRadius } from 'src/utils/stylehelper';
import { FontNameKey } from 'src/styles/typography';

const BottomSheetSelect = props => {
	let rb
	const { borderRadius } = SizeList
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
		btnProps,
		btnStyle,
		customStyle: customStyleOverride
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
				{typeof sheetContent == "function" ? sheetContent(() => rb.close()) : sheetContent}
			</View>
	}
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
				draggableIcon: { width: 75 },
				...customStyleOverride
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
				<Button color="link" padding={0} onPress={() => rb.open()} {...btnProps} style={btnStyle}>
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

const BottomSheet = _props => {
	const {
		content,
		renderButton,
		btnStyle: btnStyleOverride,
		...props
	} = _props
	return <BottomSheetSelect
		btnProps={{
			flexStart: true,
			style: btnStyleOverride
		}}
		buttonOverride={renderButton}
		sheetContent={content}
		isSelect={false}
		{...props}
	/>
}

BottomSheetSelect.propTypes = {
	btnProps: Button.propTypes,
	btnStyle: ViewPropTypes.style,
	buttonOverride: PropTypes.element,
	children: PropTypes.element,
	closeOnSelect: PropTypes.bool,
	customStyle: ViewPropTypes.style,
	data: PropTypes.array,
	footer: PropTypes.element,
	handleChangePicker: PropTypes.func,
	header: PropTypes.element,
	height: PropTypes.number,
	hideRender: PropTypes.bool,
	hideRenderItem: PropTypes.element,
	isSelect: PropTypes.bool,
	label: PropTypes.string,
	noLabel: PropTypes.bool,
	onClose: PropTypes.func,
	onOpen: PropTypes.func,
	refs: PropTypes.func,
	renderItem: PropTypes.func,
	style: PropTypes.object,
	value: PropTypes.string,
	font: PropTypes.oneOf(FontNameKey),
	sheetContent: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.func
	])
}

BottomSheet.propTypes = {
	renderButton: PropTypes.any,
	content: PropTypes.func,
	btnStyle: ViewPropTypes.style
}

export { BottomSheet }
export default BottomSheetSelect