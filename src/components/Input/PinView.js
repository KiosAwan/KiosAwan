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
		pinColor: pinColor ? pinColor : ColorsList.authBackground,
		pinActiveColor: pinActiveColor ? pinActiveColor : ColorsList.primary
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
	const _renderPin = () => Array.generateEmpty(_pinLength).rMap((item, i) => {
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
					textProps={{ size: 20}}
					textStyle={{color : ColorsList.greyFont}}
					color={Color.btnColor}
					onPress={() => pinClick(item)}>
					{item == '~' ? (customBtnText ? customBtnText : '') : item.toString().toUpperCase()}
				</Button>}
			/>
		</View>
	</View>
}

export default PinView