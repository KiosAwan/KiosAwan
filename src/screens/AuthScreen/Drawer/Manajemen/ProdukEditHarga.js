import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { CheckBox } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler';
import { convertNumber } from 'src/utils/authhelper';
import { clearAllNewProduct, addMinQtyStock, addProductPriceOut, addProductPriceIn } from 'src/redux/actions/actionsNewProduct';
import { removeAllCart, getProduct } from 'src/redux/actions/actionsStoreProduct';
import { GlobalHeader } from 'src/components/Header/Header';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { FloatingInputLabelCurrency, FloatingInputLabel } from 'src/components/Input/InputComp';
import SwitchButton from 'src/components/Button/SwitchButton';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { RowChild } from 'src/components/Helper/RowChild';

const width = Dimensions.get('window').width

const ManajemenProdukEditHarga = ({ navigation }) => {
	useEffect(() => {
		if (navigation.state.params) setProduct(navigation.state.params.product)
	}, [])

	const [product, setProduct] = useState({})

	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const NewProduct = useSelector(state => state.NewProduct)


	const [modalVisible, setModalVisible] = useState(false)
	const [manageStock, setManageStock] = useState(false)
	const [sendNotif, setSendNotif] = useState(false)
	const [isDisabled, setIsDisabled] = useState(true)

	const _handlePressNext = async () => {
		let intPriceIn = convertNumber(NewProduct.price_in)
		let intPriceOut = convertNumber(NewProduct.price_out)
		if (NewProduct.price_in == "" || NewProduct.price_out == "") {
			alert("Harap isi harga beli dan jual")
		} else if ((intPriceOut - intPriceIn) < 0) {
			alert("Lu jualan apa sedekah? harga jual lu naikin lahh 🙃")
		} else {
			const formData = new FormData()
			await formData.append('barcode', NewProduct.barcode)
			await formData.append('name', NewProduct.name)
			await formData.append('price_in', intPriceIn)
			await formData.append('price_out', intPriceOut)
			await formData.append('id_category', NewProduct.id_category)
			await formData.append('id_store', User.store.id_store)
			await formData.append('manage_stock', manageStock ? 1 : 0)
			if (manageStock == 1) {
				await formData.append('qty_stock', NewProduct.qty_stock)
				await formData.append('qty_min_stock', NewProduct.qty_min_stock)
				await formData.append('send_notification_stock', sendNotif ? 1 : 0)
			}
			await formData.append('photo_product', NewProduct.image != "" ? {
				uri: NewProduct.image,
				type: "image/jpeg",
				name: `${Date.now()}.jpeg`
			} : null)
			try {
				const response = await Axios.post(`${HOST_URL}/product`, formData)
				setModalVisible(true)
				setTimeout(() => {
					setModalVisible(false)
					dispatch(clearAllNewProduct())
					dispatch(removeAllCart())
					dispatch(getProduct(User.store.id_store))
					navigation.navigate('/drawer/manajemen/produk')
				}, 1000)

			}
			catch (error) {
				alert(error.response.data.data.errors.msg)
			}
		}

	}

	const _handleChangeToggle = () => {
		setManageStock(!manageStock)
	}

	const _handleChangePriceIn = (value) => {
		dispatch(addProductPriceIn(value))
	}
	const _handleChangePriceOut = (value) => {
		dispatch(addProductPriceOut(value))
	}
	const _handleChangeStock = (value) => {
		const a = validNumber(value)
		if (a) {
			dispatch(addQuantityStock(value))
		}
	}
	const _handleChangeMinStock = (value) => {
		const a = validNumber(value)
		if (a) {
			dispatch(addMinQtyStock(value))
		}
	}
	return (
		<View style={{ flex: 1 }}>
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
					infoText="Anda Berhasil Menambah Produk!"
				/>
			</Modal>
			<GlobalHeader title="Tambah Produk" onPressBack={() => navigation.goBack()} />
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
									value={NewProduct.price_in}
									handleChangeText={_handleChangePriceIn}
								/>
							</View>
							<View style={styles.inputTwoCol}>
								<FloatingInputLabelCurrency style={{ margin: 0 }}
									label="Harga jual"
									value={NewProduct.price_out}
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
								toggleValue={manageStock}
							/>
						</View>
						{manageStock ?
							<View>
								<View style={{ height: 1, backgroundColor: "#e0dada" }} />
								<View style={styles.wrapInputHarga}>
									<View style={[styles.inputTwoCol, { marginRight: 25 }]}>
										<FloatingInputLabel
											label="Jumlah stok"
											keyboardType="numeric"
											value={NewProduct.qty_stock}
											handleChangeText={_handleChangeStock}
										/>
									</View>
									<View style={styles.inputTwoCol}>
										<FloatingInputLabel
											label="Minimum Stok"
											keyboardType="numeric"
											value={NewProduct.qty_min_stock}
											handleChangeText={_handleChangeMinStock}
										/>
									</View>
								</View>
								<View style={{ ...RowChild, marginBottom: 20, paddingHorizontal: 10 }}>
									<CheckBox
										checked={sendNotif}
										color={sendNotif ? "#cd0192" : "grey"}
										onPress={() => setSendNotif(!sendNotif)}
									/>
									<Text style={[{ color: manageStock ? sendNotif ? '#cd0192' : 'grey' : 'grey' }, styles.notifInfo]}>Produk dengan stok menipis akan dikirimkan notifikasi</Text>
								</View>
							</View>
							: null}

					</View>
				</ScrollView>
				<View style={styles.absoluteButton}>
					<BottomButton
						onPressBtn={_handlePressNext}
						buttonTitle="SIMPAN"
						style={{ backgroundColor: ColorsList.primaryColor, width: width - 40 }}
					/>
				</View>
			</View>
		</View>
	);
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

