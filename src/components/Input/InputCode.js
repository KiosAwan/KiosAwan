import React from 'react';
import Container from '../View/Container';
import { FlatList, View } from 'react-native';
import { Text } from '../Text/CustomText';
import Divider from '../Row/Divider';
import { Button } from '../Button/Button';
import { Icon, Title } from 'native-base';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { Wrapper } from '../View/Wrapper';
import { GlobalHeader } from '../Header/Header';
import { stateObject } from 'src/utils/state';
import Gallery from '../View/Gallery';

const InputCode = ({ navigation }) => {
	const [state, setState] = stateObject(navigation.state.params)
	const onPress = btn => {
		let value = state.value
		if (!['~', 'del'].includes(btn)) {
			if (state.value.length < codeLength - 1)
				value += btn
			else {
				if (state.value.length < codeLength)
					value += btn
				onResolve(value, navigation.goBack)
			}
		} else if (btn == 'del') {
			value = value.slice(0, -1)
		}
		setState({ value })
	}
	const {
		title = '',
		value = '',
		secureTextEntry = false,
		codeLength = 4,
		header,
		footer,
		onResolve = () => null,
		headerProps: headerPropsOverride,
		codeProps: codePropsOverride,
		keyboardProps: keyboardPropsOverride
	} = state
	const codeProps = {
		secureTextEntry,
		header,
		footer,
		codeLength,
		value,
		...codePropsOverride
	}
	const keyboardProps = { onPress, ...keyboardPropsOverride }
	return <Container>
		<GlobalHeader onPressBack={() => navigation.goBack()} title={title} {...headerPropsOverride} />
		<View style={{ flex: .6 }}>
			<Code {...codeProps} />
		</View>
		<View style={{ flex: .4, justifyContent: 'flex-end' }}>
			<Divider size={1.5} style={{ marginHorizontal: SizeList.bodyPadding }} />
			<Keyboard {...keyboardProps} />
		</View>
	</Container>
}

const Code = ({
	header,
	footer,
	codeLength,
	value,
	width = 35,
	height = 35,
	secureTextEntry
}) => {
	return <View>
		<View style={{ marginHorizontal: SizeList.bodyPadding }}>
			{header}
		</View>
		<Wrapper style={{ marginVertical: SizeList.base * 2 }} center>
			{
				Array.generateEmpty(codeLength).rMap(i => {
					return <View _style={{ marginHorizontal: SizeList.secondary }} style={{ justifyContent: 'center', width, height, backgroundColor: ColorsList.white }}>
						{
							secureTextEntry ?
								value[i] && <View style={{ borderRadius: 50, alignSelf: "center", padding: SizeList.secondary, backgroundColor: ColorsList.greyFontHard }} /> :
								<Text align="center" font="SemiBold" color="greyFontHard" >{value[i]}</Text>
						}
					</View>
				})
			}
		</Wrapper>
		<View style={{ marginHorizontal: SizeList.bodyPadding }}>
			{footer}
		</View>
	</View>
}

const Keyboard = ({ onPress }) => {
	const renderItem = ({ item }) => {
		return <Button
			onPress={() => onPress(item)}
			disabled={item == '~'}
			style={{ flex: 1, marginVertical: SizeList.secondary }}
			textProps={{ size: 17 }}
			color={['transparent', 'greyFontHard']}>
			{
				item == '~' ?
					'' :
					item == 'del' ?
						<Icon name="backspace" style={{ color: ColorsList.greyFontHard }} /> :
						item
			}
		</Button>
	}
	return <Gallery
		numColumns={3}
		data={[1, 2, 3, 4, 5, 6, 7, 8, 9, '~', 0, 'del']}
		keyExtractor={(a, i) => i.toString()}
		renderItem={renderItem}
	/>
}

export default InputCode


/* navigation.navigate('/input-code', {
	// Wajib
	value: '',
	onResolve: (code, close) => {
		console.debug(code)
		// close()
	},

	// Ga Wajib
	header: () => <Text align="center">headerr</Text>,
	footer: () => <Text align="center">footer</Text>,
	secureTextEntry: true,
	codeLength: 4,
	codeProps: {},
	headerProps: {},
	keyboardProps: {},
}) */