import React, { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Button } from 'src/components/Button/Button';
import { Text } from '../Text/CustomText';
import { Wrapper } from '../View/Wrapper';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { stateObject } from 'src/utils/state';
import Divider from '../Row/Divider';
import { GlobalHeaderWithIcon } from '../Header/Header';
import { $Border } from 'src/utils/stylehelper';

let i = 0, defaultPinLength = 6
const PinViews = props => {
	const { pinLength, customBtnText, customBtnCallback, onComplete } = props
	const _pinLength = pinLength || defaultPinLength
	const [pin, setPin, resetForm] = stateObject(
		Array.generateEmpty(_pinLength, true).reduce((obj, cur, i) => {
			obj[i] = cur
			return obj
		}, {})
	)
	const pinClick = btn => {
		if (btn == 'del') {
			console.debug(i, pin)
			if (i >= 0) {
				setPin({ [i]: '' })
				if (i != 0) i--
			}
		} else if (!['del', '~'].includes(btn)) {
			if (i < _pinLength) {
				setPin({ [i]: btn })
				i++
			}
		}
	}
	useEffect(() => {
		i = 0
		resetForm()
	}, [])
	return <View style={{ flex: 1, justifyContent: 'space-between' }}>
		<Wrapper justify="flex-start">
			<Button padding={7} onPress={props.onPressBack} color="link" style={{ paddingHorizontal: 15, marginRight: 10 }}>
				<Icon name="arrow-left" size={20} color="white" />
			</Button>
			<View style={{ justifyContent: 'center' }}>
				<Text color="whiteColor">{props.name || 'PIN'}</Text>
			</View>
		</Wrapper>
		<View style={{ alignSelf: 'center', flex: 1, justifyContent: 'center', alignItems: "center" }}>
			{props.title}
			<View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
				{
					Object.keys(pin).map((item, i) => {
						let txt = pin[item]
						return <View key={i} style={{
							backgroundColor: txt ? ColorsList.whiteColor : ColorsList.primary,
							borderRadius: 10,
							padding: 10,
							margin: 2,
							width: 30,
							height: 30
						}} />
					})
					// [
					// 	Array.generateEmpty(pinLength).map((item, i) => {
					// 		let txt = pin[item]
					// 		return <View key={i} style={{
					// 			backgroundColor: txt ? ColorsList.whiteColor : ColorsList.primary,
					// 			borderRadius: 10,
					// 			padding: 10,
					// 			margin: 2,
					// 			width: 30,
					// 			height: 30
					// 		}} />
					// 	})
					// ]
				}
			</View>
			{props.children}
		</View>
		<View>
			<FlatList
				style={{ padding: 10, }}
				data={[1, 2, 3, 4, 5, 6, 7, 8, 9, '~', 0, 'del']}
				numColumns={3}
				keyExtractor={(item, i) => i.toString()}
				renderItem={({ item, index }) => <Button
					style={{
						flex: 1,
						borderRadius: 50
					}}
					padding={20}
					textProps={{ size: 20 }}
					color={['transparent', 'whiteColor']}
					onPress={() => pinClick(item)}>
					{item == '~' ? (customBtnText ? customBtnText : '') : item.toString().toUpperCase()}
				</Button>}
			/>
		</View>
	</View>
}

let pin
const PinView = props => {
	useEffect(() => {
		pin = ''
	}, [])
	const {
		btnColor,
		pinColor,
		pinActiveColor,
		pinLength,
		customBtnText,
		customBtnCallback,
		onComplete
	} = props
	const [_pin, setPin] = useState('')
	const [_pinLength] = useState(pinLength || 6)
	const [Color] = stateObject({
		btnColor: btnColor ? btnColor : ['transparent', 'whiteColor'],
		pinColor: pinColor ? pinColor : ColorsList.primary,
		pinActiveColor: pinActiveColor ? pinActiveColor : ColorsList.whiteColor
	})
	const pinClick = btn => {
		btn = btn.toString()
		if (!['~', 'del'].includes(btn)) {
			if (pin.length < _pinLength) {
				pin += btn
				if (pin.length == _pinLength) {
					onComplete(pin, () => setPin(''))
				}
			}
		} else if (btn == 'del') {
			pin = pin.slice(0, -1)
		} else {
			customBtnCallback && customBtnCallback()
		}
		setPin(pin)
	}
	const _renderPin = () => Array.generateEmpty(_pinLength).map((item, i) => {
		let txt = _pin[item]
		return <View key={i} style={{
			backgroundColor: txt ? Color.pinActiveColor : Color.pinColor,
			borderRadius: 50,
			padding: 10,
			marginHorizontal: 10,
			width: 25,
			height: 25,
			borderColor: txt ? Color.pinActiveColor :
				Color.pinColor == ColorsList.primary ? Color.pinColor : ColorsList.greyFont,
			borderWidth: 1
		}} />
	})
	return <View style={{ flex: 1, justifyContent: 'space-between' }}>
		<GlobalHeaderWithIcon transparent={!props.notTransparent} onPressBack={props.onPressBack} title={props.name || 'PIN'} />
		<View style={{ alignSelf: 'center', flex: 1, justifyContent: 'center', alignItems: "center" }}>
			{props.title}
			<View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
				{_renderPin()}
			</View>
			{props.children}
		</View>
		<Divider />
		<View>
			<FlatList
				style={{ padding: 10, }}
				data={[1, 2, 3, 4, 5, 6, 7, 8, 9, '~', 0, 'del']}
				numColumns={3}
				columnWrapperStyle={{ justifyContent: "flex-end" }}
				keyExtractor={(item, i) => i.toString()}
				renderItem={({ item }) => <Button
					style={{
						width: "33.4%",
						borderRadius: 50,
					}}
					padding={20}
					textProps={{ size: 20 }}
					color={Color.btnColor}
					onPress={() => pinClick(item)}>
					{item == '~' ? (customBtnText ? customBtnText : '') : item.toString().toUpperCase()}
				</Button>}
			/>
		</View>
	</View>
}

export default PinView