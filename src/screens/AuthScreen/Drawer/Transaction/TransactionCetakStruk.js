import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { ImageAuto } from 'src/components/CustomImage';
import { ColorsList } from 'src/styles/colors';

const CetakStruk = ({ navigation }) => {
	return <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
		<GlobalHeader onPress={() => navigation.goBack()} title="Cetak Struk" />
		<ScrollView style={{ padding: 15 }}>
			{
				[1, 2, 3, 4].map((a, i) =>
					<Wrapper justify="space-between" style={{ marginBottom: 10, padding: 10, backgroundColor: ColorsList.whiteColor, borderRadius: 5 }}>
						<View style={{ width: 50, height: 50 }}>
							<ImageAuto source={i % 2 == 0 ? require('src/assets/icons/icon-restock.png') : require('src/assets/icons/icon-cashier.png')} />
						</View>
						<View _style={{ width: '85%', }} >
							<Wrapper justify="space-between">
								<View>
									<Text color="primary">Nama printer</Text>
									<Text>Id Printer</Text>
								</View>
								<Text color={i % 2 == 0 ? 'success' : 'danger'} font="ExtraBold">{i % 2 == 0 ? 'TERHUBUNG' : 'BELUM TERHUBUNG'}</Text>
							</Wrapper>
						</View>
					</Wrapper>
				)
			}
		</ScrollView>
		<Bottom>
			<Button width="100%">+ Tambah Printer</Button>
		</Bottom>
	</View>
}

export default CetakStruk









// import React, { Component } from 'react';
// import {
// 	ActivityIndicator,
// 	Platform,
// 	StyleSheet,
// 	Text,
// 	View,
// 	Button,
// 	ScrollView,
// 	DeviceEventEmitter,
// 	NativeEventEmitter,
// 	Switch,
// 	TouchableOpacity,
// 	Dimensions,
// 	ToastAndroid
// } from 'react-native';
// import { BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter } from "react-native-bluetooth-escpos-printer";
// import AsyncStorage from '@react-native-community/async-storage';

// var { height, width } = Dimensions.get('window');
// export default class CetakStruk extends Component {


// 	_listeners = [];

// 	constructor() {
// 		super();
// 		this.state = {
// 			devices: null,
// 			pairedDs: [],
// 			foundDs: [],
// 			bleOpend: false,
// 			loading: true,
// 			boundAddress: '',
// 			debugMsg: '',
// 			name: '',
// 			connectedPrinter: [],
// 			printEnable: null
// 		}
// 	}

// 	async componentDidMount() {//alert(BluetoothManager)
// 		const connectedPrinter = await AsyncStorage.getItem('@connected_printer')
// 		if (connectedPrinter) {
// 			this.setState({ connectedPrinter: JSON.parse(connectedPrinter) })
// 		}
// 		BluetoothManager.isBluetoothEnabled().then((enabled) => {
// 			this.setState({
// 				bleOpend: Boolean(enabled),
// 				loading: false
// 			})
// 		}, (err) => {
// 			err
// 		});

// 		// if (Platform.OS === 'ios') {
// 		// 	this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
// 		// 		(rsp) => {
// 		// 			this._deviceAlreadPaired(rsp)
// 		// 		}));
// 		// 	this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
// 		// 		this._deviceFoundEvent(rsp)
// 		// 	}));
// 		// 	this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
// 		// 		this.setState({
// 		// 			name: '',
// 		// 			boundAddress: ''
// 		// 		});
// 		// 	}));
// 		// } else 
// 		if (Platform.OS === 'android') {
// 			this._listeners.push(DeviceEventEmitter.addListener(
// 				BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp) => {
// 					this._deviceAlreadPaired(rsp)
// 				}));
// 			this._listeners.push(DeviceEventEmitter.addListener(
// 				BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
// 					this._deviceFoundEvent(rsp)
// 				}));
// 			this._listeners.push(DeviceEventEmitter.addListener(
// 				BluetoothManager.EVENT_CONNECTION_LOST, () => {
// 					this.setState({
// 						name: '',
// 						boundAddress: ''
// 					});
// 				}
// 			));
// 			this._listeners.push(DeviceEventEmitter.addListener(
// 				BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
// 					ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG);
// 				}
// 			))
// 		}
// 	}

