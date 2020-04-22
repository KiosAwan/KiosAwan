import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Dimensions, StyleSheet, View, Modal, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import { Grid, Col, Icon } from 'native-base';
import { GlobalHeaderWithIcon } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { Text } from 'src/components/Text/CustomText';
import { } from 'src/components/Input/InputComp';
import { getCategory } from 'src/redux/actions/actionsStoreCategory';
import { editProductImage, editProductIdCategory, editProductName, editRemoveAllNewProduct, editProductBarcode } from 'src/redux/actions/actionsEditProduct';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { sendNewCategory, editCategory, deleteProduct, getUserToken } from 'src/utils/authhelper';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { getProduct } from 'src/redux/actions/actionsStoreProduct';
import { PickerImage } from 'src/components/Picker/PickerImage';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Modal as ModalCustom } from 'src/components/ModalContent/Popups'
import MDInput from 'src/components/Input/MDInput';


const width = Dimensions.get('window').width
const ManajemenProdukEdit = ({ navigation }) => {
	const dispatch = useDispatch()
	const EditProduct = useSelector(state => state.EditProduct)
	const User = useSelector(state => state.User)
	const Category = useSelector(state => state.Category)
	const [newCategoryName, setNewCategoryName] = useState('')
	const [editNewCategory, setEditNewCategory] = useState('new')
	const [alert, setAlert] = useState(false)
	const [addCategoryVisible, setAddCategoryVisible] = useState(false)
	const [idEditCategory, setIdEditCategory] = useState()
	const [modalVisible, setModalVisible] = useState(false)
	useEffect(() => {
		_effect()
	}, [])

	const _effect = async () => {
		const userToken = await getUserToken()
		dispatch(getCategory(User.store.id_store, userToken))
	}


	const _handlePressNext = async () => {
		if (EditProduct.name == "") {
			alert("Nama tidak boleh kosong")
		} else {
			navigation.navigate('/drawer/manajemen/produk/edit/harga')
		}
	}
	const [rbRef, setRbRef] = useState({})
	const _handleChoosePhoto = image => {
		dispatch(editProductImage(image.path))
	};

	const _handleSaveNewCategory = async () => {
		if (newCategoryName == "") {
			alert("Nama tidak boleh kosong")
		} else {
			const userToken = await getUserToken()
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

	const __handleDeleteProduct = async () => {
		const userToken = await getUserToken()
		await deleteProduct(EditProduct.id_product)
		setAlert(false)
		setModalVisible(true)
		setTimeout(() => {
			setModalVisible(false)
			dispatch(editRemoveAllNewProduct())
			dispatch(getProduct(User.store.id_store, userToken))
			navigation.navigate('/drawer/manajemen/produk')
		}, 1000)
	}
	return (
		<View style={styles.mainView}>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<ModalContent
					image={require('src/assets/images/managemenproduksukses.png')}
					infoText="Hapus Produk Berhasil!"
				/>
			</Modal>
			<AwanPopup.Title title="Hapus Produk" visible={alert} message={`${EditProduct.name} akan dihapus dari daftar produk.`}>
				<View></View>
				<Button onPress={() => setAlert(false)} style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Batal</Button>
				<Button onPress={__handleDeleteProduct} style={{ width: '25%' }} textProps={{ size: 15, font: 'Bold' }}>Ya</Button>
			</AwanPopup.Title>
			<GlobalHeaderWithIcon
				image={require('../../../../assets/icons/trash.png')}
				title="Edit Produk"
				handleDeleteCategory={() => setAlert(true)}
				onPressBack={() => navigation.goBack()} />

			<ModalCustom backdropDismiss={() => setAddCategoryVisible(false)} visible={addCategoryVisible}>
				<View style={{ padding: 15 }}>
					<Text style={{ color: ColorsList.primaryColor }}>{editNewCategory == 'add' ? 'Kategori Baru' : 'Edit Kategori'}</Text>
					<View style={{ width: '100%', height: 1, backgroundColor: ColorsList.greySoft, marginTop: 5 }} />
					<View style={{ marginTop: 10 }}>
						<MDInput label={"Nama Kategori"} value={newCategoryName} onChangeText={(text) => setNewCategoryName(text)} />
					</View>
					<View style={styles.viewButtonPopup}>
						<Button style={styles.buttonSimpan} onPress={_handleSaveNewCategory}>
							<Text style={{ color: 'white' }}>SIMPAN</Text>
						</Button>
						<Button onPress={() => setAddCategoryVisible(false)} style={styles.buttonBatal}>
							<Text style={{ color: ColorsList.greyFont }}>BATAL</Text>
						</Button>
					</View>
				</View>
			</ModalCustom>
			<ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
				<View styles={{ paddingHorizontal: 30 }}>
					<Grid>
						<Col style={{ paddingRight: 10 }}>
							<MDInput label="Nomor Barcode" onChangeText={(text) => dispatch(editProductBarcode(text))} value={EditProduct.barcode} />
						</Col>
						<Col style={{ justifyContent: 'flex-end' }} size={.2}>
							<Button onPress={() => navigation.navigate('/drawer/manajemen/produk/edit/barcode')} style={styles.buttonScanBarcode}>
								<Icon style={{ fontSize: 24, color: ColorsList.whiteColor }} name="barcode" />
							</Button>
						</Col>
					</Grid>
					<View style={{ marginTop: 15 }}>
						<MDInput label="Nama Produk"
							editable={false}
							value={EditProduct.name}
							onChangeText={text => text.length <= 45 ? dispatch(editProductName(text)) : null}
						/>
					</View>
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
						value={Category.data.map(cat => {
							if (cat.id_product_category == EditProduct.id_category) return cat.name_product_category
						}).join('')}
						handleChangePicker={(item) => {
							dispatch(editProductIdCategory(item.id_product_category))
						}}
						closeOnSelect
						data={Category.data}
						renderItem={(item) => [<Text color={
							item.id_product_category == EditProduct.id_category ?
								ColorsList.primaryColor : ColorsList.greyFont
						}>{item.name_product_category}</Text>, <Icon onPress={() => {
							setAddCategoryVisible(true)
							setEditNewCategory('edit')
							setNewCategoryName(item.name_product_category)
							setIdEditCategory(item.id_product_category)
						}} style={{
							color: item.id_product_category == EditProduct.id_category ?
								ColorsList.primaryColor : ColorsList.greySoft
						}} name="ios-create" />]}
					/>
				</View>

				<View style={{ marginTop: 25 }}>
					<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Produk</Text>
					<View style={styles.imageWrapper}>
						<TouchableOpacity onPress={() => rbRef.open()}>
							<Image style={styles.image}
								source={EditProduct.image !== "" ? { uri: EditProduct.image } : require('src/assets/images/img-product.png')}
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

export default ManajemenProdukEdit

const styles = StyleSheet.create({
	mainView: { backgroundColor: ColorsList.authBackground, justifyContent: 'space-between', flex: 1 },
	scrollView: { padding: 10, paddingHorizontal: 20 },
	buttonScanBarcode: { borderRadius: 10, backgroundColor: ColorsList.primaryColor, width: '80%', alignSelf: 'flex-end', height: '80%', justifyContent: 'center' },
	viewButtonPopup: { marginTop: 15, borderColor: 'transparent', flexDirection: 'row-reverse', alignItems: 'flex-end' },
	buttonSimpan: { margin: 5, paddingHorizontal: 30, backgroundColor: ColorsList.primaryColor },
	buttonBatal: { elevation: 0, backgroundColor: 'transparent', margin: 5, paddingHorizontal: 30 },
	headerCategory: { padding: 10, width: width - 80, alignItems: 'center' },
	footerCategory: { padding: 10, width: width - 80, alignItems: 'flex-end' },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },

})
