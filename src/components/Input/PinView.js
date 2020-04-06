import React, { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Button } from 'src/components/Button/Button';
import { Text } from '../Text/CustomText';
import { Wrapper } from '../View/Wrapper';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { stateObject } from 'src/utils/state';
import Divider from '../Row/Divider';

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

const PinView = props => {
	const { pinLength, customBtnText, customBtnCallback, onComplete } = props
	const [pin, setPin] = useState('')
	const [_pinLength, setPinLength] = useState(6)
	const pinClick = btn => {
		if (!['~', 'del'].includes(btn)) {
			let pinDone = pin.toString() + btn
			if (pin.length < _pinLength) setPin(pinDone)
			if (pinLength - 1 == pin.length) {
				onComplete(pinDone, () => setPin(''))
			}
		} else if (btn == 'del') {
			let deleted = pin.substr(0, pin.length - 1)
			setPin(deleted)
		} else {
			customBtnCallback && customBtnCallback()
		}
	}
	const _renderPin = () => Array.generateEmpty(pinLength).map((item, i) => {
		let txt = pin[item]
		return <View key={i} style={{
			backgroundColor: txt ? ColorsList.whiteColor : ColorsList.primary,
			borderRadius: 50,
			padding: 10,
			marginHorizontal: 10,
			width: 30,
			height: 30
		}} />
	})
	useEffect(() => {
		if (pinLength) {
			setPinLength(pinLength)
		}
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
					_renderPin()
				}
			</View>
			{props.children}
		</View>
		<Divider size={.3} />
		<View>
			<FlatList
				style={{ padding: 10, }}
				data={[1, 2, 3, 4, 5, 6, 7, 8, 9, '~', 0, 'del']}
				numColumns={3}
				keyExtractor={(item, i) => i.toString()}
				renderItem={({ item }) => <Button
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

export default PinView