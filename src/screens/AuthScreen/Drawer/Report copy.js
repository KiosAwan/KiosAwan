import React, { useState, useEffect } from "react"
import {
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
} from "react-native"
import { GlobalHeader } from "src/components/Header/Header"
import { ColorsList } from "src/styles/colors"
import { Text } from "src/components/Text/CustomText"
import { convertRupiah } from "src/utils/authhelper"
import { AwanPopup } from "src/components/ModalContent/Popups"
import { useSelector } from "react-redux"
import {
	getTransactionData,
	getReportCategory,
	getReportNonTunai,
} from "src/utils/authhelper"
import moment from "moment"
import { Wrapper } from "src/components/View/Wrapper"
import { Button } from "src/components/Button/Button"
import { RowChild } from "src/components/Helper/RowChild"
import Icon from "react-native-vector-icons/FontAwesome5"

const ReportOld = ({ navigation }) => {
	let _keuangan = ["pajak", "service_charge"]
	let _laba = ["harga_pokok_penjualan"]
	let _notConvert = ["jumlah_transaksi", "product_terjual"]
	const [_report] = useState({
		penjualan_kotor: "",
		discount: "",
		total_return: "Pembatalan",
		penjualan_bersih: "",
		harga_pokok_penjualan: "",
		pajak: "",
		service_charge: "",
	})
	const [categories, setCategory] = useState([])
	const [indexTab, setIndexTab] = useState(0)
	const [filter, setFilter] = useState(false)
	const [filterParam, setFilterParam] = useState({})
	const [detailPendapatan, setDetailPendapatan] = useState(false)
	const [detailPenjualan, setDetailPenjualan] = useState(false)
	const [transaction, setTransaction] = useState({})
	const [reportCategory, setReportCategory] = useState([])

	//Non Tunai
	const [detailNonTunai, setDetailNonTunai] = useState(false)
	const [modalFilterNonTunai, setModalFilterNonTunai] = useState(false)
	const [indexNonTunai, setIndexNonTunai] = useState(0)
	const [dataNonTunai, setDataNonTunai] = useState()
	const nonTunaiKey = [
		"Penjualan kotor",
		"Diskon",
		"Pembatalan",
		"Penjualan bersih",
		"Pajak",
	]

	const User = useSelector(state => state.User)
	const GetData = async param => {
		const res1 = await getTransactionData(User.store.id_store, param)
		const res2 = await getReportCategory(User.store.id_store, param)
		const res3 = await getReportNonTunai(User.store.id_store)
		setTransaction(res1.data)
		setReportCategory(res2.data)
		setDataNonTunai(res3.data)
	}
	useEffect(() => {
		GetData({})
		setCategory([])
	}, [])

	const format = "YYYY-MM-DD"
	const _handleFilter = async item => {
		let now = moment().set({ hours: 0, minutes: 0, seconds: 0 })
		let param = {
			from: now.add("month", item).endOf("month").set("date", 1).format(format),
			to: now.add("month", item).endOf("month").format(format),
		}
		setFilterParam(param)
		setFilter(false)
		GetData(param)
	}
	const _filterView = format => {
		return (filterParam.from ? moment(filterParam.from) : moment()).format(
			format,
		)
	}
	const _handleFilterNonTunai = i => {
		setIndexNonTunai(i)
		setModalFilterNonTunai(false)
	}
	const Keuangan = props => {
		return (
			<View>
				<Wrapper justify="space-between" style={styles.report}>
					<View>
						<Text font="Bold">
							{props.isLaba ? "Laba/Rugi Kotor" : "Total Pendapatan"}
						</Text>
						<Text font="ExtraBold" size={22} color="primary">
							{convertRupiah(
								indexTab == 0
									? transaction.total_penjualan
									: transaction.total_profit,
							)}
						</Text>
					</View>
					<TouchableOpacity
						onPress={() => setDetailPendapatan(!detailPendapatan)}
						style={{ justifyContent: "flex-end" }}>
						<Text font="ExtraBold" size={15}>
							DETAIL
						</Text>
					</TouchableOpacity>
				</Wrapper>
				{detailPendapatan ? (
					<View>
						{Object.keys(_report).rMap(key => {
							let toHide = indexTab == 0 ? _laba : _keuangan
							return toHide.includes(key) ? null : (
								<Wrapper justify="space-between" style={styles.report}>
									<Text>
										{_report[key]
											? _report[key]
											: key.split("_").join(" ").ucwords()}
									</Text>
									{_notConvert.includes(key) ? (
										<Text>{transaction[key]}</Text>
									) : (
										<Text>{convertRupiah(transaction[key])}</Text>
									)}
								</Wrapper>
							)
						})}
					</View>
				) : null}
				<View style={{ marginTop: 15, padding: 15, ...Bg.white }}>
					<Text color="primary" font="Bold">
						Laporan Non Tunai
					</Text>
					<TouchableOpacity
						onPress={() => setModalFilterNonTunai(true)}
						style={{
							borderBottomWidth: 1,
							borderColor: ColorsList.greyFont,
							marginVertical: 10,
						}}>
						<View style={[{ ...RowChild, justifyContent: "space-between" }]}>
							<Text size={16}>
								{dataNonTunai ? dataNonTunai[indexNonTunai].method : null}
							</Text>
							<Icon color={ColorsList.greyFont} size={17} name="chevron-down" />
						</View>
					</TouchableOpacity>
					<Wrapper justify="space-between">
						<View>
							<Text font="Bold">Total Pendapatan</Text>
							<Text font="ExtraBold" size={22} color="primary">
								{convertRupiah(
									dataNonTunai
										? dataNonTunai[indexNonTunai].penjualan_bersih
										: 0,
								)}
							</Text>
						</View>
						<TouchableOpacity
							onPress={() => setDetailNonTunai(!detailNonTunai)}>
							<Text font="ExtraBold" size={15}>
								DETAIL
							</Text>
						</TouchableOpacity>
					</Wrapper>
				</View>
				{detailNonTunai ? (
					dataNonTunai ? (
						<View>
							<Wrapper justify="space-between" style={styles.report}>
								<Text>{nonTunaiKey[0]}</Text>
								<Text>
									{convertRupiah(dataNonTunai[indexNonTunai].penjualan_kotor)}
								</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={styles.report}>
								<Text>{nonTunaiKey[1]}</Text>
								<Text>{convertRupiah(dataNonTunai[indexNonTunai].diskon)}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={styles.report}>
								<Text>{nonTunaiKey[2]}</Text>
								<Text>
									{convertRupiah(dataNonTunai[indexNonTunai].pembatalan)}
								</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={styles.report}>
								<Text>{nonTunaiKey[3]}</Text>
								<Text>
									{convertRupiah(dataNonTunai[indexNonTunai].penjualan_bersih)}
								</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={styles.report}>
								<Text>{nonTunaiKey[4]}</Text>
								<Text>{convertRupiah(dataNonTunai[indexNonTunai].pajak)}</Text>
							</Wrapper>
						</View>
					) : null
				) : null}
				<Wrapper
					justify="space-between"
					style={{ marginTop: 15, padding: 15, ...Bg.white }}>
					<Text color="primary" font="Bold">
						Laporan Penjualan
					</Text>
					<TouchableOpacity
						onPress={() => setDetailPenjualan(!detailPenjualan)}>
						<Text font="ExtraBold" size={15}>
							DETAIL
						</Text>
					</TouchableOpacity>
				</Wrapper>
				<View
					onLayout={({ nativeEvent: { layout } }) =>
						layout.height == 0 && categories.length > 0 ? setCategory([]) : null
					}>
					{detailPenjualan
						? reportCategory
								.sort((a, b) => b.id_category - a.id_category)
								.rMap((category, i) => {
									let _id = category.id_category
										? category.id_category
										: "~pesan_manual~"
									let _hasId = categories.includes(_id)
									if (!_hasId) categories.push(_id)
									return [
										_hasId ? null : (
											<Wrapper key={i} style={{ ...Bg.grey, padding: 10 }}>
												<Text font={category.id_category ? null : "BoldItalic"}>
													{category.id_category
														? category.nama_category
														: "Pesanan Manual"}
												</Text>
											</Wrapper>
										),
										category.data.rMap((item, index) => (
											<Wrapper
												key={index}
												justify="space-between"
												style={styles.report}>
												<View width="70%">
													<Text>{item.Product}</Text>
													<Text>{`${convertRupiah(item.harga_Satuan)} x ${
														item.jumlah
													}`}</Text>
												</View>
												<Wrapper direction="column" justify="center">
													<Text>{convertRupiah(item.harga)}</Text>
												</Wrapper>
											</Wrapper>
										)),
									]
								})
						: null}
				</View>
			</View>
		)
	}
	return (
		<View style={styles.wrapper}>
			<GlobalHeader
				title="Report"
				onPressBack={() => navigation.navigate("/drawer")}
			/>
			<AwanPopup.Menu
				backdropDismiss={() => setFilter(false)}
				visible={filter}
				title={_filterView("MMM, YYYY")}>
				<Button
					onPress={() => _handleFilter(0)}
					color="link"
					style={{ padding: 10 }}
					textProps={{ font: "Regular" }}
					align="flex-start">
					Bulan Ini
				</Button>
				<Button
					onPress={() => _handleFilter(-1)}
					color="link"
					style={{ padding: 10 }}
					textProps={{ font: "Regular" }}
					align="flex-start">
					Satu Bulan Lalu
				</Button>
				<Button
					onPress={() => _handleFilter(-2)}
					color="link"
					style={{ padding: 10 }}
					textProps={{ font: "Regular" }}
					align="flex-start">
					Dua Bulan Lalu
				</Button>
			</AwanPopup.Menu>
			{dataNonTunai ? (
				<AwanPopup.Menu
					backdropDismiss={() => setModalFilterNonTunai(false)}
					visible={modalFilterNonTunai}
					title="Pilih metode">
					{dataNonTunai.rMap((item, i) => (
						<Button
							key={i}
							onPress={() => _handleFilterNonTunai(i)}
							color="link"
							style={{ padding: 10 }}
							textProps={{ font: "Regular" }}
							align="flex-start">
							{item.method}
						</Button>
					))}
				</AwanPopup.Menu>
			) : null}
			<Wrapper justify="space-between" style={styles.filterWrapper}>
				<View style={{ justifyContent: "center" }}>
					<Text>{_filterView("MMMM YYYY")}</Text>
				</View>
				<Button onPress={() => setFilter(true)}>
					<Image
						style={{ width: 15, height: 15 }}
						source={require("src/assets/icons/filter.png")}
					/>
				</Button>
			</Wrapper>
			{transaction ? (
				<ScrollView>
					<View style={{ padding: 15 }}>
						<Wrapper justify="space-between" style={styles.report}>
							<Text>Total Penjualan</Text>
							<Text color="primary" font="Bold">
								{convertRupiah(transaction.total_penjualan)}
							</Text>
						</Wrapper>
						<Wrapper justify="space-between" style={styles.report}>
							<Text>Total Keuntungan</Text>
							<Text color="primary" font="Bold">
								{convertRupiah(transaction.total_profit)}
							</Text>
						</Wrapper>
						<Wrapper justify="space-between" style={styles.report}>
							<Text>Transaksi</Text>
							<Text color="primary" font="Bold">
								{transaction.jumlah_transaksi || 0}
							</Text>
						</Wrapper>
						<Wrapper justify="space-between" style={styles.report}>
							<Text>Produk Terjual</Text>
							<Text color="primary" font="Bold">
								{transaction.product_terjual || 0}
							</Text>
						</Wrapper>
					</View>
					<View style={{ padding: 15, paddingTop: 0 }}>
						<Wrapper style={styles.tabButtonWrapper}>
							{["LAPORAN KEUANGAN", "LAPORAN LABA/RUGI"].rMap((btn, i) => {
								return (
									<Button
										disabled={indexTab == i}
										key={i}
										onPress={() => setIndexTab(i)}
										color={indexTab == i ? "primary" : "white"}
										textProps={{ align: "center", size: 11 }}
										style={{ borderRadius: 0 }}
										_width="50%">
										{btn}
									</Button>
								)
							})}
						</Wrapper>
						{indexTab == 0 ? <Keuangan /> : <Keuangan isLaba />}
					</View>
				</ScrollView>
			) : (
				<View style={{ alignItems: "center" }}>
					<Image
						style={{ width: 350, height: 350 }}
						source={require("src/assets/images/no-transaction.png")}
					/>
					<View style={{ alignItems: "center" }}>
						<Text font="ExtraBold" size={17}>
							Anda belum memiliki transaksi
						</Text>
						<Text>Silahkan melalukan transaksi baru untuk mengisi laporan</Text>
					</View>
				</View>
			)}
		</View>
	)
}

export default ReportOld

let Bg = StyleSheet.create({
	white: { backgroundColor: ColorsList.whiteColor },
	grey: { backgroundColor: ColorsList.greyAuthHard },
})
const styles = StyleSheet.create({
	wrapper: { flex: 1, backgroundColor: ColorsList.authBackground },
	filterWrapper: { ...Bg.white, padding: 15, paddingHorizontal: 25 },
	report: { ...Bg.white, padding: 15, marginBottom: 1 },
	tabButtonWrapper: {
		padding: 15,
		paddingBottom: 0,
		backgroundColor: ColorsList.whiteColor,
	},
})
