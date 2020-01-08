import React, { Component } from 'react';
import {
	ActivityIndicator,
	Platform,
	StyleSheet,
	View,
	ScrollView,
	DeviceEventEmitter,
	Switch,
	TouchableOpacity,
	Dimensions,
	ToastAndroid
} from 'react-native';
import { BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter } from "react-native-bluetooth-escpos-printer";
import AsyncStorage from '@react-native-community/async-storage';
import { GlobalHeader } from 'src/components/Header/Header';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { ImageAuto } from 'src/components/CustomImage';
import { ColorsList } from 'src/styles/colors';
import { connect } from 'react-redux';
import { addPrinter } from 'src/redux/actions/actionsPrinter';

var { height, width } = Dimensions.get('window');

class CetakStruk extends Component {
	_listeners = [];

	constructor() {
		super();
		this.state = {
			devices: null,
			bleOpend: false,
			loading: true,
			printEnable: null,
			printData : null
		}
	}

	async componentDidMount() {//alert(BluetoothManager)
		const { data } = await this.props.navigation.state.params
		this.setState({printData : data})
		const connectedPrinter = await AsyncStorage.getItem('@connected_printer')
		if (connectedPrinter) {
			this.props.addPrinter(JSON.parse(connectedPrinter))
		}
		BluetoothManager.isBluetoothEnabled().then((enabled) => {
			this.setState({
				bleOpend: Boolean(enabled),
				loading: false
			})
		}, (err) => {
			err
		});
		if (Platform.OS === 'android') {
			this._listeners.push(DeviceEventEmitter.addListener(
				BluetoothManager.EVENT_CONNECTION_LOST, () => {
					this.setState({
						name: '',
						boundAddress: ''
					});
				}
			));
			this._listeners.push(DeviceEventEmitter.addListener(
				BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
					ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG);
				}
			))
		}
	}
	_renderRow(rows) {
		let items = [];
		for (let i in rows) {
			let row = rows[i];
			if (row.address) {
				items.push(
					<TouchableOpacity key={new Date().getTime() + i} stlye={styles.wtf} onPress={() => {
						this.setState({
							loading: true
						});
						BluetoothManager.connect(row.address)
							.then(async (s) => {
								const temp_con_printer = await AsyncStorage.getItem('@connected_printer')
								if (temp_con_printer) {
									console.debug("SET PRINTER ARR")
									const parseTemp = JSON.parse(temp_con_printer)
									const a = parseTemp.find(item => item.boundAddress == row.address)
									if (!a) {
										await AsyncStorage.setItem('@connected_printer', JSON.stringify([...parseTemp, { name: row.name, boundAddress: row.address }]))
									}
								} else {
									console.debug("SET PRINTER")
									await AsyncStorage.setItem('@connected_printer', JSON.stringify([{ name: row.name, boundAddress: row.address }]))
								}
								this.setState({
									connectedPrinter: [...this.state.connectedPrinter, { name: row.name, boundAddress: row.address }],
									loading: false,
									boundAddress: row.address,
									name: row.name || "UNKNOWN"
								})
								console.debug("A", this.state.connectedPrinter)
							}, (e) => {
								this.setState({
									loading: false
								})
								alert(e);
							})

					}}><Text style={styles.name}>{row.name || "UNKNOWN"}</Text><Text
						style={styles.address}>{row.address}</Text></TouchableOpacity>
				);
			}
		}
		return items;
	}

	_connectedBluetoothPrint = async (printer) => {
		BluetoothManager.connect(printer.boundAddress)
			.then(() => {
				this.setState({ printEnable: printer })
				console.debug("PRINT SUCCESS", printer.name)
			}, (e) => {
				alert(e);
			})
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
				<GlobalHeader onPressBack={() => this.props.navigation.goBack()} title="Cetak Struk" />
				<View style={styles.switchView}>
					<Text>Bluetooth</Text>
					<Switch value={this.state.bleOpend} onValueChange={(v) => {
						this.setState({
							loading: true
						})
						if (!v) {
							BluetoothManager.disableBluetooth().then(() => {
								this.setState({
									bleOpend: false,
									loading: false,
									foundDs: [],
									pairedDs: []
								});
							}, (err) => { alert(err) });
						} else {
							BluetoothManager.enableBluetooth().then((r) => {
								var paired = [];
								if (r && r.length > 0) {
									for (var i = 0; i < r.length; i++) {
										try {
											paired.push(JSON.parse(r[i]));
										} catch (e) {
											//ignore
										}
									}
								}
								this.setState({
									bleOpend: true,
									loading: false,
									pairedDs: paired
								})
							}, (err) => {
								this.setState({
									loading: false
								})
								alert(err)
							});
						}
					}} />
				</View>
				{!this.state.loading ?
					<ScrollView style={{ padding: 15 }}>
						{
							this.state.printEnable ?
								<TouchableOpacity onPress={this.state.bleOpend ? this._testPrint : () => alert("Hidupkan bluetooth")}>
									<Wrapper justify="space-between" style={{ marginBottom: 10, padding: 10, backgroundColor: ColorsList.whiteColor, borderRadius: 5 }}>
										<View style={{ width: 50, height: 50 }}>
											<ImageAuto source={require('src/assets/icons/icon-restock.png')} />
										</View>
										<View _style={{ width: '85%', }} >
											<Wrapper justify="space-between">
												<View>
													<Text color="primary">{this.state.printEnable.name}</Text>
													<Text>{this.state.printEnable.boundAddress}</Text>
												</View>
												<Text color='success' font="ExtraBold">CETAK STRUK</Text>
											</Wrapper>
										</View>
									</Wrapper>
								</TouchableOpacity>
								: null}
						{
							this.props.Printer.data.map((a, i) =>
								a.boundAddress != (this.state.printEnable ? this.state.printEnable.boundAddress : 0) ?
									<TouchableOpacity onPress={this.state.bleOpend ? () => this._connectedBluetoothPrint(a) : () => alert("Mohon hidupkan bluetooth terlebih dahulu")}>
										<Wrapper justify="space-between" style={{ marginBottom: 10, padding: 10, backgroundColor: ColorsList.whiteColor, borderRadius: 5 }}>
											<View style={{ width: 50, height: 50 }}>
												<ImageAuto source={i % 2 == 0 ? require('src/assets/icons/icon-restock.png') : require('src/assets/icons/icon-cashier.png')} />
											</View>
											<View _style={{ width: '85%', }} >
												<Wrapper justify="space-between">
													<View>
														<Text color="primary">{a.name}</Text>
														<Text>{a.boundAddress}</Text>
													</View>
													<Text color='danger' font="ExtraBold">BELUM TERHUBUNG</Text>
												</Wrapper>
											</View>
										</Wrapper>
									</TouchableOpacity>
									: null
							)
						}
					</ScrollView> : <ActivityIndicator color={ColorsList.primary} />}
				<Bottom>
					<Button onPress={() => this.props.navigation.navigate('/drawer/transaction/tambahprinter')} width="100%">+ Tambah Printer</Button>
				</Bottom>
			</View>
		);
	}

	_testPrint = async () => {
		this.setState({ loading: true })
		let columnWidths = [16, 16];
		let transaksiWidth = [16, 16];
		let alignLeft = [32]
		let data = [
			{ label: "KodeTransaksi", value: "123412" },
			{ label: "KodeTransaksi", value: "123412" },
			{ label: "KodeTransaksi", value: "123412" },
			{ label: "KodeTransaksi", value: "123412" },
		]
		let listItem = [
			{ name: "Awan", quantity: "1", harga: 16000 },
			{ name: "Tuppperware Baru Bekas Pakai", quantity: "2", harga: 16000 },
			{ name: "Kertas", quantity: "3", harga: 16000 },
			{ name: "Bacot", quantity: "4", harga: 16000 },
		]
		BluetoothEscposPrinter.printText("Toko Hongkong\n\rJalan Sawo , Kebayoran Baru \n\r", {});
		// BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
		// data.map(async item => {
		// 	BluetoothEscposPrinter.printColumn(transaksiWidth,
		// 		[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
		// 		[item.label, item.value], {});
		// })
		// BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
		// BluetoothEscposPrinter.printText("DAFTAR PRODUK\n\r", { widthtimes: 0.9 });
		// BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
		// listItem.forEach(list => {
		// 	BluetoothEscposPrinter.printColumn(alignLeft,
		// 		[BluetoothEscposPrinter.ALIGN.LEFT],
		// 		[list.name], { widthtimes: 0.2 })
		// 	BluetoothEscposPrinter.printColumn(columnWidths,
		// 		[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
		// 		[convertRupiah(list.harga) + " x " + list.quantity.toString(), convertRupiah(list.quantity * list.harga)], {})
		// })
		// BluetoothEscposPrinter.printText("-------------------------------\n", {});
		// BluetoothEscposPrinter.printColumn(columnWidths,
		// 	[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
		// 	["Subtotal", convertRupiah(20000)], {})
		// BluetoothEscposPrinter.printColumn(columnWidths,
		// 	[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
		// 	["Total", convertRupiah(20000)], {})
		// BluetoothEscposPrinter.printText("-------------------------------\n", {});
		// BluetoothEscposPrinter.printText("Powered by KIOSAWAN\n\r", { widthtimes: 0.8, fonttype: BluetoothTscPrinter.FONT_5 });
		// BluetoothEscposPrinter.printText("\n\r\n\r", {});
		this.setState({ loading: false })
	}
	// }


}

function mapStateToProps(state) {
	return {
		Printer: state.Printer
	};
}

export default connect(mapStateToProps, { addPrinter })(CetakStruk)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},

	title: {
		width: width,
		backgroundColor: "#eee",
		color: "#232323",
		paddingLeft: 8,
		paddingVertical: 4,
		textAlign: "left"
	},
	wtf: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	name: {
		flex: 1,
		textAlign: "left"
	},
	address: {
		flex: 1,
		textAlign: "right"
	},
	connectedPrinter: {
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: "space-between"
	},
	switchView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 15
	}
});