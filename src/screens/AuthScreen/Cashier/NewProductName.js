import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Text } from 'src/components/Text/CustomText'
import ProgressIndicator from 'src/components/StepIndicator/ProgressIndicator';
import { useSelector, useDispatch } from 'react-redux'
import { FloatingInputLabel } from 'src/components/Input/InputComp';
import { SelectBoxModal, MyModal } from 'src/components/Picker/SelectBoxModal';
import { getCategory } from 'src/redux/actions/actionsStoreCategory';
import { addProductName, addProductImage, addProductIdCategory, addProductBarcode } from 'src/redux/actions/actionsNewProduct';
import { GlobalHeader } from 'src/components/Header/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { ColorsList } from 'src/styles/colors';
import { Grid, Col, Icon } from 'native-base';
import { sendNewCategory, editCategory, validNumber, getUserToken } from 'src/utils/authhelper';
import { Image } from 'src/components/CustomImage';
import { PickerImage } from 'src/components/Picker/PickerImage';
import { Button } from 'src/components/Button/Button';
import { Bottom } from 'src/components/View/Bottom';
import { Modal as ModalCustom, AwanPopup } from 'src/components/ModalContent/Popups'
import { Wrapper } from 'src/components/View/Wrapper';
import MDInput, { Input } from 'src/components/Input/MDInput';
import Divider from 'src/components/Row/Divider';
import SearchInput from 'src/components/Input/SearchInput';
import Container, { Body } from 'src/components/View/Container';
import { SizeList } from 'src/styles/size';
import { $Border } from 'src/utils/stylehelper';


