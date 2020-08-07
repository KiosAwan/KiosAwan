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
import { convertRupiah } from 'src/utils/authhelper';

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
			printData: null,
			multi: true,
			singlePrintData: null
		}
	}

	async componentDidMount() {//alert(BluetoothManager)
		const { data, type, singleData } = await this.props.navigation.state.params
		if (type) {
			this.setState({ printData: data, multi: true })
		} else {
			this.setState({ singlePrintData: singleData, multi: false })
		}
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
							this.props.Printer.data.rMap((a, i) =>
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
		let columnWidths = [17, 15];
		let transaksiWidth = [15, 17];
		let alignLeft = [32]
		if (this.state.multi) {
			let data = [
				{ label: "Kode Transaksi", value: this.state.printData.transaction.payment_code },
				{ label: "Waktu", value: this.state.printData.transaction.created_at.slice(0, 16) },
				{ label: "Pembayaran", value: this.state.printData.transaction.id_payment_type == 1 ? "Tunai" : this.state.printData.transaction.id_payment_type == 2 ? `Non Tunai(${this.state.printData.transaction.method})` : "Piutang" },
				{ label: "Operator", value: this.state.printData.transaction.cashier },
				this.state.printData.transaction.name_customer ? { label: "Pelanggan", value: this.state.printData.transaction.name_customer } : null,
			]
			BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
			BluetoothEscposPrinter.printText(`${this.state.printData.transaction.name_store.toUpperCase()}\n\r`, {});
			BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
			data.rMap(async item => {
				BluetoothEscposPrinter.printColumn(transaksiWidth,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					[item.label && item.label, item.value], {});
			})
			if (this.state.printData.details_item.length > 0) {
				BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
				BluetoothEscposPrinter.printText("Product\n\r", {});
				BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
			}
			this.state.printData.details_item.forEach(list => {
				BluetoothEscposPrinter.printColumn(alignLeft,
					[BluetoothEscposPrinter.ALIGN.LEFT],
					[list.product], { widthtimes: 0.2 })
				BluetoothEscposPrinter.printColumn(columnWidths,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					[convertRupiah(list.price) + " x " + list.qty, convertRupiah(list.total)], {})
			})
			if (this.state.printData.product_digital.length > 0) {
				BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
				BluetoothEscposPrinter.printText("Tagihan dan Isi Ulang\n\r", {});
				BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
			}
			this.state.printData.product_digital.forEach((list, i) => {
				let filterPayment = ["id", "token", "status", "id_transaction", "payment_code", "customerID", "referenceID", "productID", "created_at", "updated_at", "info", "supplier", "product_code"]
				const { payment } = list
				BluetoothEscposPrinter.printColumn(columnWidths,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					[list.transaction.transaction_name.split('_').join(' ').toUpperCase(), list.transaction.status], { widthtimes: 0.2 })
				if (list.transaction.transaction_name == "pln_prepaid" && list.transaction.status == "SUCCESS") {
					BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
					BluetoothEscposPrinter.printText("Nomor token\n\r", {});
					BluetoothEscposPrinter.printText(`${payment.token.match(/.{1,4}/g).join("-")}\n\r`, {});
					BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
				}
				// if (payment) {

				// 	Object.keys(payment).filter(a => !filterPayment.includes(a))
				// 		.rMap(item => {
				// 			if (item == 'description') {
				// 				BluetoothEscposPrinter.printColumn(alignLeft,
				// 					[BluetoothEscposPrinter.ALIGN.LEFT],
				// 					[typeof payment[item] == 'string' && payment[item].split(';')[0]], { widthtimes: 0.2 })
				// 			} else if (item == 'reff_no') {
				// 				BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
				// 				BluetoothEscposPrinter.printText("Reff no\n\r", {});
				// 				BluetoothEscposPrinter.printText(`${payment.reff_no}\n\r`, {});
				// 				BluetoothEscposPrinter.printText(`\n\r`, {});
				// 				BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
				// 			} else {
				// 				BluetoothEscposPrinter.printColumn(columnWidths,
				// 					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
				// 					[item.split('_').join(' ').ucwords(), !['denda', 'total', 'admin', 'ppj', 'ppn', 'angsuran', 'tagihan', 'adminBank'].includes(item) ? payment[item].trim() : parseInt(payment[item]).convertRupiah()], {})
				// 			}
				// 		})
				// }
				// else {

				BluetoothEscposPrinter.printColumn(columnWidths,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					["Customer ID", list.transaction.customerID], {})
				BluetoothEscposPrinter.printColumn(columnWidths,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					["Kode Transaksi", list.transaction.transaction_code], {})
				// BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
				// BluetoothEscposPrinter.printText("Reference ID\n\r", {});
				// BluetoothEscposPrinter.printText(`${list.transaction.referenceID}\n\r`, {});
				// BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
				BluetoothEscposPrinter.printColumn(columnWidths,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					["Total tagihan", convertRupiah(list.transaction.total)], {})
				// list.transaction.denda && list.transaction.denda > 0 && BluetoothEscposPrinter.printColumn(columnWidths,
				// 	[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
				// 	["Denda", convertRupiah(list.transaction.denda)], {})
				// if (list.transaction.transaction_name == "pln_prepaid" && list.transaction.status == "SUCCESS") {
				// 	BluetoothEscposPrinter.printColumn(columnWidths,
				// 		[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
				// 		["Nomor token", list.payment.token], {})
				// }
				// }
				i + 1 < this.state.printData.product_digital.length && BluetoothEscposPrinter.printText("-------------------------------\n", {});
			})
			BluetoothEscposPrinter.printText("-------------------------------\n", {});
			BluetoothEscposPrinter.printColumn(columnWidths,
				[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
				["Subtotal", convertRupiah(this.state.printData.transaction.sub_total)], {})
			{
				this.state.printData.transaction.discount ?
					BluetoothEscposPrinter.printColumn(columnWidths,
						[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
						["Diskon", convertRupiah(this.state.printData.transaction.discount)], {})
					: null
			}
			{
				this.state.printData.transaction.status != 1 ?
					BluetoothEscposPrinter.printColumn(columnWidths,
						[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
						["Subtotal", convertRupiah(this.state.printData.transaction.total_return)], {})
					: null
			}
			BluetoothEscposPrinter.printColumn(columnWidths,
				[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
				["Total", convertRupiah(this.state.printData.transaction.status == 1 ? this.state.printData.transaction.total_transaction : this.state.printData.transaction.remaining_return)], {})
			BluetoothEscposPrinter.printText("-------------------------------\n", {});
			BluetoothEscposPrinter.printText("Powered by AWAN\n\r", {});
			BluetoothEscposPrinter.printText("\n\r\n\r", {});
		}
		else {
			let data = [
				{ label: "Kode Transaksi", value: this.state.singlePrintData.transaction.transaction_code },
				{ label: "Waktu", value: this.state.singlePrintData.transaction.created_at.slice(0, 16) },
			]
			BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
			BluetoothEscposPrinter.printText("STRUK PEMBELIAN\n\r", {});
			// BluetoothEscposPrinter.printText(`${this.state.printData.transaction.name_store.toUpperCase()}\n\r`, {});
			BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
			data.rMap(async item => {
				BluetoothEscposPrinter.printColumn(transaksiWidth,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					[item.label && item.label, item.value], {});
			})
			BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
			BluetoothEscposPrinter.printText("Tagihan dan Isi Ulang\n\r", {});
			BluetoothEscposPrinter.printText("-------------------------------\n\r", {});
			let filterPayment = ["id", "token", "status", "id_transaction", "payment_code", "customerID", "referenceID", "productID", "created_at", "updated_at", "info", "supplier", "product_code"]
			const { payment } = this.state.singlePrintData
			BluetoothEscposPrinter.printColumn(columnWidths,
				[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
				[this.state.singlePrintData.transaction.transaction_name.split('_').join(' ').toUpperCase(), this.state.singlePrintData.transaction.status], { widthtimes: 0.2 })
			if (this.state.singlePrintData.transaction.transaction_name == "pln_prepaid" && this.state.singlePrintData.transaction.status == "SUCCESS") {
				BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
				BluetoothEscposPrinter.printText("Nomor token\n\r", {});
				BluetoothEscposPrinter.printText(`${payment.token.match(/.{1,4}/g).join("-")}\n\r`, {});
				BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
			}
			if (payment) {

				Object.keys(payment).filter(a => !filterPayment.includes(a))
					.rMap(item => {
						if (item == 'description') {
							BluetoothEscposPrinter.printColumn(alignLeft,
								[BluetoothEscposPrinter.ALIGN.LEFT],
								[typeof payment[item] == 'string' && payment[item].split(';')[0]], { widthtimes: 0.2 })
						} else if (item == 'reff_no') {
							BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
							BluetoothEscposPrinter.printText("Reff no\n\r", {});
							BluetoothEscposPrinter.printText(`${payment.reff_no}\n\r`, {});
							BluetoothEscposPrinter.printText(`\n\r`, {});
							BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
						} else {
							BluetoothEscposPrinter.printColumn(columnWidths,
								[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
								[item.split('_').join(' ').ucwords(), !['denda', 'total', 'admin', 'ppj', 'ppn', 'angsuran', 'tagihan', 'adminBank'].includes(item) ? payment[item].trim() : parseInt(payment[item]).convertRupiah()], {})
						}
					})
				BluetoothEscposPrinter.printText("-------------------------------\n", {});
				BluetoothEscposPrinter.printText("Powered by AWAN\n\r", {});
				BluetoothEscposPrinter.printText("\n\r\n\r", {});
			}
			else {
				BluetoothEscposPrinter.printColumn(columnWidths,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					["Customer ID", this.state.singlePrintData.transaction.customerID], {})
				BluetoothEscposPrinter.printColumn(columnWidths,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					["Kode Transaksi", this.state.singlePrintData.transaction.transaction_code], {})
				// BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
				// BluetoothEscposPrinter.printText("Reference ID\n\r", {});
				// BluetoothEscposPrinter.printText(`${this.state.singlePrintData.transaction.referenceID}\n\r`, {});
				// BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
				this.state.singlePrintData.transaction.denda && this.state.singlePrintData.transaction.denda > 0 && BluetoothEscposPrinter.printColumn(columnWidths,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					["Denda", convertRupiah(this.state.singlePrintData.transaction.denda)], {})
				BluetoothEscposPrinter.printColumn(columnWidths,
					[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
					["Total tagihan", convertRupiah(this.state.singlePrintData.transaction.total)], {})
				BluetoothEscposPrinter.printText("-------------------------------\n", {});
				BluetoothEscposPrinter.printText("Powered by AWAN\n\r", {});
				BluetoothEscposPrinter.printText("\n\r\n\r", {});
			}
		}
		this.setState({ loading: false })
		this.props.navigation.goBack()
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