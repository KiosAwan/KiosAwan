import styles from "./SubProductStyle"
import React, { useState, useEffect } from "react"
import MDInput, { Input } from "src/components/Input/MDInput"
import Divider from "src/components/Row/Divider"
import Container, { Footer, Body } from "src/components/View/Container"
import { Wrapper } from "src/components/View/Wrapper"
import { View, Image, Modal } from "react-native"
import { Text } from "src/components/Text/CustomText"
import { stateObject } from "src/utils/state"
import { SizeList } from "src/styles/size"
import { GlobalHeader } from "src/components/Header/Header"
import { getSubProducts, setMarginProduct } from "src/utils/api/setupharga"
import { Dropdown, AwanPopup } from "src/components/ModalContent/Popups"
import { convertRupiah, getUserToken } from "src/utils/authhelper"
import { ColorsList } from "src/styles/colors"
import { Button } from "src/components/Button/Button"
import { $Border } from "src/utils/stylehelper"
import BottomSheetSelect from "src/components/Picker/BottomSheetSelect"
import IconFA from "react-native-vector-icons/FontAwesome5"
import { Icon } from "native-base"
import ModalContent from "src/components/ModalContent/ModalContent"
import { useDispatch, useSelector } from "react-redux"
import { getProfile } from "src/redux/actions/actionsUserData"

