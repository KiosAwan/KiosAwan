import React, { Component, Fragment } from "react"
import {
	ActivityIndicator,
	Platform,
	StyleSheet,
	View,
	Button,
	ScrollView,
	DeviceEventEmitter,
	NativeEventEmitter,
	Switch,
	TouchableOpacity,
	Dimensions,
	ToastAndroid,
	Image,
} from "react-native"
import {
	BluetoothEscposPrinter,
	BluetoothManager,
	BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer"
import { convertRupiah } from "src/utils/authhelper"
import Storage from "src/utils/keyStores"
import { ColorsList } from "src/styles/colors"
import { GlobalHeaderWithIcon } from "src/components/Header/Header"
import { connect } from "react-redux"
import { addPrinter } from "src/redux/actions/actionsPrinter"
import { FontList } from "src/styles/typography"
import { Wrapper } from "src/components/View/Wrapper"
import { Text } from "src/components/Text/CustomText"
import { $Padding } from "src/utils/stylehelper"
import Icon from "react-native-vector-icons/FontAwesome5"
import { SizeList } from "src/styles/size"
import { stylesglobe } from "src/styles/globalStyle"
import Divider from "src/components/Row/Divider"

var { height, width } = Dimensions.get("window")
class TambahPerangkat extends Component {
	_listeners = []

	constructor() {
		super()
		this.state = {
			devices: null,
			pairedDs: [],
			foundDs: [],
			bleOpend: false,
			loading: true,
		}
	}

	async componentDidMount() {
		//alert(BluetoothManager)
		BluetoothManager.isBluetoothEnabled().then(
			enabled => {
				this.setState({
					bleOpend: Boolean(enabled),
					loading: false,
				})
			},
			err => {
				err
			},
		)

		if (Platform.OS === "ios") {
			let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager)
			this._listeners.push(
				bluetoothManagerEmitter.addListener(
					BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
					rsp => {
						this._deviceAlreadPaired(rsp)
					},
				),
			)
			this._listeners.push(
				bluetoothManagerEmitter.addListener(
					BluetoothManager.EVENT_DEVICE_FOUND,
					rsp => {
						this._deviceFoundEvent(rsp)
					},
				),
			)
			this._listeners.push(
				bluetoothManagerEmitter.addListener(
					BluetoothManager.EVENT_CONNECTION_LOST,
					() => {
						this.setState({
							name: "",
							boundAddress: "",
						})
					},
				),
			)
		} else if (Platform.OS === "android") {
			this._listeners.push(
				DeviceEventEmitter.addListener(
					BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
					rsp => {
						this._deviceAlreadPaired(rsp)
					},
				),
			)
			this._listeners.push(
				DeviceEventEmitter.addListener(
					BluetoothManager.EVENT_DEVICE_FOUND,
					rsp => {
						this._deviceFoundEvent(rsp)
					},
				),
			)
			this._listeners.push(
				DeviceEventEmitter.addListener(
					BluetoothManager.EVENT_CONNECTION_LOST,
					() => {
						this.setState({
							name: "",
							boundAddress: "",
						})
					},
				),
			)
			this._listeners.push(
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
	_deviceAlreadPaired(rsp) {
		var ds = null
		if (typeof rsp.devices == "object") {
			ds = rsp.devices
		} else {
			try {
				ds = JSON.parse(rsp.devices)
			} catch (e) {}
		}
		if (ds && ds.length) {
			let pared = this.state.pairedDs
			pared = pared.concat(ds || [])
			this.setState({
				pairedDs: pared,
			})
		}
	}

	_deviceFoundEvent(rsp) {
		//alert(JSON.stringify(rsp))
		var r = null
		try {
			if (typeof rsp.device == "object") {
				r = rsp.device
			} else {
				r = JSON.parse(rsp.device)
			}
		} catch (e) {
			//alert(e.message);
			//ignore
		}
		//alert('f')
		if (r) {
			let found = this.state.foundDs || []
			if (found.findIndex) {
				let duplicated = found.findIndex(function (x) {
					return x.address == r.address
				})
				//CHECK DEPLICATED HERE...
				if (duplicated == -1) {
					found.push(r)
					this.setState({
						foundDs: found,
					})
				}
			}
		}
	}
	_renderEmpty() {
		return (
			<Wrapper>
				<Text styles={styles.wrapper}>Tidak ada perangkat</Text>
			</Wrapper>
		)
	}
	_renderRow(rows) {
		let items = []
		for (let i in rows) {
			let row = rows[i]
			if (row.address) {
				items.push(
					<Fragment>
						<TouchableOpacity
							key={new Date().getTime() + i}
							stlye={styles.wtf}
							onPress={() => {
								this.setState({
									loading: true,
								})
								BluetoothManager.connect(row.address).then(
									async s => {
										const temp_con_printer = await Storage.getItem(
											"@connected_printer",
										)
										if (temp_con_printer) {
											const parseTemp = JSON.parse(temp_con_printer)
											const a = parseTemp.find(
												item => item.boundAddress == row.address,
											)
											if (!a) {
												this.props.addPrinter([
													...parseTemp,
													{ name: row.name, boundAddress: row.address },
												])
												await Storage.setItem(
													"@connected_printer",
													JSON.stringify([
														...parseTemp,
														{ name: row.name, boundAddress: row.address },
													]),
												)
												console.debug(this.props.Printer)
											}
										} else {
											console.debug("SET PRINTER")
											this.props.addPrinter([
												{ name: row.name, boundAddress: row.address },
											])
											await Storage.setItem(
												"@connected_printer",
												JSON.stringify([
													{ name: row.name, boundAddress: row.address },
												]),
											)
										}
										this.props.navigation.navigate(
											"/drawer/transaction/cetakstruk",
										)
									},
									e => {
										this.setState({
											loading: false,
										})
										alert(e)
									},
								)
							}}>
							<Wrapper style={styles.wrapper}>
								<View style={{ alignItems: "center", flexDirection: "row" }}>
									<Icon
										size={20}
										name="bluetooth"
										color={ColorsList.greyFont}
									/>
									<View
										style={{
											justifyContent: "flex-start",
											marginLeft: SizeList.base,
										}}>
										<Text font="SemiBold">{row.name || "UNKNOWN"}</Text>
										<Text>{row.address}</Text>
									</View>
								</View>
								<Text color="success">HUBUNGKAN</Text>
							</Wrapper>
						</TouchableOpacity>
						{i != rows.length - 1 && (
							<Divider style={{ marginVertical: SizeList.secondary }} />
						)}
					</Fragment>,
				)
			}
		}
		return (
			<View style={[stylesglobe.shadowView, { padding: SizeList.base }]}>
				{items}
			</View>
		)
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
				<GlobalHeaderWithIcon
					title="TAMBAH PERANGKAT"
					onPressBack={() => this.props.navigation.goBack()}
					image={require("src/assets/icons/home/refresh.png")}
					handleDeleteCategory={() => this._scan()}
				/>
				<View style={{ flex: 1, padding: SizeList.bodyPadding }}>
					{this.state.loading ? <ActivityIndicator animating={true} /> : null}
					<Wrapper style={{ paddingVertical: 10 }} justify="space-between">
						<Text>Bluetooth</Text>
						<Switch
							thumbColor={this.state.bleOpend ? "#cd0192" : "grey"}
							trackColor={{ true: ColorsList.primaryColor, false: "grey" }}
							value={this.state.bleOpend}
							onValueChange={v => {
								this.setState({
									loading: true,
								})
								if (!v) {
									BluetoothManager.disableBluetooth().then(
										() => {
											this.setState({
												bleOpend: false,
												loading: false,
												foundDs: [],
												pairedDs: [],
											})
										},
										err => {
											alert(err)
										},
									)
								} else {
									BluetoothManager.enableBluetooth().then(
										r => {
											var paired = []
											if (r && r.length > 0) {
												for (var i = 0; i < r.length; i++) {
													try {
														paired.push(JSON.parse(r[i]))
													} catch (e) {
														//ignore
													}
												}
											}
											this.setState({
												bleOpend: true,
												loading: false,
												pairedDs: paired,
											})
										},
										err => {
											this.setState({
												loading: false,
											})
											alert(err)
										},
									)
								}
							}}
						/>
					</Wrapper>
					<ScrollView style={styles.container}>
						<Text style={styles.title}>Perangkat disambungkan:</Text>
						<View style={{ flex: 1, flexDirection: "column" }}>
							{this.state.pairedDs.length > 0
								? this._renderRow(this.state.pairedDs)
								: this._renderEmpty()}
						</View>
						<Text style={styles.title}>Perangkat tersedia:</Text>
						<View style={{ flex: 1, flexDirection: "column" }}>
							{this.state.foundDs.length > 0
								? this._renderRow(this.state.foundDs)
								: this._renderEmpty()}
						</View>
					</ScrollView>
				</View>
			</View>
		)
	}

	_scan() {
		if (this.state.bleOpend) {
			this.setState({
				loading: true,
			})
			BluetoothManager.scanDevices().then(
				s => {
					var ss = s
					var found = ss.found
					try {
						found = JSON.parse(found) //@FIX_it: the parse action too weired..
					} catch (e) {
						//ignore
					}
					var fds = this.state.foundDs
					if (found && found.length) {
						fds = found
					}
					this.setState({
						foundDs: fds,
						loading: false,
					})
				},
				er => {
					this.setState({
						loading: false,
					})
					alert("error" + JSON.stringify(er))
				},
			)
		} else {
			alert("Mohon hidupkan bluetooth")
		}
	}
}

function mapStateToProps(state) {
	return {
		Printer: state.Printer,
	}
}

export default connect(mapStateToProps, { addPrinter })(TambahPerangkat)

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	title: {
		marginBottom: 5,
	},
	wtf: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
	},
	wrapper: {
		marginBottom: 5,
		padding: 15,
		borderRadius: 5,
		justifyContent: "space-between",
		alignItems: "center",
	},
})
