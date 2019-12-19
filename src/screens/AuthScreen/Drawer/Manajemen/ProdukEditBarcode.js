ManajemenProdukEditBarcode


import React, { useState, useEffect } from "react";
import {
	Text,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet, Dimensions, Alert, BackHandler } from "react-native";
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { GlobalHeader } from "src/components/Header/Header";
import { addProductIdCategory, addProductName } from "src/redux/actions/actionsNewProduct";
import ProgressIndicator from "src/components/StepIndicator/ProgressIndicator";
import { BottomButton } from "src/components/Button/ButtonComp";
import { FontList } from "src/styles/typography";


const height = Dimensions.get('window').height

const ManajemenProdukEditBarcode = ({ navigation }) => {
	const dispatch = useDispatch()
	const NewProduct = useSelector(state => state.NewProduct)
	const [scanWork, setScanWork] = useState(true)
	const _onBarCodeRead = async (scanResult) => {
		setScanWork(false)
		const data = {
			barcode: scanResult.data
		}
		const response = await checkBarcode(data)

		await dispatch(addProductBarcode(response.data.barcode))

		if (response.data.nama_product != undefined) {
			Alert.alert(
				'',
				'Produk yang Anda scan ditemukan ',
				[
					{
						text: 'Lanjut', onPress: () => {
							setScanWork(true)
							dispatch(addProductName(response.data.nama_product))
							dispatch(addProductIdCategory(null))
							navigation.navigate('/cashier/new-product-name')
						}
					},
				],
				{ cancelable: false }
			)
		}
		else {
			Alert.alert(
				'',
				'Barang yang Anda scan tidak ditemukan',
				[
					{
						text: 'Lanjut', onPress: () => {
							setScanWork(true)
							dispatch(addProductName(''))
							dispatch(addProductIdCategory(null))
							navigation.navigate('/cashier/new-product-name')
						}
					},
				],
				{ cancelable: false }
			)
		}
	}
	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', (e) => {
			if (NewProduct.fromManajemen) {
				navigation.navigate(NewProduct.fromManajemen.back)
				backHandler.remove()
				return true
			}
			return false
		})
	})
	const _handleNoBarcode = () => {
		// dispatch(addProductName(''))
		// dispatch(addProductIdCategory(null))
		// navigation.navigate('/cashier/new-product-name')
		navigation.goBack()
	}
	return (
		<View style={{ flex: 1 }}>
			<GlobalHeader title="Tambah Produk" onPressBack={() => {
				if (NewProduct.fromManajemen) {
					navigation.navigate(NewProduct.fromManajemen.back)
				} else {
					navigation.goBack()
				}
			}} />
			<View style={{ justifyContent: "center" }}>
				<RNCamera
					style={styles.camera}
					onBarCodeRead={scanWork ? _onBarCodeRead : null}
					defaultTouchToFocus
					onFocusChanged={() => { }}
					ratio="1:1"
					autoFocus={RNCamera.Constants.AutoFocus.on}
				>
					<BarcodeMask
						width={300} height={300}
						showAnimatedLine
						transparency={0}
					/>
				</RNCamera>
			</View>

			<View style={styles.lowerSection}>
				<View style={{ alignItems: "center" }}>
					<Text style={{ marginTop: 30, fontFamily: FontList.primaryFont, color: 'white', fontSize: 20 }}>Pindai Barcode</Text>
					<View style={{ width: '70%', alignItems: 'center', marginTop: 10 }}>
						<Text style={{ color: 'white', textAlign: "center", fontFamily: FontList.primaryFont }}>Jika produk tidak memiliki barcode , Anda dapat melewati langkah ini.</Text>
					</View>
				</View>
				<View style={{ width: '100%', alignItems: "center" }}>
					<BottomButton
						onPressBtn={_handleNoBarcode}
						buttonTitle="LEWATI"
						style={{ borderWidth: 1, borderColor: 'white', bottom: 10, }}
					/>
				</View>
			</View>
		</View>
	)
}
export default ManajemenProdukEditBarcode

const styles = StyleSheet.create({
	lowerSection: {
		width: "100%",
		height: '80%',
		position: 'absolute',
		bottom: 0,
		backgroundColor: 'transparent',
		justifyContent: 'space-between'
	},
	camera: {
		// marginTop : height * 0.05,
		height: height * 0.92,
		alignItems: "flex-start",
	}
});
