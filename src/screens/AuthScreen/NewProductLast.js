import React, {useState} from 'react';
import { View, Modal, Text , TouchableOpacity,KeyboardAvoidingView } from 'react-native';
import CheckBox from '@react-native-community/checkbox'
import {useSelector, useDispatch} from 'react-redux'
import {Picker, Card} from 'native-base'
import { InputWithLabel } from '../../components/Input/InputComp';
import { RegisterButton } from '../../components/Button/ButtonComp';
import { addProductIdCategory, addProductPriceIn, addProductPriceOut, clearAllNewProduct, addQuantityStock, addMinQtyStock } from '../../redux/actions/actionsNewProduct';
import Axios from 'axios';
import { HOST_URL } from '../../config';
import { sendNewCategory, validNumber } from '../../utils/authhelper';
import { getCategory } from '../../redux/actions/actionsStoreCategory';
import SwitchButton from '../../components/Button/SwitchButton';
import { getProduct } from '../../redux/actions/actionsStoreProduct';
import { ScrollView } from 'react-native-gesture-handler';

const NewProductLast = ({navigation}) => {
    const dispatch = useDispatch()
    const NewProduct = useSelector(state => state.NewProduct)
    const User = useSelector(state => state.User)
    const Category = useSelector(state => state.Category)

    const [modalVisible , setModalVisible] = useState(false)
    const [categoryName , setCategoryName] = useState('')
    const [manageStock , setManageStock] = useState(false)
    const [sendNotif , setSendNotif] = useState(false)
    const [isDisabled , setIsDisabled] = useState(true)
    const _handlePressNext = async () => {
        const formData = new FormData() 
        await formData.append('barcode', NewProduct.barcode)
        await formData.append('name', NewProduct.name)
        await formData.append('price_in', NewProduct.price_in)
        await formData.append('price_out', NewProduct.price_out)
        await formData.append('id_category', NewProduct.id_category)
        await formData.append('id_store', User.store.id_store)
        await formData.append('manage_stock', manageStock ? 1 : 0)
        await formData.append('qty_stock', NewProduct.qty_stock)
        await formData.append('qty_min_stock', NewProduct.qty_min_stock)
        await formData.append('send_notification_stock', sendNotif ? 1 : 0)
        await formData.append('photo_product', NewProduct.image != "" ? {uri: NewProduct.image,
            type: "image/jpeg",
            name: `${Date.now()}.jpeg`} : null)
            console.log(formData)
        const response = await Axios.post(`${HOST_URL}/create_product`, formData)
        console.log(response)
        await dispatch(clearAllNewProduct())
        await dispatch(getProduct(User.store.id_store))
        navigation.navigate('Cashier')
    }

    const _handleChangeToggle = () => {
        setManageStock(!manageStock)
    }
    const _handleAddNewCategory = async () => {
        const data = {
            name_product_category : categoryName,
            id_store : User.store.id_store
        }
        const res = await sendNewCategory(data)
        await dispatch(getCategory(User.store.id_store))
        setModalVisible(!modalVisible)
    }

    const _handleChangePriceIn = (value) => {
        const a = validNumber(value)
        if(a){
            dispatch(addProductPriceIn(value))
            if(parseInt(NewProduct.price_out)- parseInt(value) >= 0){
                setIsDisabled(false)
            }else {
                setIsDisabled(true)
            }
        }
    }
    const _handleChangePriceOut = (value) => {
        const a = validNumber(value)
        if(a){
            dispatch(addProductPriceOut(value))
            if(parseInt(value)- parseInt(NewProduct.price_in) >= 0){
                setIsDisabled(false)
            }
            else {
                setIsDisabled(true)
            }
        }
    }
    const _handleChangeStock = (value) => {
        const a = validNumber(value)
        if(a){
            dispatch(addQuantityStock(value))
        }
    }
    const _handleChangeMinStock = (value) => {
        const a = validNumber(value)
        if(a){
            dispatch(addMinQtyStock(value))
        }
    }
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{padding : 20}}>
                <RegisterButton buttonTitle="Add New Category"
                onPressBtn={() => setModalVisible(true)}
                />
                <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                    <View style={{flex : 1, justifyContent: "center", padding : 70}}>
                        <Card style={{paddingVertical : 40, paddingHorizontal : 20}}>
                            <Text style={{fontSize : 20, textAlign : "center", paddingBottom : 30}}>New Category</Text>
                            <View style={{borderWidth : 1, marginBottom : 10}}>
                                <InputWithLabel
                                label="Category Name"
                                value={categoryName}
                                handleChangeText={(text) => setCategoryName(text)}
                                />
                            </View>
                            <View style={{flexDirection : 'row', justifyContent : 'space-around',paddingTop :20}}>
                                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                    <View>
                                        <Text>Cancel</Text>
                                    </View>                                  
                                </TouchableOpacity>
                                <TouchableOpacity onPress={_handleAddNewCategory} >
                                    <View>
                                        <Text>Add Category</Text>
                                    </View>                                  
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                </Modal>
                 <Picker
                    note
                    mode="dropdown"
                    style={{ width: 120 }}
                    selectedValue={NewProduct.id_category}
                    onValueChange={(value) => dispatch(addProductIdCategory(value))}
                    >
                    <Picker.Item  label="Choose Category"/>
                    {
                        Category.data.map((item) =>{
                        return(
                        <Picker.Item  label={item.name_product_category} value={item.id_product_category} key={item.id_product_category}/>
                        );
                        })
                    }
                </Picker>
                <View >
                    <InputWithLabel
                    label="Harga Beli"
                    keyboardType="numeric"
                    value={NewProduct.price_in}
                    handleChangeText={_handleChangePriceIn}
                    />
                    <InputWithLabel
                    label="Harga Jual"
                    keyboardType="numeric"
                    value={NewProduct.price_out}
                    handleChangeText={_handleChangePriceOut}
                    />
                </View>
                <View>
                    <SwitchButton
                    handleChangeToggle={_handleChangeToggle}
                    toggleValue={manageStock}
                    />
                    <View>
                        <InputWithLabel
                        label="Quantity"
                        keyboardType="numeric"
                        value={NewProduct.qty_stock}
                        handleChangeText={_handleChangeStock}
                        disabled={manageStock ? false : true}
                        />
                        <InputWithLabel
                        label="Stok Minimum"
                        keyboardType="numeric"
                        value={NewProduct.qty_min_stock}
                        handleChangeText={_handleChangeMinStock}
                        disabled={manageStock ? false : true}
                        />
                    </View>
                    <View style={{flexDirection : "row", alignItems :"center"}}>
                        <CheckBox
                        disabled={manageStock ? false : true}
                        value={sendNotif}
                        onValueChange={() => setSendNotif(!sendNotif)}
                        />
                        <Text style={{color : manageStock ? sendNotif ? null : 'grey' : 'grey'}}>Kirim notfikasi ketika stok minimum</Text>
                    </View>                   
                </View>
                <RegisterButton
                disabled={isDisabled}
                onPressBtn={_handlePressNext}
                buttonTitle="Create Product"
                />
            </ScrollView>
        );
    }

export default NewProductLast