// 	// componentWillUnmount() {
// 	// 	//for (let ls in this._listeners) {
// 	// 	//    this._listeners[ls].remove();
// 	// 	//}
// 	// }

// 	// _deviceAlreadPaired(rsp) {
// 	// 	var ds = null;
// 	// 	if (typeof (rsp.devices) == 'object') {
// 	// 		ds = rsp.devices;
// 	// 	} else {
// 	// 		try {
// 	// 			ds = JSON.parse(rsp.devices);
// 	// 		} catch (e) {
// 	// 		}
// 	// 	}
// 	// 	if (ds && ds.length) {
// 	// 		let pared = this.state.pairedDs;
// 	// 		pared = pared.concat(ds || []);
// 	// 		this.setState({
// 	// 			pairedDs: pared
// 	// 		});
// 	// 	}
// 	// }

// 	// _deviceFoundEvent(rsp) {//alert(JSON.stringify(rsp))
// 	// 	var r = null;
// 	// 	try {
// 	// 		if (typeof (rsp.device) == "object") {
// 	// 			r = rsp.device;
// 	// 		} else {
// 	// 			r = JSON.parse(rsp.device);
// 	// 		}
// 	// 	} catch (e) {//alert(e.message);
// 	// 		//ignore
// 	// 	}
// 	// 	//alert('f')
// 	// 	if (r) {
// 	// 		let found = this.state.foundDs || [];
// 	// 		if (found.findIndex) {
// 	// 			let duplicated = found.findIndex(function (x) {
// 	// 				return x.address == r.address
// 	// 			});
// 	// 			//CHECK DEPLICATED HERE...
// 	// 			if (duplicated == -1) {
// 	// 				found.push(r);
// 	// 				this.setState({
// 	// 					foundDs: found
// 	// 				});
// 	// 			}
// 	// 		}
// 	// 	}
// 	// }

// 	_renderRow(rows) {
// 		let items = [];
// 		for (let i in rows) {
// 			let row = rows[i];
// 			if (row.address) {
// 				items.push(
// 					<TouchableOpacity key={new Date().getTime() + i} stlye={styles.wtf} onPress={() => {
// 						this.setState({
// 							loading: true
// 						});
// 						BluetoothManager.connect(row.address)
// 							.then(async (s) => {
// 								const temp_con_printer = await AsyncStorage.getItem('@connected_printer')
// 								if (temp_con_printer) {
// 									console.debug("SET PRINTER ARR")
// 									const parseTemp = JSON.parse(temp_con_printer)
// 									const a = parseTemp.find(item => item.boundAddress == row.address)
// 									if (!a) {
// 										await AsyncStorage.setItem('@connected_printer', JSON.stringify([...parseTemp, { name: row.name, boundAddress: row.address }]))
// 									}
// 								} else {
// 									console.debug("SET PRINTER")
// 									await AsyncStorage.setItem('@connected_printer', JSON.stringify([{ name: row.name, boundAddress: row.address }]))
// 								}
// 								this.setState({
// 									connectedPrinter: [...this.state.connectedPrinter, { name: row.name, boundAddress: row.address }],
// 									loading: false,
// 									boundAddress: row.address,
// 									name: row.name || "UNKNOWN"
// 								})
// 								console.debug("A", this.state.connectedPrinter)
// 							}, (e) => {
// 								this.setState({
// 									loading: false
// 								})
// 								alert(e);
// 							})

// 					}}><Text style={styles.name}>{row.name || "UNKNOWN"}</Text><Text
// 						style={styles.address}>{row.address}</Text></TouchableOpacity>
// 				);
// 			}
// 		}
// 		return items;
// 	}

