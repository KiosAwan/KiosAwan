import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux'
import { FloatingInputLabel, FloatingInputLabelCurrency } from '../../components/Input/InputComp';
import { BottomButton } from '../../components/Button/ButtonComp';
import { validNumber, getRandomNegativeNum, convertNumber } from '../../utils/authhelper';
import { GlobalHeader } from '../../components/Header/Header';
import { ColorsList } from '../../styles/colors';
import { FontList } from '../../styles/typography';
import { RowChild } from '../../components/Helper/RowChild';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { AddCart } from '../../redux/actions/actionsStoreProduct';
import { Input, Icon, Button, Text } from 'native-base';
import { TextInputMask } from 'react-native-masked-text'
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Image } from 'src/components/CustomImage';


const width = Dimensions.get('window').width

const InputManual = ({ navigation }) => {
	const dispatch = useDispatch()
	const [name_product, setName] = useState("")
	const [price_in_product, setPriceIn] = useState("")
	const [price_out_product, setPriceOut] = useState("")
	const [quantity, setQuantity] = useState("0")

	//error
	const [errorMessage, setErrorMessage] = useState()
	const [errorAlert, setErrorAlert] = useState(false)

	const _handlePressBtn = () => {
		if (name_product == "" || price_in_product == "" || price_out_product == "") {
			setErrorMessage("Harap isi semua field")
			setErrorAlert(true)
		}
		else if (quantity == 0) {
			setErrorMessage("Kuantitas tidak boleh nol")
			setErrorAlert(true)
		}
		else if (price_out_product.extractNumber() < price_in_product.extractNumber()) {
			setErrorMessage("Harga jual harus melebihi harga modal")
			setErrorAlert(true)
		}
		else {
			const manualProduct = {
				name_product,
				price_in_product: convertNumber(price_in_product),
				price_out_product: convertNumber(price_out_product),
				quantity,
				id_product: getRandomNegativeNum()
			}
			dispatch(AddCart(manualProduct))
			navigation.goBack()
		}
	}

	const _handleMinusQuantity = () => {
		if (parseInt(quantity) > 0) {
			let a = parseInt(quantity) - 1
			setQuantity(a)
		}
	}
	const _handlePlusQuantity = () => {
		let a = parseInt(quantity == "" ? 0 : quantity) + 1
		setQuantity(a)
	}
	const _handleChangePriceIn = (value) => {
		setPriceIn(value)
	}
	const _handleChangePriceOut = (value) => {
		setPriceOut(value)
	}
	return (
		<View style={{ flex: 1 }}>
			<AwanPopup.Alert
				message={errorMessage}
				visible={errorAlert}
				closeAlert={() => setErrorAlert(false)}
			/>
			<GlobalHeader title="Pesanan Manual" onPressBack={() => navigation.goBack()} />
			<View style={styles.childContainer}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.groupingStyle}>
						<View style={[styles.inputTwoCol, { margin: 10, justifyContent: "center" }]}>
							<FloatingInputLabel
								label="Nama Produk"
								value={name_product}
								handleChangeText={(text) => setName(text)}
								keyboardType="number-pad"
							/>
						</View>
						<View style={styles.wrapInputHarga}>
							<View style={[styles.inputTwoCol, { marginRight: 25 }]}>
								<FloatingInputLabelCurrency style={{ margin: 0 }}
									label="Harga modal"
									value={price_in_product}
									handleChangeText={_handleChangePriceIn}
									keyboardType="number-pad"
								/>
							</View>
							<View style={styles.inputTwoCol}>
								<FloatingInputLabelCurrency style={{ margin: 0 }}
									label="Harga jual"
									value={price_out_product}
									handleChangeText={_handleChangePriceOut}
								/>
							</View>
						</View>
						<View style={{ ...RowChild, justifyContent: "center", marginVertical: 30 }}>
							<TouchableOpacity onPress={_handleMinusQuantity}>
							<Image size={45} source={require('src/assets/icons/minusedit.png')} />
							</TouchableOpacity>
							<View style={{ marginHorizontal: 20, alignItems: 'center', width: 100, }}>
								<Input value={quantity.toString()}
									onChangeText={(text) => {
										if (validNumber(text)) {
											setQuantity(text)
										}
									}}
									style={{ fontSize: 25, color: ColorsList.greyFont, borderBottomWidth: 1, borderBottomColor: ColorsList.greyFont }}
								/>
							</View>
							<TouchableOpacity onPress={_handlePlusQuantity}>
								<Image size={45} source={require('src/assets/icons/plusedit.png')} />
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
				<View style={styles.absoluteButton}>
					<BottomButton
						onPressBtn={_handlePressBtn}
						buttonTitle="SIMPAN"
						style={{ backgroundColor: ColorsList.primaryColor, width: width - 40 }}
					/>
				</View>
			</View>
		</View>
	);
}

export default InputManual

const Wow = props => {
	const [value, setValue] = useState('')
	const [valueInt, setValueInt] = useState()
	const _onChange = text => {
		setValue(text)
	}
	return <Input
		value={value}
		keyboardType={"numeric"}
		onChangeText={_onChange}
	/>
}

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
		borderColor: ColorsList.light
	}
})

