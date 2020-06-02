import React, { useState, useEffect, cloneElement } from 'react'
import { TextField } from "react-native-material-textfield"
import { ColorsList } from 'src/styles/colors'
import { Button } from '../Button/Button'
import { Icon } from 'native-base'
import { Image } from '../CustomImage'
import { Animated, View, FlatList, TouchableOpacity, TextInput as TextInputRN } from 'react-native';
import { FontName } from 'src/styles/typography'
import Divider from '../Row/Divider'
import { stateObject } from 'src/utils/state'
import { SizeList } from 'src/styles/size'
import { Wrapper } from '../View/Wrapper'
import { Text } from '../Text/CustomText'

const MDInput = props => {
	let objCurrency = {}
	const { lineWidth, onChangeText, value, renderLeftAccessory, renderRightAccessory, onFocus, onBlur, style } = props
	const _render = (render, isRight) => {
		return typeof render == 'function' && <View style={{ marginBottom: 8 }}>
			<View style={isRight ? { marginLeft: 5 } : { marginRight: 5 }}>
				{render()}
			</View>
			<Divider style={{ marginTop: 5 }} color={On.color} size={focused ? On.size : (lineWidth != undefined ? lineWidth : On.size)} />
		</View>
	}
	const [tintColor, baseColor] = [ColorsList.primary, ColorsList.secondary]
	const [focused, setFocused] = useState(false)
	const [On, setOn] = stateObject({
		color: baseColor,
		size: .5
	})
	if (props.currency) {
		objCurrency.keyboardType = 'number-pad'
		if (typeof onChangeText == 'function') {
			objCurrency.onChangeText = text => {
				let txt = text.extractNumber().convertRupiah()
				onChangeText(txt)
			}
		}
		if (typeof value == 'string') {
			objCurrency.value = value.extractNumber().convertRupiah()
		}
	}
	const { ..._style } = style
	const refControl = () => {
		// if (refs) {
		// }
	}
	return <View style={{ flexDirection: 'row', alignItems: 'flex-end', ...props.inputStyle }}>
		{_render(renderLeftAccessory)}
		<View style={{ flex: 1 }}>
			<TextField
				ref={refControl}
				fontSize={13}
				textColor={ColorsList.text}
				tintColor={tintColor}
				baseColor={baseColor}
				{...props}
				onFocus={() => {
					setFocused(true)
					setOn({ color: tintColor, size: 2 })
					if (typeof onFocus == 'function') onFocus()
				}}
				onBlur={() => {
					setFocused(false)
					setOn({ color: baseColor, size: .5 })
					if (typeof onBlur == 'function') onBlur()
				}}
				style={{ fontFamily: FontName.Regular, ..._style }}
				{...objCurrency}
			/>
		</View>
		{_render(renderRightAccessory, true)}
	</View>
}

const Input = props => {
	const { value, accessoryOut, onFocus, onBlur, renderLeftAccessory, renderRightAccessory, ..._props } = props
	const [focus, setFocus] = useState(false)
	const color = () => {
		if (focus) {
			return {}
		}
		if (!focus && !value) {
			return {}
		}
		return {
			baseColor: ColorsList.primary,
			tintColor: ColorsList.primary
		}
	}
	const renderInput = props => <MDInput _flex {...props}
		{...color()}
		onFocus={() => {
			setFocus(true)
			if (typeof onFocus == 'function') onFocus()
		}}
		onBlur={() => {
			setFocus(false)
			if (typeof onBlur == 'function') onBlur()
		}}
		disabledLineWidth={0} lineWidth={0} inputStyle={{
			elevation: SizeList.secondary,
			borderRadius: SizeList.secondary,
			paddingHorizontal: SizeList.base,
			backgroundColor: ColorsList.white,
			...props.inputStyle
		}} style={props.style} />
	if (accessoryOut) {
		return <Wrapper spaceBetween>
			{typeof renderLeftAccessory == 'function' && cloneElement(renderLeftAccessory(), {
				_style: { marginRight: SizeList.base }
			})}
			{renderInput(_props)}
			{typeof renderRightAccessory == 'function' && cloneElement(renderRightAccessory(), {
				_style: { marginLeft: SizeList.base }
			})}
		</Wrapper>
	}
	return renderInput(props)
}

const TextInput = props => {
	return <TextInputRN {...props} />
}

const AutoCompleteInput = props => {
	const { data, renderItem, onChangeText, onSelect } = props
	const [visible, setVisible] = useState(false)
	const _onSelect = (item, index) => {
		setVisible(false)
		if (onSelect) onSelect(item, index)
	}
	const _renderItem = (item, index) => {
		if (renderItem) {
			return [
				<TouchableOpacity activeOpacity={1} onPress={() => _onSelect(item, index)} style={{ padding: 10 }} color="link">
					{renderItem(item, index)}
				</TouchableOpacity>,
				data.length - 1 != index && <Divider />
			]
		} else {
			return <View />
		}
	}
	const _onChange = text => {
		setVisible(true)
		if (onChangeText) onChangeText(text)
	}

	return <View>
		<MDInput {...props}
			onFocus={() => setVisible(true)}
			onChangeText={_onChange}
		/>
		<View style={!visible && { display: 'none' }}>
			<TouchableOpacity onPress={() => setVisible(false)} activeOpacity={1} style={{
				position: 'absolute',
				width: '100%',
				zIndex: 555,
				height: 9999,
				top: -999
			}} />
			<FlatList style={{
				top: -7,
				position: 'absolute',
				width: '100%',
				// maxHeight: 150,
				zIndex: 1000,
				backgroundColor: ColorsList.whiteColor,
				elevation: 2
			}}
				data={data}
				keyExtractor={(item, i) => i.toString()}
				renderItem={({ item, index }) => _renderItem(item, index)}
			/>
		</View>
	</View>
}


const MDInputV2 = props => {
	const [visible, setVisible] = useState({
		left: true,
		right: true
	})
	const { onPressLeft, onPressRight, focusLeft, focusRight } = props
	const right = () => {
		const btn = <Button color="link" onPress={onPressRight} disabled={!onPressRight}>
			<Image style={{ width: 20, height: 20 }} source={require('src/assets/icons/circlereject.png')} />
		</Button>
		if (focusRight) {
			if (visible.right) {
				return btn
			} else {
				return null
			}
		}
		return btn
	}
	const focus = () => {
		Animated.timing(LeftValue, {
			toValue: leftRef.layout.width,
			duration: 1000
		}).start()
	}
	// setVisible({ left: true, right: true })
	const blur = () => Animated.timing(LeftValue, {
		toValue: 0,
		duration: 1000
	}).start()
	// setVisible({ left: false, right: false })
	useEffect(() => {
		if (focusLeft) setVisible({ ...visible, left: false })
		if (focusRight) setVisible({ ...visible, right: false })
	}, [])
	const LeftValue = new Animated.Value(0)
	const [leftRef, setLeftRef] = useState()
	const _style = () => {
		console.debug(LeftValue._value > 0)
		//  && { width: LeftValue }
	}
	return <MDInput
		renderLeftAccessory={() => <Animated.View onLayout={({ nativeEvent }) => setLeftRef(nativeEvent)} style={_style()}>
			<Button color="link" onPress={onPressLeft} disabled={!onPressLeft}>
				<Icon _width="10%" size={15} style={{ color: ColorsList.primary }} name="search" />
			</Button>
		</Animated.View>
		}
		renderRightAccessory={right}
		onFocus={focus}
		onBlur={blur}
		{...props}
	/>
}

export default MDInput
export { AutoCompleteInput, MDInputV2, Input, TextInput }