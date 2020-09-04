import React, { Component } from "react"
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
	ToastAndroid,
} from "react-native"
import {
	BluetoothEscposPrinter,
	BluetoothManager,
	BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer"
import Storage from "src/utils/keyStores"
import { GlobalHeader } from "src/components/Header/Header"
import { Bottom } from "src/components/View/Bottom"
import { Button } from "src/components/Button/Button"
import { Text } from "src/components/Text/CustomText"
import { Wrapper } from "src/components/View/Wrapper"
import { ImageAuto } from "src/components/CustomImage"
import { ColorsList } from "src/styles/colors"
import { connect } from "react-redux"
import { addPrinter } from "src/redux/actions/actionsPrinter"
import { convertRupiah, prettyConsole } from "src/utils/authhelper"

var { height, width } = Dimensions.get("window")

class CetakStruk extends Component {
	_listeners = []

	constructor() {
		super()
		this.state = {
			devices: null,
			bleOpend: false,
			loading: true,
			printEnable: null,
			printData: null,
			multi: true,
			singlePrintData: null,
		}
	}

	async componentDidMount() {
		// Component did mount same as use effect
		// Setstate same as setXXX in hooks component

		// Get params from previous screen
		// 2 Types of type (false(From status pesanan || digital detail) and true(From transaction detail))
		const { data, type, singleData } = await this.props.navigation.state.params
		if (type) {
			this.setState({ printData: data, multi: true })
		} else {
			this.setState({ singlePrintData: singleData, multi: false })
		}

		// Get saved connected printer
		const connectedPrinter = await Storage.getItem("@connected_printer")
		if (connectedPrinter) {
			this.props.addPrinter(JSON.parse(connectedPrinter))
		}
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
		if (Platform.OS === "android") {
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
	_renderRow(rows) {
		let items = []
		for (let i in rows) {
			let row = rows[i]
			if (row.address) {
				items.push(
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
											await Storage.setItem(
												"@connected_printer",
												JSON.stringify([
													...parseTemp,
													{ name: row.name, boundAddress: row.address },
												]),
											)
										}
									} else {
										await Storage.setItem(
											"@connected_printer",
											JSON.stringify([
												{ name: row.name, boundAddress: row.address },
											]),
										)
									}
									this.setState({
										connectedPrinter: [
											...this.state.connectedPrinter,
											{ name: row.name, boundAddress: row.address },
										],
										loading: false,
										boundAddress: row.address,
										name: row.name || "UNKNOWN",
									})
								},
								e => {
									this.setState({
										loading: false,
									})
									alert(e)
								},
							)
						}}>
						<Text style={styles.name}>{row.name || "UNKNOWN"}</Text>
						<Text style={styles.address}>{row.address}</Text>
					</TouchableOpacity>,
				)
			}
		}
		return items
	}

	_connectedBluetoothPrint = async printer => {
		BluetoothManager.connect(printer.boundAddress).then(
			() => {
				this.setState({ printEnable: printer })
			},
			e => {
				alert(e)
			},
		)
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
				<GlobalHeader
					onPressBack={() => this.props.navigation.goBack()}
					title="Cetak Struk"
				/>
				<View style={styles.switchView}>
					<Text>Bluetooth</Text>
					<Switch
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
				</View>
				{!this.state.loading ? (
					<ScrollView style={{ padding: 15 }}>
						{this.state.printEnable ? (
							<TouchableOpacity
								onPress={
									this.state.bleOpend
										? this._generatePrintData
										: () => alert("Hidupkan bluetooth")
								}>
								<Wrapper
									justify="space-between"
									style={{
										marginBottom: 10,
										padding: 10,
										backgroundColor: ColorsList.whiteColor,
										borderRadius: 5,
									}}>
									<View style={{ width: 50, height: 50 }}>
										<ImageAuto
											source={require("src/assets/icons/icon-restock.png")}
										/>
									</View>
									<View _style={{ width: "85%" }}>
										<Wrapper justify="space-between">
											<View>
												<Text color="primary">
													{this.state.printEnable.name}
												</Text>
												<Text>{this.state.printEnable.boundAddress}</Text>
											</View>
											<Text color="success" font="ExtraBold">
												CETAK STRUK
											</Text>
										</Wrapper>
									</View>
								</Wrapper>
							</TouchableOpacity>
						) : null}
						{this.props.Printer.data.rMap((a, i) =>
							a.boundAddress !=
								(this.state.printEnable
									? this.state.printEnable.boundAddress
									: 0) ? (
									<TouchableOpacity
										onPress={
											this.state.bleOpend
												? () => this._connectedBluetoothPrint(a)
												: () => alert("Mohon hidupkan bluetooth terlebih dahulu")
										}>
										<Wrapper
											justify="space-between"
											style={{
												marginBottom: 10,
												padding: 10,
												backgroundColor: ColorsList.whiteColor,
												borderRadius: 5,
											}}>
											<View style={{ width: 50, height: 50 }}>
												<ImageAuto
													source={
														i % 2 == 0
															? require("src/assets/icons/icon-restock.png")
															: require("src/assets/icons/icon-cashier.png")
													}
												/>
											</View>
											<View _style={{ width: "85%" }}>
												<Wrapper justify="space-between">
													<View>
														<Text color="primary">{a.name}</Text>
														<Text>{a.boundAddress}</Text>
													</View>
													<Text color="danger" font="ExtraBold">
														BELUM TERHUBUNG
												</Text>
												</Wrapper>
											</View>
										</Wrapper>
									</TouchableOpacity>
								) : null,
						)}
					</ScrollView>
				) : (
						<ActivityIndicator color={ColorsList.primary} />
					)}
				<Bottom>
					<Button
						onPress={() =>
							this.props.navigation.navigate(
								"/drawer/transaction/tambahprinter",
							)
						}
						width="100%">
						+ Tambah Printer
					</Button>
				</Bottom>
			</View>
		)
	}
	maxLength = 32

	_generatePrintData = () => {
		const divider = Array.generateEmpty(this.maxLength).map(() => '-').join('') + '\n\r'
		let dataPrint = []
		dataPrint.push(
			() => BluetoothEscposPrinter.printerLineSpace(1),
			() => BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER),
			`${this.state.printData.transaction.name_store.toUpperCase()}\n\r`,
			divider,
			["Kode Trx", this.state.printData.transaction.payment_code,],
			["Waktu", this.state.printData.transaction.created_at.slice(0, 16),],
			["Pembayaran", this.state.printData.transaction.id_payment_type == 1
				? "Tunai"
				: this.state.printData.transaction.id_payment_type == 2
					? `Non Tunai(${this.state.printData.transaction.method})`
					: "Piutang",
			],
			["Operator", this.state.printData.transaction.cashier],
			this.state.printData.transaction.name_customer
				? ["Pelanggan", this.state.printData.transaction.name_customer,]
				: null
		)
		if (this.state.multi) {
			if (this.state.printData.details_item.length > 0) {
				dataPrint.push(
					divider,
					"Product\n\r",
					divider
				)
			}
			this.state.printData.details_item.forEach(list => {
				dataPrint.push({ data: [list.product], options: { widthtimes: 0.2 } }, [
					convertRupiah(list.price) + " x " + list.qty,
					convertRupiah(list.total),
				])
			})
			if (this.state.printData.product_digital.length > 0) {
				dataPrint.push(
					divider,
					"Tagihan dan Isi Ulang\n\r",
					divider
				)
			}
			this.state.printData.product_digital.forEach((list, i) => {
				const { payment } = list
				dataPrint.push({
					options: { widthtimes: 0.2 },
					data: [
						list.transaction.transaction_name
							.split("_")
							.join(" ")
							.toUpperCase(),
						list.transaction.status,
					]
				})
				if (list.transaction.transaction_name == "pln_prepaid" && list.transaction.status == "SUCCESS") {
					dataPrint.push(() => BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT))
					dataPrint.push(
						"Nomor token\n\r",
						{
							data: `${payment.token.match(/.{1,4}/g).join("-")}\n\r`,
							options: {
								widthtimes: 0.5,
								heigthtimes: 1,
							}
						}
					)
					dataPrint.push(() => BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER))
				}
				payment && payment.product_name && dataPrint.push(["Product Name", payment.product_name])
				dataPrint.push(
					["Customer ID", list.transaction.customerID],
					["Kode Transaksi", list.transaction.transaction_code],
					["Total tagihan", convertRupiah(list.transaction.total)]
				)
				i + 1 < this.state.printData.product_digital.length && dataPrint.push(divider)
			})
			dataPrint.push(
				divider,
				["Subtotal", convertRupiah(this.state.printData.transaction.sub_total)],
				this.state.printData.transaction.discount ? ["Diskon", convertRupiah(this.state.printData.transaction.discount)] : null,
				this.state.printData.transaction.status != 1 ? [
					"Subtotal",
					convertRupiah(this.state.printData.transaction.total_return),
				] : null,
				[
					"Total",
					convertRupiah(
						this.state.printData.transaction.status == 1
							? this.state.printData.transaction.total_transaction
							: this.state.printData.transaction.remaining_return,
					),
				],
			)
		} else {
			let filterPayment = [
				"id",
				"token",
				"status",
				"id_transaction",
				"payment_code",
				"customerID",
				"referenceID",
				"productID",
				"created_at",
				"updated_at",
				"info",
				"supplier",
				"product_code",
				"ppj",
				"ppn",
				"materai",
				"stroom_token",
				"angsuran",
			]
			const { payment } = this.state.singlePrintData
			dataPrint.push(
				divider,
				"Tagihan dan Isi Ulang\n\r",
				divider,
				{
					options: { widthtimes: 0.2 },
					data: [
						this.state.singlePrintData.transaction.transaction_name
							.split("_")
							.join(" ")
							.toUpperCase(),
						this.state.singlePrintData.transaction.status,
					]
				},
				{ options: { widthtimes: 0.2 }, data: ["Customer ID", this.state.singlePrintData.transaction.customerID] },

			)
			if (
				this.state.singlePrintData.transaction.transaction_name ==
				"pln_prepaid" &&
				this.state.singlePrintData.transaction.status == "SUCCESS"
			) {
				dataPrint.push(
					() => BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT),
					() => BluetoothEscposPrinter.printerLineSpace(0),
					"TOKEN\n",
					`${payment.token.match(/.{1,4}/g).join("-")}\n\r`,
					() => BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER),
					() => BluetoothEscposPrinter.printerLineSpace(3),
				)
			}
			if (payment) {
				Object.keys(payment)
					.filter(a => !filterPayment.includes(a))
					.rMap(item => {
						if (item == "description") {
							dataPrint.push({
								options: { widthtimes: 0.2 },
								data: [
									typeof payment[item] == "string" &&
									payment[item].split(";")[0],
								]
							})
						} else if (item == "reff_no") {
							dataPrint.push(
								() => BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT),
								"Reff no\n\r",
								`${payment.reff_no}\n\r`,
								`\n\r`,
								() => BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
							)
						} else {
							dataPrint.push([
								item.split("_").join(" ").ucwords(),
								![
									"denda",
									"total",
									"admin",
									"tagihan",
									"adminBank",
									"pembelian_token",
								].includes(item)
									? payment[item].trim()
									: parseInt(payment[item]).convertRupiah(),
							])
						}
					})
			} else {
				dataPrint.push(
					["Customer ID", this.state.singlePrintData.transaction.customerID],
					[
						"Kode Transaksi",
						this.state.singlePrintData.transaction.transaction_code,
					],
					[
						"Total tagihan",
						convertRupiah(this.state.singlePrintData.transaction.total),
					],
				)
			}
		}
		dataPrint.push(
			() => BluetoothEscposPrinter.printerLineSpace(0),
			divider,
			"Powered by AWAN\n\r",
			"\n\n",
		)
		this._printData(dataPrint)
	}
	
	_printData = async data => {
		this.setState({ loading: true })
		let columnWidths = [this.maxLength / 2, this.maxLength / 2]
		let alignLeft = [this.maxLength]
		const promises = data.map(async print => {
			if (print && typeof print === 'object') {
				let dp, opt = {}
				if (Array.isArray(print)) {
					dp = print
				} else {
					const { data, options } = print
					dp = data
					opt = options
				}
				if (typeof dp === 'string') {
					return BluetoothEscposPrinter.printText(dp, opt)
				} else {
					const [left, right] = dp
					if (right) {
						return BluetoothEscposPrinter.printColumn(
							columnWidths,
							[BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
							dp, opt
						)
					} else {
						return BluetoothEscposPrinter.printColumn(alignLeft, [BluetoothEscposPrinter.ALIGN.LEFT], [left], opt)
					}
				}
			} else if (typeof print === 'function') {
				return print()
			} else {
				if (print) return BluetoothEscposPrinter.printText(print, {})
			}
		})
		await Promise.all(promises)
		this.setState({ loading: false })
		this.props.navigation.goBack()
	}
}

function mapStateToProps(state) {
	return {
		Printer: state.Printer,
		User: state.User,
	}
}

export default connect(mapStateToProps, { addPrinter })(CetakStruk)

const styles = StyleSheet.create({
	wtf: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	name: {
		flex: 1,
		textAlign: "left",
	},
	address: {
		flex: 1,
		textAlign: "right",
	},
	connectedPrinter: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	switchView: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 15,
	},
})
