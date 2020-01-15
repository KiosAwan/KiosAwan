import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { CheckBox } from 'native-base'
import { FloatingInputLabel, FloatingInputLabelCurrency } from '../../components/Input/InputComp';
import { BottomButton } from '../../components/Button/ButtonComp';
import { addProductPriceIn, addProductPriceOut, clearAllNewProduct, addQuantityStock, addMinQtyStock } from '../../redux/actions/actionsNewProduct';
import Axios from 'axios';
import { HOST_URL } from '../../config';
import { validNumber, convertNumber } from '../../utils/authhelper';
import SwitchButton from '../../components/Button/SwitchButton';
import { getProduct, removeAllCart } from '../../redux/actions/actionsStoreProduct';
import { GlobalHeader } from '../../components/Header/Header';
import ProgressIndicator from '../../components/StepIndicator/ProgressIndicator';
import { ColorsList } from '../../styles/colors';
import { FontList } from '../../styles/typography';
import { RowChild } from '../../components/Helper/RowChild';
import { ScrollView } from 'react-native-gesture-handler';
import ModalContent from '../../components/ModalContent/ModalContent';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const width = Dimensions.get('window').width

const NewProductLast = ({ navigation }) => {
	const dispatch = useDispatch()
	const NewProduct = useSelector(state => state.NewProduct)
	const User = useSelector(state => state.User)


	const [modalVisible, setModalVisible] = useState(false)
	const [manageStock, setManageStock] = useState(false)
	const [sendNotif, setSendNotif] = useState(false)
	const [apiLoading, setApiLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState()
	const [errorAlert, setErrorAlert] = useState(false)
	const _handlePressNext = async () => {
		if (!NewProduct.price_in) {
			setErrorMessage("Harga modal tidak boleh kosong")
			setErrorAlert(true)
		} else if (!NewProduct.price_out) {
			setErrorMessage("Harga jual tidak boleh kosong")
			setErrorAlert(true)
		}
		else {
			setApiLoading(true)
			let intPriceIn = convertNumber(NewProduct.price_in)
			let intPriceOut = convertNumber(NewProduct.price_out)
			if (NewProduct.price_in == "" || NewProduct.price_out == "") {
				setApiLoading(false)
				alert("Harap isi harga beli dan jual")
			} else if ((intPriceOut - intPriceIn) < 0) {
				setApiLoading(false)
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
					setApiLoading(false)
					setModalVisible(true)
					setTimeout(() => {
						setModalVisible(false)
						dispatch(clearAllNewProduct())
						dispatch(removeAllCart())
						dispatch(getProduct(User.store.id_store))
						if (NewProduct.fromManajemen) {
							navigation.navigate(NewProduct.fromManajemen.back)
						} else {
							navigation.navigate('/cashier')
						}
					}, 1000)
				}
				catch (error) {
					setApiLoading(false)
					setErrorMessage(error.response.data.data.errors.msg)
					setErrorAlert(true)
				}
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
					setModalVisible(!modalVisible);
				}}
			>
				<ModalContent
					image={require('../../assets/images/addproductsuccess.png')}
					infoText="Anda Berhasil Menambah Produk!"
				/>
			</Modal>
			<GlobalHeader title="Tambah Produk" onPressBack={() => navigation.goBack()} />
			<ProgressIndicator
				firstIsCompleteStep={true}
				firstIsActiveStep={false}
				firstSeparator
				secondSeparator
				secondIsCompleteStep={true}
				secondIsActiveStep={false}
				thirdIsCompleteStep={false}
				thirdIsActiveStep={true}
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

export default NewProductLast

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

