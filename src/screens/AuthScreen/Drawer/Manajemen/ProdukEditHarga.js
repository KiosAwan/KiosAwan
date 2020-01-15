import Axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { CheckBox } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler';
import { convertNumber, deleteProduct, validNumber } from 'src/utils/authhelper';
import { getProduct } from 'src/redux/actions/actionsStoreProduct';
import { GlobalHeaderWithIcon } from 'src/components/Header/Header';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { FloatingInputLabelCurrency, FloatingInputLabel } from 'src/components/Input/InputComp';
import SwitchButton from 'src/components/Button/SwitchButton';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { RowChild } from 'src/components/Helper/RowChild';
import { editRemoveAllNewProduct, editProductManageStock, editProductSendNotif, editProductPriceIn, editProductPriceOut, editQuantityStock, editMinQtyStock } from 'src/redux/actions/actionsEditProduct';
import { HOST_URL } from 'src/config';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';

const width = Dimensions.get('window').width

const ManajemenProdukEditHarga = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const EditProduct = useSelector(state => state.EditProduct)

	const [apiLoading, setApiLoading] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [alert, setAlert] = useState(false)

	const _handlePressNext = async () => {
		setApiLoading(true)
		let intPriceIn = convertNumber(EditProduct.price_in)
		let intPriceOut = convertNumber(EditProduct.price_out)
		if (EditProduct.price_in == "" || EditProduct.price_out == "") {
			alert("Harap isi harga beli dan jual")
		} else if ((intPriceOut - intPriceIn) < 0) {
			alert("Lu jualan apa sedekah? harga jual lu naikin lahh 🙃")
		} else {
			const formData = new FormData()
			await formData.append('barcode', EditProduct.barcode)
			await formData.append('name', EditProduct.name)
			await formData.append('price_in', intPriceIn)
			await formData.append('price_out', intPriceOut)
			await formData.append('id_category', EditProduct.id_category)
			await formData.append('id_store', User.store.id_store)
			await formData.append('manage_stock', EditProduct.manageStock)
			await formData.append('qty_stock', EditProduct.qty_stock)
			await formData.append('qty_min_stock', EditProduct.qty_min_stock)
			await formData.append('send_notification_stock', EditProduct.sendNotif ? EditProduct.sendNotif : 0)
			await formData.append('photo_product', EditProduct.image != "" ? EditProduct.temp_image != EditProduct.image ? {
				uri: EditProduct.image,
				type: "image/jpeg",
				name: `${Date.now()}.jpeg`
			} : null : null)
			try {
				const res = await Axios.post(`${HOST_URL}/product_update/${EditProduct.id_product}`, formData)
				setApiLoading(false)
				if (res.data.status == 200) {
					setModalVisible(true)
					setTimeout(() => {
						setModalVisible(false)
						dispatch(editRemoveAllNewProduct())
						dispatch(getProduct(User.store.id_store))
						navigation.navigate('/drawer/manajemen/produk')
					}, 1000)
				}
			}
			catch (err) {
				setApiLoading(false)
				alert(err.response.data.data.errors.msg)
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

	const _handleChangePriceIn = (value) => {
		dispatch(editProductPriceIn(value))
	}
	const _handleChangePriceOut = (value) => {
		dispatch(editProductPriceOut(value))
	}
	const _handleChangeStock = (value) => {
		const a = validNumber(value)
		if (a) {
			dispatch(editQuantityStock(value))
		}
	}
	const _handleChangeMinStock = (value) => {
		const a = validNumber(value)
		if (a) {
			dispatch(editMinQtyStock(value))
		}
	}
	const _handleDeleteProduct = async () => {
		await deleteProduct(EditProduct.id_product)
		setModalVisible(true)
		setTimeout(() => {
			setModalVisible(false)
			dispatch(editRemoveAllNewProduct())
			dispatch(getProduct(User.store.id_store))
			navigation.navigate('/drawer/manajemen/produk')
		}, 1000)
	}
	return <View style={{ flex: 1 }}>
		<AwanPopup.Loading visible={apiLoading} />
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(!modalVisible);
			}}
		>
			<ModalContent
				image={require('src/assets/images/addproductsuccess.png')}
				infoText="Edit Produk Berhasil!"
			/>
		</Modal>
		<AwanPopup.Title title="Hapus Produk" visible={alert} message={`${EditProduct.name} akan dihapus dari daftar produk.`}>
			<View></View>
			<Button onPress={() => setAlert(false)} style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Batal</Button>
			<Button onPress={_handleDeleteProduct} style={{ width: '25%' }} textProps={{ size: 15, font: 'Bold' }}>Ya</Button>
		</AwanPopup.Title>
		<GlobalHeaderWithIcon
			title="Edit Produk"
			onPressBack={() => navigation.goBack()}
			handleDeleteCategory={() => setAlert(true)}
			image={require('../../../../assets/icons/trash.png')}
		/>
		<View style={styles.childContainer}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.groupingStyle}>
					<View style={{ padding: 10 }}>
						<Text style={styles.infoText}>Masukkan harga jual dan beli produk</Text>
					</View>
					<View style={styles.wrapInputHarga}>
						<View style={[styles.inputTwoCol, { marginRight: 25 }]}>
							<FloatingInputLabelCurrency style={{ margin: 0 }}
								label="Harga modal"
								value={EditProduct.price_in}
								handleChangeText={_handleChangePriceIn}
							/>
						</View>
						<View style={styles.inputTwoCol}>
							<FloatingInputLabelCurrency style={{ margin: 0 }}
								label="Harga jual"
								value={EditProduct.price_out}
								handleChangeText={_handleChangePriceOut}
							/>
						</View>
					</View>
				</View>
				<View style={styles.groupingStyle}>
					<View style={styles.wrapSwitchAndText}>
						<Text style={{ ...FontList.titleFont, color: ColorsList.greyFont }}>Kelola stok produk</Text>
						<SwitchButton
							handleChangeToggle={_handleChangeToggle}
							toggleValue={EditProduct.manageStock == 0 ? false : true}
						/>
					</View>
					{
						EditProduct.manageStock == 1 ?
							<View>
								<View style={{ height: 1, backgroundColor: "#e0dada" }} />
								<View style={styles.wrapInputHarga}>
									<View style={[styles.inputTwoCol, { marginRight: 25 }]}>
										<FloatingInputLabel
											label="Jumlah stok"
											keyboardType="numeric"
											value={EditProduct.qty_stock}
											handleChangeText={_handleChangeStock}
										/>
									</View>
									<View style={styles.inputTwoCol}>
										<FloatingInputLabel
											label="Minimum Stok"
											keyboardType="numeric"
											value={EditProduct.qty_min_stock}
											handleChangeText={_handleChangeMinStock}
										/>
									</View>
								</View>
								<View style={{ ...RowChild, marginBottom: 20, paddingHorizontal: 10 }}>
									<CheckBox
										checked={EditProduct.sendNotif == 0 ? false : true}
										color={EditProduct.sendNotif == 1 ? "#cd0192" : "grey"}
										onPress={() => {
											if (EditProduct.sendNotif == 0) {
												dispatch(editProductSendNotif(1))
											} else {
												dispatch(editProductSendNotif(0))
											}
										}}
									/>
									<Text style={[{ color: EditProduct.manageStock == 1 ? EditProduct.sendNotif == 1 ? '#cd0192' : 'grey' : 'grey' }, styles.notifInfo]}>Produk dengan stok menipis akan dikirimkan notifikasi</Text>
								</View>
							</View>
							: null
					}
				</View>
			</ScrollView>
		</View>
		<Bottom>
			<Button width="100%" onPress={_handlePressNext}>SIMPAN</Button>
		</Bottom>
	</View>
}

export default ManajemenProdukEditHarga

const styles = StyleSheet.create({
	childContainer: {
		paddingHorizontal: 20,
		backgroundColor: ColorsList.authBackground,
		flex: 1,
		justifyContent: "space-between"
	},
	infoText: {
		...FontList.titleFont,
		color: ColorsList.greyFont,
		fontSize: 16
	},
	wrapInputHarga: {
		paddingVertical: 15,
		flexDirection: 'row',
		paddingHorizontal: 10,
		marginBottom: 10
	},
	inputTwoCol: {
		flex: 1
	},
	wrapSwitchAndText: {
		...RowChild,
		justifyContent: 'space-between',
		padding: 10
	},
	absoluteButton: {
		bottom: 5,
		alignSelf: "center"
	},
	notifInfo: {
		...FontList.subtitleFont,
		marginLeft: 15
	},
	groupingStyle: {
		backgroundColor: 'white',
		borderRadius: 10,
		marginTop: 30,
		borderWidth: 2,
		borderColor: "#e0dada"
	}
})

