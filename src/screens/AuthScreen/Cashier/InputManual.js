import React, { useState } from 'react';
import MDInput, { Input, TextInput, shadowStyle } from 'src/components/Input/MDInput';
import Divider from 'src/components/Row/Divider';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import { View } from 'react-native';
import { validNumber, getRandomNegativeNum, convertNumber } from 'src/utils/authhelper';
import { useDispatch } from 'react-redux'
import { SizeList } from 'src/styles/size';
import { Image } from 'src/components/CustomImage';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { Button, ButtonShadow, RoundedButton } from 'src/components/Button/Button';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { AddCart } from 'src/redux/actions/actionsStoreProduct';
import { Text } from 'src/components/Text/CustomText';


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
	return <Container>
		<GlobalHeader title="Pesanan Manual" onPressBack={() => navigation.goBack()} />
		<AwanPopup.Alert
			message={errorMessage}
			visible={errorAlert}
			closeAlert={() => setErrorAlert(false)}
		/>
		<Body>
			<Input
				label="Nama Produk"
				value={name_product}
				onChangeText={setName}
			/>
			<Wrapper style={{ marginTop: SizeList.base }} spaceBetween>
				<Input _flex
					currency label="Harga modal"
					value={price_in_product}
					onChangeText={setPriceIn} />
				<Divider size={SizeList.base} color={ColorsList.transparent} />
				<Input _flex
					currency label="Harga jual"
					value={price_out_product}
					onChangeText={setPriceOut} />
			</Wrapper>
			<Text style={{ marginVertical: SizeList.base }}>Jumlah barang</Text>
			<Wrapper spaceBetween>
				<RoundedButton textProps={{ color: 'primary', size: SizeList.base * 2 }} onPress={_handleMinusQuantity}>-</RoundedButton>
				<Divider size={SizeList.base} color={ColorsList.transparent} />
				<TextInput _flex value={quantity.toString()}
					onChangeText={(text) => {
						if (validNumber(text)) {
							setQuantity(text)
						}
					}}
					keyboardType="number-pad"
					style={{ textAlign: 'center', fontSize: SizeList.base * 2 }}
				/>
				<Divider size={SizeList.base} color={ColorsList.transparent} />
				<RoundedButton textProps={{ color: 'primary', size: SizeList.base * 2 }} onPress={_handlePlusQuantity}>+</RoundedButton>
			</Wrapper>
		</Body>
		<Button style={{ marginHorizontal: SizeList.base, marginBottom: SizeList.base }} onPress={_handlePressBtn}>SIMPAN</Button>
	</Container>
	return <Container>
		<GlobalHeader title="Pesanan Manual" onPressBack={() => navigation.goBack()} />
		<AwanPopup.Alert
			message={errorMessage}
			visible={errorAlert}
			closeAlert={() => setErrorAlert(false)}
		/>
		<Body>
			<View style={{ elevation: 2, padding: SizeList.padding, backgroundColor: ColorsList.white, borderRadius: SizeList.borderRadius }}>
				<MDInput
					label="Nama Produk"
					value={name_product}
					onChangeText={setName}
				/>
				<Wrapper>
					<MDInput _flex
						currency label="Harga modal"
						value={price_in_product}
						onChangeText={setPriceIn} />
					<Divider size={20} color={ColorsList.transparent} />
					<MDInput _flex
						currency label="Harga jual"
						value={price_out_product}
						onChangeText={setPriceOut} />
				</Wrapper>
				<Wrapper>
					<Button color="link" onPress={_handleMinusQuantity}>
						<Image size={45} source={require('src/assets/icons/minusedit.png')} />
					</Button>
					<Input value={quantity.toString()}
						onChangeText={(text) => {
							if (validNumber(text)) {
								setQuantity(text)
							}
						}}
						keyboardType="number-pad"
						style={{
							fontSize: 25,
							color: ColorsList.greyFont,
							borderBottomWidth: 1,
							borderBottomColor: ColorsList.greyFont,
							textAlign: 'center'
						}}
					/>
					<Button color="link" onPress={_handlePlusQuantity}>
						<Image size={45} source={require('src/assets/icons/plusedit.png')} />
					</Button>
				</Wrapper>
			</View>
		</Body>
		<Footer>
			<Button onPress={_handlePressBtn}>SIMPAN</Button>
		</Footer>
	</Container>
}

export default InputManual