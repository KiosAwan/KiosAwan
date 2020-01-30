import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Text } from '../../components/Text/CustomText'
import ProgressIndicator from '../../components/StepIndicator/ProgressIndicator';
import { useSelector, useDispatch } from 'react-redux'
import { FloatingInputLabel } from '../../components/Input/InputComp';
import { SelectBoxModal, MyModal } from '../../components/Picker/SelectBoxModal';
import { getCategory } from '../../redux/actions/actionsStoreCategory';
import { addProductName, addProductImage, addProductIdCategory, addProductBarcode } from '../../redux/actions/actionsNewProduct';
import { GlobalHeader } from '../../components/Header/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { ColorsList } from '../../styles/colors';
import { Grid, Col, Icon } from 'native-base';
import { sendNewCategory, editCategory, validNumber } from '../../utils/authhelper';
import { Image } from 'src/components/CustomImage';
import { PickerImage } from 'src/components/Picker/PickerImage';
import { Button } from 'src/components/Button/Button';
import { Bottom } from 'src/components/View/Bottom';
import { Modal as ModalCustom, AwanPopup } from 'src/components/ModalContent/Popups'
import { Wrapper } from 'src/components/View/Wrapper';


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
	const [isDisabled, setDisabled] = useState(true)
	useEffect(() => {
		_checkName()
		dispatch(getCategory(User.store.id_store))

	}, [])
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
				dispatch(getCategory(User.store.id_store))
			}
			dispatch(getCategory(User.store.id_store))
			setAddCategoryVisible(false)
		}
	}
	return (
		<View style={styles.mainView}>
			<AwanPopup.Alert
				message={errorMessage}
				visible={errorAlert}
				closeAlert={() => setErrorAlert(false)}
			/>
			<GlobalHeader title="Tambah Produk" onPressBack={() => navigation.goBack()} />
			<ProgressIndicator
				firstIsCompleteStep={true}
				firstIsActiveStep={false}
				firstSeparator
				secondIsCompleteStep={false}
				secondIsActiveStep={true}
				thirdIsCompleteStep={false}
				thirdIsActiveStep={false}
			/>
			{/* <MyModal backdropDismiss={() => setAddCategoryVisible(false)} visible={addCategoryVisible} body={ */}
			<ModalCustom backdropDismiss={() => setAddCategoryVisible(false)} visible={addCategoryVisible} style={{ width: '80%' }}>
				<Text style={{ color: ColorsList.primaryColor }}>{editNewCategory == 'add' ? 'Kategori Baru' : 'Edit Kategori'}</Text>
				<View style={{ width: '100%', height: 1, backgroundColor: ColorsList.greySoft, marginTop: 5 }} />
				<View style={{ marginTop: 10 }}>
					<FloatingInputLabel
						label={"Nama Kategori"}
						value={newCategoryName}
						handleChangeText={(text) => setNewCategoryName(text)}
					/>
				</View>
				<View style={styles.viewButtonPopup}>
					<Button style={{ marginLeft: 10 }} onPress={_handleSaveNewCategory}>SIMPAN</Button>
					<Button onPress={() => setAddCategoryVisible(false)} color="white">BATAL</Button>
				</View>
			</ModalCustom>
			<ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
				<View styles={{ paddingHorizontal: 30 }}>
					<Wrapper style={{ marginBottom: 15 }} justify="space-between">
						<FloatingInputLabel _width="80%" handleChangeText={(text) => {
							if (validNumber(text)) {
								dispatch(addProductBarcode(text))
							}
						}} label="Nomor Barcode" value={NewProduct.barcode} />
						<Button onPress={() => navigation.goBack()}>
							<Image size={25} source={require('src/assets/icons/barcode.png')} />
						</Button>
					</Wrapper>
					<FloatingInputLabel
						disabled={isDisabled}
						label="Nama Produk"
						value={NewProduct.name}
						handleChangeText={(text) => text.length <= 45 ? dispatch(addProductName(text)) : null}
					/>
					<SelectBoxModal style={{ marginTop: 15 }}
						label="Pilih Kategori"
						header={
							<TouchableOpacity style={styles.headerCategory} onPress={() => {
								setNewCategoryName("")
								setEditNewCategory('add')
								setAddCategoryVisible(true)
							}}>
								<Text style={{ color: ColorsList.primaryColor }}>Tambah Kategori +</Text>
								<View style={{ width: '100%', height: 1, backgroundColor: ColorsList.greySoft, marginTop: 5 }} />
							</TouchableOpacity>
						}
						footer={
							<View style={styles.footerCategory}>
								<Text style={{ color: ColorsList.greyFont }}>BATAL</Text>
							</View>
						}
						value={selected}
						handleChangePicker={(item) => {
							setSelected(item.name_product_category)
							dispatch(addProductIdCategory(item.id_product_category))
						}}
						closeOnSelect
						data={Category.data}
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
				</View>

				<View style={{ marginTop: 25 }}>
					<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Produk</Text>
					<View style={styles.imageWrapper}>
						<TouchableOpacity onPress={() => rbRef.open()}>
							<Image style={styles.image}
								source={imageProduct ? { uri: imageProduct } : require('../../assets/images/img-product.png')}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
			<PickerImage close={() => rbRef.close()} imageResolve={_handleChoosePhoto} rbRef={ref => setRbRef(ref)} />
			<Bottom>
				<Button width="100%" onPress={_handlePressNext}>LANJUTKAN</Button>
			</Bottom>
		</View>
	);
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
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 200, borderColor: ColorsList.greyFont },
	image: { width: '100%', height: '100%' },

})
