import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { Card, CheckBox } from 'native-base'
import { FloatingInputLabel } from '../../components/Input/InputComp';
import { BottomButton } from '../../components/Button/ButtonComp';
import { addProductPriceIn, addProductPriceOut, clearAllNewProduct, addQuantityStock, addMinQtyStock } from '../../redux/actions/actionsNewProduct';
import Axios from 'axios';
import { HOST_URL } from '../../config';
import { sendNewCategory, validNumber } from '../../utils/authhelper';
import { getCategory } from '../../redux/actions/actionsStoreCategory';
import SwitchButton from '../../components/Button/SwitchButton';
import { getProduct } from '../../redux/actions/actionsStoreProduct';
import { GlobalHeader } from '../../components/Header/Header';
import ProgressIndicator from '../../components/StepIndicator/ProgressIndicator';
import { ColorsList } from '../../styles/colors';
import { FontList } from '../../styles/typography';
import { RowChild } from '../../components/Helper/RowChild';
import SuccessAddProductModal from '../../components/ModalContent/SuccessAddProduct';
import { ScrollView } from 'react-native-gesture-handler';

const width = Dimensions.get('window').width

const NewProductLast = ({ navigation }) => {
    const dispatch = useDispatch()
    const NewProduct = useSelector(state => state.NewProduct)
    const User = useSelector(state => state.User)


    const [modalVisible, setModalVisible] = useState(false)
    const [manageStock, setManageStock] = useState(false)
    const [sendNotif, setSendNotif] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)

    const _handlePressNext = async () => {
        if(NewProduct.price_in =="" || NewProduct.price_out ==""){
            alert("Harap isi harga beli dan jual")
        }
        else {
        const formData = new FormData()
        await formData.append('barcode', NewProduct.barcode)
        await formData.append('name', NewProduct.name)
        await formData.append('price_in', NewProduct.price_in)
        await formData.append('price_out', NewProduct.price_out)
        await formData.append('id_category', NewProduct.id_category)
        await formData.append('id_store', User.store.id_store)
        await formData.append('manage_stock', manageStock ? 1 : 0)
        if (manageStock == 1) {
            await formData.append('qty_stock', NewProduct.qty_stock)
            await formData.append('qty_min_stock', NewProduct.qty_min_stock)
            await formData.append('send_notification_stock', sendNotif ? 1 : 0)
        }
        await formData.append('photo_product', NewProduct.image != "" ? {
            uri: NewProduct.image,
            type: "image/jpeg",
            name: `${Date.now()}.jpeg`
        } : null)
        try {
            const response = await Axios.post(`${HOST_URL}/create_product`, formData)
            setModalVisible(true)
            setTimeout(() => {
                setModalVisible(false)
                dispatch(clearAllNewProduct())
                dispatch(getProduct(User.store.id_store))
                navigation.navigate('Cashier')
            }, 1000)

        }
        catch (error) {
            alert(error.response.data.data.errors.msg)
        }
    }

    }

    const _handleChangeToggle = () => {
        setManageStock(!manageStock)
    }

    const _handleChangePriceIn = (value) => {
        const a = validNumber(value)
        if (a) {
            dispatch(addProductPriceIn(value))
            if (parseInt(NewProduct.price_out) - parseInt(value) >= 0) {
                setIsDisabled(false)
            } else {
                setIsDisabled(true)
            }
        }
    }
    const _handleChangePriceOut = (value) => {
        const a = validNumber(value)
        if (a) {
            dispatch(addProductPriceOut(value))
            if (parseInt(value) - parseInt(NewProduct.price_in) >= 0) {
                setIsDisabled(false)
            }
            else {
                setIsDisabled(true)
            }
        }
    }
    const _handleChangeStock = (value) => {
        const a = validNumber(value)
        if (a) {
            dispatch(addQuantityStock(value))
        }
    }
    const _handleChangeMinStock = (value) => {
        const a = validNumber(value)
        if (a) {
            dispatch(addMinQtyStock(value))
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <SuccessAddProductModal
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
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
            <View style={styles.childContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.groupingStyle}>
                        <View style={{ padding: 10 }}>
                            <Text style={styles.infoText}>Masukkan harga jual dan beli produk</Text>
                        </View>
                        <View style={styles.wrapInputHarga}>
                            <View style={[styles.inputTwoCol, { marginRight: 25 }]}>
                                <FloatingInputLabel
                                    label="Harga modal"
                                    keyboardType="numeric"
                                    value={NewProduct.price_in}
                                    handleChangeText={_handleChangePriceIn}
                                />
                            </View>
                            <View style={styles.inputTwoCol}>
                                <FloatingInputLabel
                                    label="Harga jual"
                                    keyboardType="numeric"
                                    value={NewProduct.price_out}
                                    handleChangeText={_handleChangePriceOut}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.groupingStyle}>
                        <View style={styles.wrapSwitchAndText}>
                            <Text style={{ ...FontList.titleFont, color: ColorsList.greyFont }}>Kelola stok produk</Text>
                            <SwitchButton
                                handleChangeToggle={_handleChangeToggle}
                                toggleValue={manageStock}
                            />
                        </View>
                        {manageStock ?
                            <View>
                                <View style={{ height: 1, backgroundColor: "#e0dada" }} />
                                <View style={styles.wrapInputHarga}>
                                    <View style={[styles.inputTwoCol, { marginRight: 25 }]}>
                                        <FloatingInputLabel
                                            label="Jumlah stok"
                                            keyboardType="numeric"
                                            value={NewProduct.qty_stock}
                                            handleChangeText={_handleChangeStock}
                                        />
                                    </View>
                                    <View style={styles.inputTwoCol}>
                                        <FloatingInputLabel
                                            label="Minimum Stok"
                                            keyboardType="numeric"
                                            value={NewProduct.qty_min_stock}
                                            handleChangeText={_handleChangeMinStock}
                                        />
                                    </View>
                                </View>
                                <View style={{ ...RowChild, marginBottom: 20, paddingHorizontal: 10 }}>
                                    <CheckBox
                                        checked={sendNotif}
                                        color={sendNotif ? "#cd0192" : "grey"}
                                        onPress={() => setSendNotif(!sendNotif)}
                                    />
                                    <Text style={[{ color: manageStock ? sendNotif ? '#cd0192' : 'grey' : 'grey' }, styles.notifInfo]}>Produk dengan stok menipis akan dikirimkan notifikasi</Text>
                                </View>
                            </View>
                            : null}

                    </View>
                </ScrollView>
                <View style={styles.absoluteButton}>
                    <BottomButton
                        onPressBtn={_handlePressNext}
                        buttonTitle="SIMPAN"
                        style={{ backgroundColor: ColorsList.primaryColor, width: width - 40 }}
                    />
                </View>
            </View>
        </View>
    );
}

export default NewProductLast

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

