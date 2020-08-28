import axios from "src/utils/axios"
import React, { useState } from "react"
import {
	View,
	StyleSheet,
	Dimensions,
	Modal,
	TouchableOpacity,
} from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { CheckBox } from "native-base"
import { ScrollView } from "react-native-gesture-handler"
import {
	convertNumber,
	deleteProduct,
	validNumber,
	getUserToken,
} from "src/utils/authhelper"
import { getProduct } from "src/redux/actions/actionsStoreProduct"
import { GlobalHeaderWithIcon, IconHeader } from "src/components/Header/Header"
import ModalContent from "src/components/ModalContent/ModalContent"
import SwitchButton from "src/components/Button/SwitchButton"
import { ColorsList } from "src/styles/colors"
import { FontList } from "src/styles/typography"
import { RowChild } from "src/components/Helper/RowChild"
import {
	editRemoveAllNewProduct,
	editProductManageStock,
	editProductSendNotif,
	editProductPriceIn,
	editProductPriceOut,
	editQuantityStock,
	editMinQtyStock,
} from "src/redux/actions/actionsEditProduct"
import { HOST_URL } from "src/config"
import { AwanPopup } from "src/components/ModalContent/Popups"
import { Bottom } from "src/components/View/Bottom"
import { Button } from "src/components/Button/Button"
import { Wrapper } from "src/components/View/Wrapper"
import { Input } from "src/components/Input/MDInput"
import { SizeList } from "src/styles/size"
import Divider from "src/components/Row/Divider"
import { Text } from "src/components/Text/CustomText"

const width = Dimensions.get("window").width