const width = Dimensions.get('window').width
const NewProductName = ({ navigation }) => {
	const [rbRef, setRbRef] = useState({})
	const dispatch = useDispatch()
	const NewProduct = useSelector(state => state.NewProduct)
	const User = useSelector(state => state.User)
	const Category = useSelector(state => state.Category)
	const [selected, setSelected] = useState()
	const [imageProduct, setImageProduct] = useState()
	const [newCategoryName, setNewCategoryName] = useState('')
	const [editNewCategory, setEditNewCategory] = useState('new')
	const [errorMessage, setErrorMessage] = useState()
	const [errorAlert, setErrorAlert] = useState(false)
	const [addCategoryVisible, setAddCategoryVisible] = useState(false)
	const [idEditCategory, setIdEditCategory] = useState()
	const [searchCategory, setSearchCategory] = useState('')
	const [isDisabled, setDisabled] = useState(true)
	useEffect(() => {
		_effect()
	}, [])

	const _effect = async () => {
		const userToken = await getUserToken()
		_checkName()
		dispatch(getCategory(User.store.id_store, userToken))
	}
	const _checkName = () => {
		if (NewProduct.name == '') {
			setDisabled(false)
		}
	}
	const _handlePressNext = async () => {
		if (NewProduct.name == "") {
			setErrorMessage("Nama tidak boleh kosong")
			setErrorAlert(true)
		}
		else if (NewProduct.id_category == null) {
			setErrorMessage("Category tidak boleh kosong")
			setErrorAlert(true)
		}
		else {
			navigation.navigate('/cashier/new-product-last')
		}
	}

	const _handleChoosePhoto = image => {
		setImageProduct(image.path)
		dispatch(addProductImage(image.path))
	}

	const _handleSaveNewCategory = async () => {
		const userToken = await getUserToken()
		if (newCategoryName == "") {
			setErrorMessage("Nama tidak boleh kosong")
			setErrorAlert(true)
		}
		else {
			if (editNewCategory == 'add') {
				await sendNewCategory({
					id_store: User.store.id_store,
					name_product_category: newCategoryName
				})
				setNewCategoryName("")
			} else {
				await editCategory({
					name_product_category: newCategoryName,
				}, idEditCategory)
				dispatch(getCategory(User.store.id_store, userToken))
			}
			dispatch(getCategory(User.store.id_store, userToken))
			setAddCategoryVisible(false)
		}
	}
	return <Container style={{ marginBottom: SizeList.base }}>
		<GlobalHeader
			title="TAMBAH PRODUK"
			onPressBack={() => navigation.goBack()}
			renderRightAccessory={() => <Wrapper style={{ width: 30 }} spaceBetween>
				{[2, '/', 3].map(v => <Text color="primary" size={16}>{v}</Text>)}
			</Wrapper>}
		/>
		<AwanPopup.Alert
			message={errorMessage}
			visible={errorAlert}
			closeAlert={() => setErrorAlert(false)}
		/>
		<ModalCustom backdropDismiss={() => setAddCategoryVisible(false)} visible={addCategoryVisible} style={{ width: '80%' }}>
			<Text style={{ paddingHorizontal: 10, color: ColorsList.primaryColor }}>{editNewCategory == 'add' ? 'Kategori Baru' : 'Edit Kategori'}</Text>
			<Divider />
			<View style={{ paddingHorizontal: 10, marginTop: 10 }}>
				<MDInput
					label="Nama Kategori"
					value={newCategoryName}
					onChangeText={(text) => setNewCategoryName(text)}
				/>
			</View>
			<Wrapper justify="flex-end" style={{ paddingHorizontal: 10 }}>
				<Button onPress={() => setAddCategoryVisible(false)} color="white">BATAL</Button>
				<Button style={{ marginLeft: 10 }} onPress={_handleSaveNewCategory}>SIMPAN</Button>
			</Wrapper>
		</ModalCustom>
		<Body>
			<Input style={{ marginBottom: SizeList.base }} accessoryOut onChangeText={text => {
				if (validNumber(text)) {
					dispatch(addProductBarcode(text))
				}
			}} label="Nomor Barcode" renderRightAccessory={() => <Button width={40} onPress={() => navigation.goBack()}>
				<Image size={20} source={require('src/assets/icons/barcode.png')} />
			</Button>} value={NewProduct.barcode} />
			<Input
				inputStyle={{ marginTop: SizeList.base }}
				disabled={isDisabled}
				label="Nama Produk"
				value={NewProduct.name}
				onChangeText={(text) => text.length <= 45 ? dispatch(addProductName(text)) : null}
			/>
			<SelectBoxModal style={{ marginTop: SizeList.base }}
				label="Pilih Kategori"
				onOpen={() => setSearchCategory('')}
				header={
					<Input
						label="Cari Kategori"
						value={searchCategory}
						onChangeText={text => setSearchCategory(text)}
						renderLeftAccessory={() => <Icon size={15} style={{ color: ColorsList.primary }} name="search" />}
						renderRightAccessory={() => <Button onPress={() => {
							setNewCategoryName("")
							setEditNewCategory('add')
							setAddCategoryVisible(true)
						}}>Tambah</Button>}
					/>
				}
				value={selected}
				handleChangePicker={(item) => {
					setSelected(item.name_product_category)
					dispatch(addProductIdCategory(item.id_product_category))
				}}
				closeOnSelect
				data={Category.data.filter(v => v.name_product_category.toLowerCase().includes(searchCategory.toLowerCase()))}
				renderItem={(item) => [<Text style={{
					color: item.id_product_category == NewProduct.id_category ?
						ColorsList.primaryColor : ColorsList.greyFont
				}}>{item.name_product_category}</Text>, <Icon onPress={() => {
					setAddCategoryVisible(true)
					setEditNewCategory('edit')
					setNewCategoryName(item.name_product_category)
					setIdEditCategory(item.id_product_category)
				}} style={{
					color: item.id_product_category == NewProduct.id_category ?
						ColorsList.primaryColor : ColorsList.greySoft
				}} name="ios-create" />]}
			/>
			<Text style={{ marginVertical: SizeList.base }}>Unggah Foto Produk</Text>
			<TouchableOpacity style={[styles.imageWrapper, {
				alignItems: 'center'
			}]} onPress={() => rbRef.open()}>
				<Image style={{ height: 200, width: 200 }}
					source={imageProduct ? { uri: imageProduct } : require('src/assets/images/img-product.png')}
				/>
			</TouchableOpacity>
			<PickerImage close={() => rbRef.close()} imageResolve={_handleChoosePhoto} rbRef={ref => setRbRef(ref)} />
		</Body>
		<Button style={{ marginHorizontal: SizeList.base }} onPress={_handlePressNext}>LANJUTKAN</Button>
	</Container>

}


export default NewProductName

const styles = StyleSheet.create({
	mainView: { backgroundColor: ColorsList.authBackground, justifyContent: 'space-between', flex: 1 },
	scrollView: { marginBottom: 70, padding: 10, paddingHorizontal: 20 },
	buttonScanBarcode: { borderRadius: 10, backgroundColor: ColorsList.primaryColor, width: '100%', height: '100%', justifyContent: 'center' },
	viewButtonPopup: { marginTop: 15, borderColor: 'transparent', flexDirection: 'row-reverse', alignItems: 'flex-end' },
	buttonSimpan: { margin: 5, paddingHorizontal: 30, backgroundColor: ColorsList.primaryColor },
	buttonBatal: { elevation: 0, backgroundColor: 'transparent', margin: 5, paddingHorizontal: 30 },
	headerCategory: { padding: 10, width: width - 80, alignItems: 'center' },
	footerCategory: { padding: 10, width: width - 80, alignItems: 'flex-end' },
	imageWrapper: { marginBottom: 10, borderStyle: "dashed", borderColor: ColorsList.black, borderWidth: SizeList.borderWidth, height: 200, borderColor: ColorsList.greyFont, borderRadius : SizeList.borderRadius },
	image: { width: 300, height: 300 },

})
