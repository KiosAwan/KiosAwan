import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux'
import { FloatingInputLabel, FloatingInputLabelCurrency } from '../../components/Input/InputComp';
import { BottomButton } from '../../components/Button/ButtonComp';
import { validNumber, getRandomNegativeNum, convertRupiah, convertNumber } from '../../utils/authhelper';
import { GlobalHeader } from '../../components/Header/Header';
import { ColorsList } from '../../styles/colors';
import { FontList } from '../../styles/typography';
import { RowChild } from '../../components/Helper/RowChild';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { AddCart } from '../../redux/actions/actionsStoreProduct';
import { Input, Icon, Button, Text } from 'native-base';
import { TextInputMask } from 'react-native-masked-text'


const width = Dimensions.get('window').width

const InputManual = ({ navigation }) => {
	const dispatch = useDispatch()
	const [name_product, setName] = useState("")
	const [price_in_product, setPriceIn] = useState("")
	const [price_out_product, setPriceOut] = useState("")
	const [quantity, setQuantity] = useState("0")
	const [qshsh, setQshsh] = useState()

	const _handlePressBtn = () => {
		if (name_product == "" || price_in_product == "" || price_out_product == "") {
			alert("Harap isi semua field")
		}
		else if (quantity == 0) {
			alert("Kuantitas tidak boleh nol")
		}
		else {
			const manualProduct = {
				name_product,
				price_in_product,
				price_out_product,
				quantity,
				id_product: getRandomNegativeNum()
			}
			dispatch(AddCart(manualProduct))
			navigation.goBack()
		}
	}

	const _handleMinusQuantity = () => {
		if (quantity > 0) {
			let a = parseInt(quantity) - 1
			setQuantity(a)
		}
	}
	const _handlePlusQuantity = () => {
		if (quantity != "") {
			let a = parseInt(quantity) + 1
			setQuantity(a)
		}
	}
	const _handleChangePriceIn = (value) => {
		// if (validNumber(value)) {
		setPriceIn(value)
		// }
	}

	const _handleChangePriceOut = (value) => {
		// if (validNumber(value)) {
		setPriceOut(value)
		// }
	}
	return (
		<View style={{ flex: 1 }}>
			<GlobalHeader title="Pesanan Manual" onPressBack={() => navigation.goBack()} />
			<View style={styles.childContainer}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.groupingStyle}>
						<View style={[styles.inputTwoCol, { margin: 10, justifyContent: "center" }]}>
							<FloatingInputLabel
								label="Nama Produk"
								value={name_product}
								handleChangeText={(text) => setName(text)}
							/>
						</View>
						<View style={styles.wrapInputHarga}>
							<View style={[styles.inputTwoCol, { marginRight: 25 }]}>
								<FloatingInputLabelCurrency style={{ margin: 0 }}
									label="Harga modal"
									value={price_in_product}
									handleChangeText={_handleChangePriceIn}
								/>
							</View>
							<View style={styles.inputTwoCol}>
								<FloatingInputLabelCurrency style={{ margin: 0 }}
									label="Harga modal"
									value={price_out_product}
									handleChangeText={_handleChangePriceOut}
								/>
							</View>
						</View>
						<View style={{ ...RowChild, justifyContent: "center", marginVertical: 30 }}>
							<TouchableOpacity onPress={_handleMinusQuantity}>
								<Icon name="remove-circle-outline" style={{ color: '#cd0196', fontSize: 40 }} />
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
								<Icon name="add-circle" style={{ color: '#cd0196', fontSize: 40 }} />
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
		borderColor: "#e0dada"
	}
})