const ManajemenProdukEditHarga = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const EditProduct = useSelector(state => state.EditProduct)

	const [apiLoading, setApiLoading] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [alert, setAlert] = useState(false)
	const [errorMessage, setErrorMessage] = useState()
	const [errorAlert, setErrorAlert] = useState(false)

	const _handlePressNext = async () => {
		setApiLoading(true)
		if (!EditProduct.price_in) {
			setErrorMessage("Harga modal tidak boleh kosong")
			setApiLoading(false)
			setErrorAlert(true)
		} else if (!EditProduct.price_out) {
			setErrorMessage("Harga jual tidak boleh kosong")
			setApiLoading(false)
			setErrorAlert(true)
		} else {
			let intPriceIn = convertNumber(EditProduct.price_in)
			let intPriceOut = convertNumber(EditProduct.price_out)
			if (EditProduct.price_in == "" || EditProduct.price_out == "") {
				setErrorMessage("Harap isi harga beli dan jual")
				setApiLoading(false)
				setErrorAlert(true)
			} else if (intPriceOut - intPriceIn < 0) {
				setErrorMessage("Harga jual harus melebihi harga modal")
				setApiLoading(false)
				setErrorAlert(true)
			} else {
				const formData = new FormData()
				await formData.append("barcode", EditProduct.barcode)
				await formData.append("name", EditProduct.name)
				await formData.append("price_in", intPriceIn)
				await formData.append("price_out", intPriceOut)
				await formData.append("id_category", EditProduct.id_category)
				await formData.append("id_store", User.store.id_store)
				await formData.append("manage_stock", EditProduct.manageStock)
				await formData.append("qty_stock", EditProduct.qty_stock)
				await formData.append("qty_min_stock", EditProduct.qty_min_stock)
				await formData.append(
					"send_notification_stock",
					EditProduct.sendNotif ? EditProduct.sendNotif : 0,
				)
				await formData.append(
					"photo_product",
					EditProduct.image != ""
						? EditProduct.temp_image != EditProduct.image
							? {
									uri: EditProduct.image,
									type: "image/jpeg",
									name: `${Date.now()}.jpeg`,
							  }
							: null
						: null,
				)
				try {
					const userToken = await getUserToken()
					const res = await axios.post(
						`${HOST_URL}/product_update/${EditProduct.id_product}`,
						formData,
						{
							headers: { authorization: userToken },
						},
					)
					setApiLoading(false)
					if (res.data.status == 200) {
						setModalVisible(true)
						setTimeout(() => {
							setModalVisible(false)
							dispatch(editRemoveAllNewProduct())
							dispatch(getProduct(User.store.id_store, userToken))
							navigation.navigate("/drawer/manajemen/produk")
						}, 1000)
					}
				} catch (err) {
					setApiLoading(false)
					alert(err.response.data.data.errors.msg)
				}
			}
		}
	}

	const _handleChangeToggle = () => {
		if (EditProduct.manageStock == 0) {
			dispatch(editProductManageStock(1))
		} else {
			dispatch(editProductManageStock(0))
		}
	}

	const _handleChangePriceIn = value => {
		dispatch(editProductPriceIn(value))
	}
	const _handleChangePriceOut = value => {
		dispatch(editProductPriceOut(value))
	}
	const _handleChangeStock = value => {
		const a = validNumber(value)
		if (a) {
			dispatch(editQuantityStock(value))
		}
	}
	const _handleChangeMinStock = value => {
		const a = validNumber(value)
		if (a) {
			dispatch(editMinQtyStock(value))
		}
	}
	const _handleDeleteProduct = async () => {
		const userToken = await getUserToken()
		await deleteProduct(EditProduct.id_product)
		setModalVisible(true)
		setTimeout(() => {
			setModalVisible(false)
			dispatch(editRemoveAllNewProduct())
			dispatch(getProduct(User.store.id_store, userToken))
			navigation.navigate("/drawer/manajemen/produk")
		}, 1000)
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<AwanPopup.Loading visible={apiLoading} />
			<AwanPopup.Alert
				message={errorMessage}
				visible={errorAlert}
				closeAlert={() => setErrorAlert(false)}
			/>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible)
				}}>
				<ModalContent
					image={require("src/assets/images/addproductsuccess.png")}
					infoText="Edit Produk Berhasil!"
				/>
			</Modal>
			<AwanPopup.Title
				title="Hapus Produk"
				visible={alert}
				message={`${EditProduct.name} akan dihapus dari daftar produk.`}>
				<View></View>
				<Button
					onPress={() => setAlert(false)}
					style={{ width: "25%" }}
					color="link">
					Batal
				</Button>
				<Button onPress={_handleDeleteProduct} style={{ width: "25%" }}>
					Ya
				</Button>
			</AwanPopup.Title>
			<GlobalHeaderWithIcon
				title="Edit Produk"
				onPressBack={() => navigation.goBack()}
				renderRightAccessory={() => (
					<TouchableOpacity onPress={() => setAlert(true)}>
						<IconHeader name="trash" color={ColorsList.greyFont} />
					</TouchableOpacity>
				)}
			/>
			<View style={styles.childContainer}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text>Masukkan harga modal dan harga jual produk</Text>
					<Wrapper style={{ marginVertical: SizeList.base }} spaceBetween>
						<Input
							_flex
							currency
							label="Harga modal"
							value={EditProduct.price_in}
							onChangeText={_handleChangePriceIn}
						/>
						<Divider size={SizeList.base} color={ColorsList.transparent} />
						<Input
							_flex
							currency
							label="Harga jual"
							value={EditProduct.price_out}
							onChangeText={_handleChangePriceOut}
						/>
					</Wrapper>
					<Wrapper spaceBetween>
						<Text>Kelola stok produk</Text>
						<SwitchButton
							handleChangeToggle={_handleChangeToggle}
							toggleValue={EditProduct.manageStock == 1 ? true : false}
						/>
					</Wrapper>
					{EditProduct.manageStock == 1 && (
						<View>
							<Wrapper style={{ marginVertical: SizeList.base }} spaceBetween>
								<Input
									_flex
									label="Jumlah stok"
									keyboardType="number-pad"
									value={EditProduct.qty_stock}
									onChangeText={_handleChangeStock}
								/>
								<Divider size={SizeList.base} color={ColorsList.transparent} />
								<Input
									_flex
									label="Minimum Stok"
									keyboardType="number-pad"
									value={EditProduct.qty_min_stock}
									onChangeText={_handleChangeMinStock}
								/>
							</Wrapper>
							<View style={{ ...RowChild, marginBottom: 20 }}>
								{/* <CheckBox
							checked={EditProduct.sendNotif == 0 ? false : true}
							color={EditProduct.sendNotif == 1 ? ColorsList.primary : ColorsList.greyFont}
							onPress={() => {
								if (EditProduct.sendNotif == 0) {
									dispatch(editProductSendNotif(1))
								} else {
									dispatch(editProductSendNotif(0))
								}
							}}
						/> */}
								{/* <Text style={[{ color: EditProduct.manageStock == 1 ? EditProduct.sendNotif ? ColorsList.primary : ColorsList.greyFont : ColorsList.greyFont }, styles.notifInfo]}>Jika stok produk sudah mencapai minimum stok akan diberikan notifikasi</Text> */}
								<Button
									textProps={{ align: "left", font: "Regular" }}
									color="info"
									style={{ borderRadius: SizeList.borderRadius }}>
									Jika stok produk sudah mencapai minimum stok akan ada
									notifikasi di list produk
									{/* <Text style={[{ color: manageStock ? sendNotif ? ColorsList.primary : ColorsList.greyFont : ColorsList.greyFont }, styles.notifInfo]}>Jika stok produk sudah mencapai minimum stok akan diberikan notifikasi</Text> */}
								</Button>
							</View>
						</View>
					)}
				</ScrollView>
			</View>
			<Bottom>
				<Button width="100%" onPress={_handlePressNext}>
					SIMPAN
				</Button>
			</Bottom>
		</View>
	)
}

export default ManajemenProdukEditHarga

const styles = StyleSheet.create({
	childContainer: {
		padding: SizeList.padding,
		backgroundColor: ColorsList.authBackground,
		flex: 1,
		justifyContent: "space-between",
	},
	infoText: {
		...FontList.titleFont,
		color: ColorsList.greyFont,
		fontSize: 16,
	},
	wrapInputHarga: {
		paddingVertical: 15,
		flexDirection: "row",
		paddingHorizontal: 10,
		marginBottom: 10,
	},
	inputTwoCol: {
		flex: 1,
	},
	wrapSwitchAndText: {
		...RowChild,
		justifyContent: "space-between",
		padding: 10,
	},
	absoluteButton: {
		bottom: 5,
		alignSelf: "center",
	},
	notifInfo: {
		...FontList.subtitleFont,
		marginLeft: 15,
	},
	groupingStyle: {
		backgroundColor: "white",
		borderRadius: 10,
		marginTop: 30,
		borderWidth: 2,
		borderColor: ColorsList.light,
	},
})
