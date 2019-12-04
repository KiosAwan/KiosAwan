import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker'
import { useSelector, useDispatch } from 'react-redux'
// import { Icon } from 'react-native-vector-icons/Ionicons'
import { InputWithLabel, FloatingInputLabel } from '../../components/Input/InputComp';
import { RegisterButton, BottomButton } from '../../components/Button/ButtonComp';
import { SelectBoxModal, MyModal } from '../../components/Picker/SelectBoxModal';
import { getCategory } from '../../redux/actions/actionsStoreCategory';
import { addProductName, addProductImage } from '../../redux/actions/actionsNewProduct';
import ProgressIndicator from '../../components/StepIndicator/ProgressIndicator';
import { GlobalHeader } from '../../components/Header/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { ColorsList } from '../../styles/colors';
import { Grid, Col, Icon, Button, Item } from 'native-base';


const width = Dimensions.get('window').width
const NewProductName = ({ navigation }) => {
	const dispatch = useDispatch()
	const NewProduct = useSelector(state => state.NewProduct)
	const User = useSelector(state => state.User)
	const [selected, setSelected] = useState()
	const [imageProduct, setImageProduct] = useState()
	const [categoryPickerVisible, setCategoryPickerVisible] = useState(false)
	const [addCategoryVisible, setAddCategoryVisible] = useState(false)

	const [isDisabled, setDisabled] = useState(true)
	useEffect(() => {
		_checkName()
	}, [])
	const _checkName = () => {
		if (NewProduct.name == '') {
			setDisabled(false)
		}
	}

	const _handlePressNext = async () => {
		if (NewProduct.name == "") {
			alert("Nama tidak boleh kosong")
		}
		else {
			await dispatch(getCategory(User.store.id_store))
			navigation.navigate('NewProductLast')
		}
	}

	const _handleChoosePhoto = () => {
		ImagePicker.openCamera({
			width: 300,
			height: 300,
			cropping: true
		}).then(image => {
			console.log(image.path)
			setImageProduct(image.path)
			dispatch(addProductImage(image.path))
		});
	};
	return (
		<View style={{ backgroundColor: ColorsList.authBackground, justifyContent: 'space-between', flex: 1 }}>
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
			<ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
				<View style={{ padding: 10 }}>
					<View>
						<Grid>
							<Col style={{ paddingRight: 10 }}>
								<FloatingInputLabel label="Barcode Number" disabled value={NewProduct.barcode} />
							</Col>
							<Col size={.2}>
								<Button onPress={() => navigation.goBack()} style={{ borderRadius: 10, backgroundColor: ColorsList.primaryColor, width: '100%', height: '100%', justifyContent: 'center' }}>
									<Icon style={{ fontSize: 22.5 }} name="barcode" />
								</Button>
							</Col>
						</Grid>
						<View style={{ marginTop: 15 }}>
							<FloatingInputLabel
								disabled={isDisabled}
								label="Product Name"
								value={NewProduct.name}
								handleChangeText={(text) => dispatch(addProductName(text))}
							/>
						</View>
						<MyModal backdropDismiss={() => setAddCategoryVisible(false)} visible={addCategoryVisible} body={
							<View style={{ padding: 15 }}>
								<FloatingInputLabel
									disabled={isDisabled}
									label="Product Name"
									value={NewProduct.name}
									handleChangeText={(text) => dispatch(addProductName(text))}
								/>
								<View style={{ marginTop: 15, borderColor: 'transparent', flexDirection: 'row-reverse', alignItems: 'flex-end' }}>
									<Button style={{ margin: 5, paddingHorizontal: 30, backgroundColor: ColorsList.primaryColor }}>
										<Text style={{ color: 'white' }}>Simpan</Text>
									</Button>
									<Button onPress={() => setAddCategoryVisible(false)} style={{ elevation: 0, backgroundColor: 'transparent', margin: 5, paddingHorizontal: 30 }}>
										<Text>Batal</Text>
									</Button>
								</View>
							</View>
						} />
						<SelectBoxModal style={{ marginTop: 15 }}
							label="Category"
							header={
								<TouchableOpacity style={{ padding: 10, width: width - 80, alignItems: 'center' }} onPress={() => setAddCategoryVisible(true)}>
									<Text>Add Category +</Text>
								</TouchableOpacity>
							}
							footer={
								<View style={{ padding: 10, width: width - 80, alignItems: 'flex-end' }}>
									<Text>Cancel</Text>
								</View>
							}
							value={selected}
							handleChangePicker={(item) => {
								setSelected(item.a)
							}}
							closeOnSelect={true}
							data={[{ a: 'akshd', b: 'ddsc' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }, { a: 'sdfdssf', b: 'sss' }]}
							renderItem={(item) => [<Text>{item.a}</Text>, <Icon name="grid" />]}
						/>
					</View>
					<View style={{ marginTop: 25 }}>
						<Text style={{ marginBottom: 10, alignSelf: 'center' }}>Unggah Foto Produk</Text>
						<View style={{ marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 }}>
							<TouchableOpacity onPress={_handleChoosePhoto}>
								<Image style={{ width: '100%', height: '100%' }} source={imageProduct ? { uri: imageProduct } : require('../../assets/images/img-product.png')} />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
			<View style={{
				bottom: 5,
				alignSelf: "center"
			}}>
				<BottomButton
					onPressBtn={_handlePressNext}
					buttonTitle="LANJUTKAN"
					style={{ backgroundColor: ColorsList.primaryColor, width: width - 40 }}
				/>
			</View>
		</View>
	);
}

export default NewProductName