// 	_connectedBluetoothPrint = async (printer) => {
// 		BluetoothManager.connect(printer.boundAddress)
// 			.then(() => {
// 				this.setState({ printEnable: printer })
// 				console.debug("PRINT SUCCESS", printer.name)
// 			}, (e) => {
// 				alert(e);
// 			})
// 	}
// 	render() {
// 		return (
// 			<ScrollView style={styles.container}>
// 				<Text>{this.state.debugMsg}</Text>
// 				<Text style={styles.title}>Blutooth Opended:{this.state.bleOpend ? "true" : "false"} <Text>Open BLE Before Scanning</Text> </Text>
// 				<View>
// 					<Switch value={this.state.bleOpend} onValueChange={(v) => {
// 						this.setState({
// 							loading: true
// 						})
// 						if (!v) {
// 							BluetoothManager.disableBluetooth().then(() => {
// 								this.setState({
// 									bleOpend: false,
// 									loading: false,
// 									foundDs: [],
// 									pairedDs: []
// 								});
// 							}, (err) => { alert(err) });
// 						} else {
// 							BluetoothManager.enableBluetooth().then((r) => {
// 								var paired = [];
// 								if (r && r.length > 0) {
// 									for (var i = 0; i < r.length; i++) {
// 										try {
// 											paired.push(JSON.parse(r[i]));
// 										} catch (e) {
// 											//ignore
// 										}
// 									}
// 								}
// 								this.setState({
// 									bleOpend: true,
// 									loading: false,
// 									pairedDs: paired
// 								})
// 							}, (err) => {
// 								this.setState({
// 									loading: false
// 								})
// 								alert(err)
// 							});
// 						}
// 					}} />
// 					<Button disabled={this.state.loading || !this.state.bleOpend} onPress={() => {
// 						this._scan();
// 					}} title="Scan" />
// 				</View>
// 				<Text style={styles.title}>Connected:<Text style={{ color: "blue" }}>{!this.state.name ? 'No Devices' : this.state.name}</Text></Text>
// 				<Text style={styles.title}>Found(tap to connect):</Text>
// 				{this.state.loading ? (<ActivityIndicator animating={true} />) : null}
// 				<View style={{ flex: 1, flexDirection: "column" }}>
// 					{
// 						this._renderRow(this.state.foundDs)
// 					}
// 				</View>
// 				<Text style={styles.title}>Paired:</Text>
// 				{this.state.loading ? (<ActivityIndicator animating={true} />) : null}
// 				<View style={{ flex: 1, flexDirection: "column" }}>
// 					{
// 						this._renderRow(this.state.pairedDs)
// 					}
// 				</View>
// 				<View style={{ flex: 1 }}>
// 					<Text>Connected Printer : </Text>
// 					{
// 						this.state.connectedPrinter.map(printer => (
// 							printer.boundAddress != (this.state.printEnable ? this.state.printEnable.boundAddress : null) ?
// 							<TouchableOpacity onPress={this.state.bleOpend ? () => this._connectedBluetoothPrint(printer) : () => alert("Mohon hidupkan bluetooth terlebih dahulu")} style={styles.connectedPrinter}>
// 								<View>
// 									<Text>{printer.name}</Text>
// 									<Text>{printer.boundAddress}</Text>
// 								</View>
// 								<View>
// 									<Text>{!printer.connect ? "Hubungkan" : "Terhubung"}</Text>
// 								</View>
// 							</TouchableOpacity>
// 							: null
// 						))
// 					}
// 				</View>
// 				{
// 					this.state.printEnable ?
// 						<TouchableOpacity onPress={this.state.bleOpend ? () => this._connectedBluetoothPrint(printer) : () => alert("Mohon hidupkan bluetooth terlebih dahulu")} style={styles.connectedPrinter}>
// 							<View>
// 								<Text>{this.state.printEnable.name}</Text>
// 								<Text>{this.state.printEnable.boundAddress}</Text>
// 							</View>
// 							<View>
// 								<Text>Terhubung</Text>
// 								<View>
// 									<Text>PRINT</Text>
// 									<Text onPress={this._testPrint}>TES PRINT</Text>
// 								</View>
// 							</View>
// 						</TouchableOpacity>
// 						: null}
// 				<View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 30 }}>
// 					<Button disabled={this.state.loading || !(this.state.bleOpend && this.state.boundAddress.length > 0)}
// 						title="ESC/POS" onPress={this._testPrint} />
// 					<Button disabled={this.state.loading || !(this.state.bleOpend && this.state.boundAddress.length > 0)}
// 						title="TSC" onPress={async () =>
// 							await AsyncStorage.removeItem('@connected_printer')
// 						} />
// 				</View>
// 			</ScrollView>
// 		);
// 	}