const SubProduct = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const [dropdownVisible, setDropdownVisible] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [products, setProducts, resetProducts] = stateObject({})
	const [providerSelected, setProviderSelected] = useState()
	const [subProduct, setSubProduct] = useState([])
	const [product] = useState(navigation.state.params)
	const [productMargin, setProductMargin, resetProductMargin] = stateObject()
	const [alertProps, setAlertProps] = stateObject({
		title: "Perhatian",
		visible: false,
		closeAlert: () => setAlertProps({ visible: false }),
	})
	const _getSubData = async () => {
		const { data, status } = await getSubProducts(product.type)
		if (status == 200) {
			setSubProduct(data)
			if (data.length == 1) _selectProvider(data[0])
		}
	}

	const _selectProvider = async (provider, force) => {
		setDropdownVisible(false)
		if (
			force ||
			provider.code != (providerSelected ? providerSelected.code : null)
		) {
			if (!force && Object.keys(productMargin).length > 0) {
				setAlertProps({
					visible: true,
					message: "Silahkan simpan biaya admin anda terlebih dahulu",
				})
			} else {
				setProviderSelected(provider)
				const { data, status } = await getSubProducts(
					product.type,
					provider.code,
				)
				const objData = data.reduce((obj, item, i) => {
					let index =
						i.toString().length == 3
							? i
							: i.toString().length == 2
							? "0" + i
							: "00" + i
					let key = `${index} - ${item.name} - ${item.product_id}`
					item.oldMargin = item.margin
					item.oldPrice_sale = item.price_sale
					obj[key] = item
					return obj
				}, {})
				if (status == 200) {
					setTimeout(() => resetProducts(objData), 50)
				}
			}
		}
	}
	const _saveMargin = async () => {
		let { type } = product
		let finalMargins = Object.keys(products).map(key => {
			let {
				margin,
				price_sale,
				price,
				product_code,
				name,
				openCashback,
				...hh
			} = products[key] || {}
			if (product.product_type == 3) {
				margin = price_sale.toString().extractNumber() - price
			} else {
				if (parseInt(margin) < 2000) {
					return {}
				}
			}
			if (!product_code || ![false, true].includes(openCashback)) {
				return {}
			}
			return { product_code, product: name, margin, type }
		})
		const { status, data } = await setMarginProduct(
			finalMargins.filter(a => JSON.stringify(a) != "{}"),
		)
		if (status == 200) {
			_selectProvider(providerSelected, true)
			const userToken = await getUserToken()
			dispatch(getProfile(User.data.id, userToken))
			setModalVisible(true)
			setTimeout(() => {
				setModalVisible(false)
				navigation.goBack()
			}, 1000)
		} else {
			setAlertProps({
				visible: true,
				message: data.errors.msg,
			})
		}
	}

	const renderList = () => {
		if (product.product_type == 1) {
			return <View style={styles.viewShadow}>{renderProductType1()}</View>
		}
		if (product.product_type == 2) {
			return <View style={styles.viewShadow}>{renderProductType2()}</View>
		}
		if (product.product_type == 3) {
			return <View style={styles.viewShadow}>{renderProductType3()}</View>
		}
	}
	const renderProductType1 = () => {
		const _openCashback = key => {
			const data = {
				...products[key],
				openCashback: true,
			}
			setProducts({ [key]: data })
		}
		const _pilihCashback = (key, margin) => {
			const item = products[key]
			const cash_back = parseInt(margin) - parseInt(item.awan)
			const data = {
				...item,
				openCashback: false,
				cash_back,
				margin,
			}
			setProducts({ [key]: data })
		}
		const renderMap = (key, index) => {
			const item = products[key]
			return (
				<View>
					<Wrapper spaceBetween style={{ backgroundColor: ColorsList.white }}>
						<View style={{ padding: 10 }}>
							<Text color="greyFontHard">{item.name}</Text>
							{!item.openCashback && (
								<View>
									<Text>Admin : {convertRupiah(item.margin)}</Text>
									<Text>Cashback : {convertRupiah(item.cash_back)}</Text>
								</View>
							)}
						</View>
						{item.openCashback ? (
							<Text style={{ marginRight: SizeList.base }}>
								Cashback : {convertRupiah(item.cash_back)}
							</Text>
						) : (
							<Button color="linkPrimary" onPress={() => _openCashback(key)}>
								Pilih Biaya Admin
							</Button>
						)}
					</Wrapper>
					{item.openCashback && (
						<View
							style={{
								backgroundColor: ColorsList.white,
								paddingHorizontal: SizeList.base,
							}}>
							<Input
								currency
								disabled
								label="Biaya Admin Tercetak"
								value={item.margin.toString()}
							/>
							<Text style={{ marginTop: SizeList.secondary }}>
								Pilih jumlah biaya admin
							</Text>
							<Wrapper flexContent style={{ marginVertical: 10 }}>
								{[2000, 2500, 3000, 3500].rMap((btn, i) => {
									return (
										<Button
											key={i.toString()}
											active={btn.toString() == item.margin.toString()}
											style={{ marginHorizontal: 1 }}
											onPress={() => _pilihCashback(key, btn)}
											textProps={{ size: 10 }}
											color={["white", "greyFontHard", "borderColor"]}
											activeColor="primary"
											children={convertRupiah(btn)}
										/>
									)
								})}
							</Wrapper>
							<Button
								disabled
								style={{
									borderRadius: SizeList.borderRadius,
									marginBottom: 10,
								}}
								color={["cashbackBg"]}>
								<View>
									<Wrapper flexStart>
										<IconFA
											style={{
												color: ColorsList.cashbackFont,
												marginRight: SizeList.secondary,
											}}
											name="coins"
										/>
										<Text color="cashbackFont">CASHBACK</Text>
									</Wrapper>
									<Text color="cashbackFont">{`Cashback yang di dapat oleh mitra sebesar ${convertRupiah(
										item.cash_back,
									)}`}</Text>
								</View>
							</Button>
						</View>
					)}
					{index < dataProduct.length && <Divider />}
				</View>
			)
		}
		const dataProduct = Object.keys(products).sort((a, b) => a > b)
		return (
			<View style={{ flex: 1, paddingTop: 10 }}>
				<Text style={{ marginBottom: SizeList.base }}>
					Jumlah cashback menyesuaikan biaya admin yang dipilih
				</Text>
				{dataProduct.rMap(renderMap)}
			</View>
		)
	}

	const renderProductType2 = () => {
		return null
	}
	const renderProductType3 = () => {
		const dataProduct = Object.keys(products).sort((a, b) => a > b)
		return dataProduct.rMap((key, i) => {
			let item = products[key]
			let { price, product_id, name, price_sale } = item
			let _key = `${product_id}${name}`
			return (
				<View>
					<Wrapper
						key={i.toString()}
						style={styles.wrapper}
						justify="space-between">
						<View _flex style={styles.leftWrapper}>
							<Text font="SemiBold" color="greyFontHard">
								{name}
							</Text>
							<Text>Modal : {convertRupiah(price)}</Text>
						</View>
						<MDInput
							onChangeText={price_sale => {
								const data = { ...item, price_sale, openCashback: true }
								setProducts({ [key]: data })
							}}
							onBlur={() => {
								if (item.price_sale.extractNumber() < parseInt(item.price)) {
									const data = {
										...item,
										price_sale: item.oldPrice_sale,
										openCashback: false,
									}
									setProducts({ [key]: data })
									setAlertProps({
										visible: true,
										message: "Harga Jual Harus Lebih Besar Dari Harga Modal",
									})
								}
							}}
							currency
							_style={styles.rightWrapper}
							value={item.price_sale.toString()}
							label="Harga Jual"
						/>
					</Wrapper>
					{i < products.length && (
						<Divider style={{ paddingHorizontal: SizeList.padding }} />
					)}
				</View>
			)
		})
	}

	const render = () => {
		const [cari, setCari] = useState("")
		const selectFilter = subProduct //.filter(({ operator }) => operator.toLowerCase().includes(cari.toLowerCase()))
		return (
			<View style={{ flex: 1 }}>
				<Modal
					animationType="fade"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(!modalVisible)
					}}>
					<ModalContent
						image={require("src/assets/images/addproductsuccess.png")}
						infoText="Anda berhasil mengatur harga"
					/>
				</Modal>
				{["pulsa", "kuota"].includes(product.type) && (
					<BottomSheetSelect
						font="SemiBold"
						btnStyle={{ padding: SizeList.bodyPadding }}
						data={selectFilter}
						height={300}
						header={
							<Input
								noLabel
								value={cari}
								onChangeText={txt => setCari(txt)}
								label="Cari layanan seluler"
								renderRightAccessory={() => (
									<Icon style={{ color: ColorsList.primary }} name="search" />
								)}
							/>
						}
						value={
							!providerSelected ? "Layanan seluler" : providerSelected.operator
						}
						closeOnSelect
						noLabel
						keyExtractor={(a, i) => i.toString()}
						handleChangePicker={item => _selectProvider(item)}
						renderItem={(item, i) => (
							<Button
								padding={0}
								disabled
								key={i}
								width={SizeList.width}
								wrapper={{ justify: "flex-start" }}
								key={i}
								color="link">
								<Image
									style={{ width: 20, height: 20 }}
									_style={{ marginRight: 10 }}
									source={{ uri: item.image }}
								/>
								<Text font="SemiBold">{item.operator.toUpperCase()}</Text>
							</Button>
						)}
					/>
				)}
				<Body style={{ paddingTop: 0 }}>{renderList()}</Body>
				<Footer>
					<Button width="100%" onPress={_saveMargin}>
						SIMPAN
					</Button>
				</Footer>
			</View>
		)
	}

	useEffect(() => {
		_getSubData()
	}, [])

	return (
		<Container>
			<GlobalHeader
				title={`Atur Harga ${product.product}`}
				onPressBack={() => navigation.goBack()}
			/>
			<AwanPopup.Alert {...alertProps} />
			{render()}
		</Container>
	)
}

export default SubProduct
