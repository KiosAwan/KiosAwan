import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Dimensions, StyleSheet, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker'
import { useSelector, useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import { Grid, Col, Icon, Button } from 'native-base';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { MyModal, SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { Text } from 'src/components/Text/CustomText';
import { FloatingInputLabel } from 'src/components/Input/InputComp';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { getCategory } from 'src/redux/actions/actionsStoreCategory';


const width = Dimensions.get('window').width
const ManajemenProdukEdit = ({ navigation }) => {
	const dispatch = useDispatch()
	const NewProduct = useSelector(state => state.NewProduct)
	const User = useSelector(state => state.User)
	const Category = useSelector(state => state.Category)
	const [imageProduct, setImageProduct] = useState()
	const [newCategoryName, setNewCategoryName] = useState('')
	const [editNewCategory, setEditNewCategory] = useState('new')

	const [product, setProduct] = useState({})

	const [addCategoryVisible, setAddCategoryVisible] = useState(false)
	const [idEditCategory, setIdEditCategory] = useState()
	const [isDisabled, setDisabled] = useState(true)

	useEffect(() => {
		dispatch(getCategory(User.store.id_store))
		if (navigation.state.params) setProduct(navigation.state.params.product)
	}, [])


	const _handlePressNext = async () => {
		navigation.navigate('/drawer/manajemen/produk/edit/harga', {
			product: product
		})
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

	const _handleSaveNewCategory = async () => {
		if (newCategoryName == "") {
			alert("Nama tidak boleh kosong")
		} else {
			if (editNewCategory == 'add') {
				await sendNewCategory({
					id_store: User.store.id_store,
					name_product_category: newCategoryName
				})
				setNewCategoryName("")
			} else {
				await editCategory({
					category: newCategoryName,
				}, idEditCategory)
				dispatch(getCategory(User.store.id_store))
			}
			dispatch(getCategory(User.store.id_store))
			setAddCategoryVisible(false)
		}
	}
	return (
		<View style={styles.mainView}>
			<GlobalHeader title="Edit Produk" onPressBack={() => navigation.goBack()} />
			<MyModal backdropDismiss={() => setAddCategoryVisible(false)} visible={addCategoryVisible} body={
				<View style={{ padding: 15 }}>
					<Text style={{ color: ColorsList.primaryColor }}>{editNewCategory == 'add' ? 'New Category' : 'Edit Category'}</Text>
					<View style={{ width: '100%', height: 1, backgroundColor: ColorsList.greySoft, marginTop: 5 }} />
					<View style={{ marginTop: 10 }}>
						<FloatingInputLabel
							label={"Category Name"}
							value={newCategoryName}
							handleChangeText={(text) => setNewCategoryName(text)}
						/>
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
			} />
			<ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
				<View styles={{ paddingHorizontal: 30 }}>
					<Grid>
						<Col style={{ paddingRight: 10 }}>
							<FloatingInputLabel label="Barcode Number" disabled value={NewProduct.barcode} />
						</Col>
						<Col size={.2}>
							<Button onPress={() => navigation.navigate('/drawer/manajemen/produk/edit/barcode')} style={styles.buttonScanBarcode}>
								<Icon style={{ fontSize: 24 }} name="barcode" />
							</Button>
						</Col>
					</Grid>
					<View style={{ marginTop: 15 }}>
						<FloatingInputLabel
							disabled={false}
							label="Product Name"
							value={product.name_product}
							handleChangeText={text => setProduct({ ...product, name_product: text })}
						/>
					</View>
					<SelectBoxModal style={{ marginTop: 15 }}
						label="Select category"
						header={
							<TouchableOpacity style={styles.headerCategory} onPress={() => {
								setNewCategoryName("")
								setEditNewCategory('add')
								setAddCategoryVisible(true)
							}}>
								<Text style={{ color: ColorsList.primaryColor }}>Add Category +</Text>
								<View style={{ width: '100%', height: 1, backgroundColor: ColorsList.greySoft, marginTop: 5 }} />
							</TouchableOpacity>
						}
						footer={
							<View style={styles.footerCategory}>
								<Text style={{ color: ColorsList.greyFont }}>BATAL</Text>
							</View>
						}
						value={Category.data.map(cat => {
							if (cat.id_product_category == product.id_product_category) return cat.name_product_category
						}).join('')}
						handleChangePicker={(item) => {
							setProduct({ ...product, id_product_category: item.id_product_category })
						}}
						closeOnSelect
						data={Category.data}
						renderItem={(item) => [<Text color={
							item.id_product_category == product.id_product_category ?
								ColorsList.primaryColor : ColorsList.greyFont
						}>{item.name_product_category}</Text>, <Icon onPress={() => {
							setAddCategoryVisible(true)
							setEditNewCategory('edit')
							setNewCategoryName(item.name_product_category)
							setIdEditCategory(item.id_product_category)
						}} style={{
							color: item.id_product_category == product.id_product_category ?
								ColorsList.primaryColor : ColorsList.greySoft
						}} name="ios-create" />]}
					/>
				</View>

				<View style={{ marginTop: 25 }}>
					<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Produk</Text>
					<View style={styles.imageWrapper}>
						<TouchableOpacity onPress={_handleChoosePhoto}>
							<Image style={styles.image}
								source={imageProduct ? { uri: imageProduct } : require('src/assets/images/img-product.png')}
							/>
						</TouchableOpacity>
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

export default ManajemenProdukEdit

const styles = StyleSheet.create({
	mainView: { backgroundColor: ColorsList.authBackground, justifyContent: 'space-between', flex: 1 },
	scrollView: { padding: 10, paddingHorizontal: 20 },
	buttonScanBarcode: { borderRadius: 10, backgroundColor: ColorsList.primaryColor, width: '100%', height: '100%', justifyContent: 'center' },
	viewButtonPopup: { marginTop: 15, borderColor: 'transparent', flexDirection: 'row-reverse', alignItems: 'flex-end' },
	buttonSimpan: { margin: 5, paddingHorizontal: 30, backgroundColor: ColorsList.primaryColor },
	buttonBatal: { elevation: 0, backgroundColor: 'transparent', margin: 5, paddingHorizontal: 30 },
	headerCategory: { padding: 10, width: width - 80, alignItems: 'center' },
	footerCategory: { padding: 10, width: width - 80, alignItems: 'flex-end' },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },

})