// 	_testPrint = async () => {
// 		this.setState({ loading: true })
// 		let columnWidths = [16, 16];
// 		let transaksiWidth = [16, 16];
// 		let alignLeft = [32]
// 		let data = [
// 			{ label: "KodeTransaksi", value: "123412" },
// 			{ label: "KodeTransaksi", value: "123412" },
// 			{ label: "KodeTransaksi", value: "123412" },
// 			{ label: "KodeTransaksi", value: "123412" },
// 		]
// 		let listItem = [
// 			{ name: "Awan", quantity: "1", harga: 16000 },
// 			{ name: "Tuppperware Baru Bekas Pakai", quantity: "2", harga: 16000 },
// 			{ name: "Kertas", quantity: "3", harga: 16000 },
// 			{ name: "Bacot", quantity: "4", harga: 16000 },
// 		]
// 		BluetoothEscposPrinter.printText("Toko Hongkong\n\rJalan Sawo , Kebayoran Baru \n\r", {});
// 		// BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
// 		// data.map(async item => {
// 		// 	BluetoothEscposPrinter.printColumn(transaksiWidth,
// 		// 		[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// 		// 		[item.label, item.value], {});
// 		// })
// 		// BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
// 		// BluetoothEscposPrinter.printText("DAFTAR PRODUK\n\r", { widthtimes: 0.9 });
// 		// BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
// 		// listItem.forEach(list => {
// 		// 	BluetoothEscposPrinter.printColumn(alignLeft,
// 		// 		[BluetoothEscposPrinter.ALIGN.LEFT],
// 		// 		[list.name], { widthtimes: 0.2 })
// 		// 	BluetoothEscposPrinter.printColumn(columnWidths,
// 		// 		[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// 		// 		[convertRupiah(list.harga) + " x " + list.quantity.toString(), convertRupiah(list.quantity * list.harga)], {})
// 		// })
// 		// BluetoothEscposPrinter.printText("-------------------------------\n", {});
// 		// BluetoothEscposPrinter.printColumn(columnWidths,
// 		// 	[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// 		// 	["Subtotal", convertRupiah(20000)], {})
// 		// BluetoothEscposPrinter.printColumn(columnWidths,
// 		// 	[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// 		// 	["Total", convertRupiah(20000)], {})
// 		// BluetoothEscposPrinter.printText("-------------------------------\n", {});
// 		// BluetoothEscposPrinter.printText("Powered by KIOSAWAN\n\r", { widthtimes: 0.8, fonttype: BluetoothTscPrinter.FONT_5 });
// 		// BluetoothEscposPrinter.printText("\n\r\n\r", {});
// 		this.setState({ loading: false })
// 	}
// 	// }

// 	_scan() {
// 		this.setState({
// 			loading: true
// 		})
// 		BluetoothManager.scanDevices()
// 			.then((s) => {
// 				var ss = s;
// 				var found = ss.found;
// 				try {
// 					found = JSON.parse(found);//@FIX_it: the parse action too weired..
// 				} catch (e) {
// 					//ignore
// 				}
// 				var fds = this.state.foundDs;
// 				if (found && found.length) {
// 					fds = found;
// 				}
// 				this.setState({
// 					foundDs: fds,
// 					loading: false
// 				});
// 			}, (er) => {
// 				this.setState({
// 					loading: false
// 				})
// 				alert('error' + JSON.stringify(er));
// 			});
// 	}


// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: '#F5FCFF',
// 	},

// 	title: {
// 		width: width,
// 		backgroundColor: "#eee",
// 		color: "#232323",
// 		paddingLeft: 8,
// 		paddingVertical: 4,
// 		textAlign: "left"
// 	},
// 	wtf: {
// 		flex: 1,
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		alignItems: "center"
// 	},
// 	name: {
// 		flex: 1,
// 		textAlign: "left"
// 	},
// 	address: {
// 		flex: 1,
// 		textAlign: "right"
// 	},
// 	connectedPrinter: {
// 		flexDirection: 'row',
// 		alignItems: "center",
// 		justifyContent: "space-between"
// 	}
// });