import React, { useEffect } from 'react';
import Container, { Body } from 'src/components/View/Container';
import { stateObject } from 'src/utils/state';
import {
	Platform,
	View,
	DeviceEventEmitter,
	Switch,
	ToastAndroid,
} from "react-native"
import { BluetoothManager } from "react-native-bluetooth-escpos-printer"
import Storage from "src/utils/keyStores"
import { GlobalHeader } from "src/components/Header/Header"
import { Button, BottomButton } from "src/components/Button/Button"
import { Text } from "src/components/Text/CustomText"
import { Wrapper } from "src/components/View/Wrapper"
import { ColorsList } from "src/styles/colors"
import { useSelector, useDispatch } from "react-redux"
import { addPrinter } from "src/redux/actions/actionsPrinter"
import { prettyConsole } from "src/utils/authhelper"
import Icon from "react-native-vector-icons/FontAwesome5"
import { SizeList } from "src/styles/size"

let _listeners = []

const Perangkat = ({ navigation }) => {
	const dispatch = useDispatch()
	const Printer = useSelector(state => state.Printer)
	const [state, setState] = stateObject({
		devices: null,
		bleOpend: false,
		loading: true,
		printEnable: null,
		printData: null,
		multi: true,
		singlePrintData: null,
	})
	const connectBluetooth = async printer => {
		try {
			await BluetoothManager.connect(printer.boundAddress)
			setState({ printEnable: printer, bleOpend: true })
		} catch (e) {
			switchBluetooth(true)
		}
	}
	const switchBluetooth = async v => {
		setState({ loading: true })
		let bt
		try {
			if (v) {
				bt = await BluetoothManager.enableBluetooth()
				setState({
					bleOpend: true,
					loading: false,
					pairedDs: bt.map(pair => JSON.parse(pair)),
				})
			} else {
				bt = await BluetoothManager.disableBluetooth()
				setState({
					bleOpend: false,
					loading: false,
					foundDs: [],
					pairedDs: [],
				})
			}
		} catch (err) {
			setState({ loading: false })
			alert(err)
		}
	}
	const componentDidMount = async () => {
		const connectedPrinter = await Storage.getItem("@connected_printer")
		if (connectedPrinter) {
			dispatch(addPrinter(JSON.parse(connectedPrinter)))
		}
		const bluetoothOn = await BluetoothManager.isBluetoothEnabled()
		setState({ bleOpend: bluetoothOn, loading: false })
		if (Platform.OS === "android") {
			_listeners.push(
				DeviceEventEmitter.addListener(
					BluetoothManager.EVENT_CONNECTION_LOST,
					() => {
						setState({
							name: "",
							boundAddress: "",
						})
					},
				),
				DeviceEventEmitter.addListener(
					BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
					() => {
						ToastAndroid.show(
							"Device Not Support Bluetooth !",
							ToastAndroid.LONG,
						)
					},
				),
			)
		}
	}
	useEffect(() => {
		componentDidMount()
		return () => _listeners = []
	}, [])
	return <Container>
		<GlobalHeader
			onPressBack={() => navigation.goBack()}
			title="PERANGKAT"
		/>
		<Wrapper style={{ paddingHorizontal: SizeList.bodyPadding }} spaceBetween>
			<Text>Pairing perangkat melalui bluetooth</Text>
			<Switch
				thumbColor={state.bleOpend ? ColorsList.primary : ColorsList.greyFont}
				trackColor={{ true: ColorsList.primaryColor, false: ColorsList.greyFont }}
				value={state.bleOpend}
				onValueChange={switchBluetooth}
			/>
		</Wrapper>
		<Body>
			{Printer.data.length > 0 && Printer.data.rMap(printer =>
				<Button onPress={() => connectBluetooth(printer)} radius={SizeList.borderRadius} color={["white"]} style={{ marginBottom: SizeList.base }} spaceBetween>
					<Icon size={20} name="print" color={ColorsList.greyFont} />
					<View style={{ paddingHorizontal: SizeList.base }} _flex>
						<Text font="SemiBold">{printer.name || "UNKNOWN"}</Text>
						<Text>{printer.boundAddress}</Text>
					</View>
					<Text color={state.bleOpend && state.printEnable && state.printEnable.boundAddress === printer.boundAddress ? "success" : "danger"}>{state.bleOpend && state.printEnable && state.printEnable.boundAddress === printer.boundAddress ? 'TERHUBUNG' : 'BELUM TERHUBUNG'}</Text>
				</Button>
			)}
		</Body>
		<BottomButton onPress={() => navigation.navigate('/printer/add')}>Tambah Perangkat</BottomButton>
	</Container>
}

export default Perangkat