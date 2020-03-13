import React, { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Button } from 'src/components/Button/Button';
import { Text } from '../Text/CustomText';
import { Wrapper } from '../View/Wrapper';
import Icon from 'react-native-vector-icons/FontAwesome5'


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
				<Text color="whiteColor">PIN</Text>
			</View>
		</Wrapper>
		<View style={{ alignSelf: 'center', flexDirection: 'row', flex: 1, alignItems: 'center' }}>
			{
				[
					Array.generateEmpty(pinLength).map((item, i) => {
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
				]
			}
			{props.children}
		</View>
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