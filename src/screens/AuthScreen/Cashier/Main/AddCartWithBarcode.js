import React, { useState } from 'react'
import { View, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { AddCartByBarcode } from 'src/redux/actions/actionsStoreProduct';
import { GlobalHeader } from 'src/components/Header/Header';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Image } from 'src/components/CustomImage';
import { Button } from 'src/components/Button/Button';
import { ColorsList } from 'src/styles/colors';
import { Modal } from 'src/components/ModalContent/Popups';
import { convertRupiah } from 'src/utils/authhelper';

const AddCartWithBarcode = ({ navigation }) => {
    const dispatch = useDispatch()
    const Product = useSelector(state => state.Product)
    const [scanWork, setScanWork] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [productData, setProductData] = useState()
    const [productQuantity, setProductQuantity] = useState(1)

    const _onBarCodeRead = async (scanResult) => {
        setScanWork(false)
        let barcode = scanResult.data
        let barcodeProduct = Product.data.find(item => barcode == item.barcode_product)
        if (barcodeProduct) {
            if(barcodeProduct.manage_stock == 1){
                if(parseInt(barcodeProduct.stock) - parseInt(barcodeProduct.quantity||0) == 0){
                    Alert.alert(
                        '',
                        `Stok ${barcodeProduct.name_product} sudah habis. Scan barang lain`,
                        [
                            {
                                text: 'ULANG', onPress: () => {
                                    setScanWork(true)
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                }else {
                    setProductData(barcodeProduct)
                    setModalVisible(true)
                }
            }else{
                setProductData(barcodeProduct)
                setModalVisible(true)
            }
        } else {
            Alert.alert(
                '',
                'Barang yang Anda scan tidak ditemukan',
                [
                    {
                        text: 'ULANG', onPress: () => {
                            setScanWork(true)
                        }
                    },
                ],
                { cancelable: false }
            )
        }
    }

    const _saveProduct = () => {
        dispatch(AddCartByBarcode({ barcode: productData.barcode_product, quantity: productQuantity }))
        setProductQuantity(1)
        setProductData()
    }
    
    const _handleKembali = () => {
        if (productData.manage_stock == 1) {
            if (parseInt(productData.stock) - parseInt(productData.quantity || 0) - parseInt(productQuantity) >= 0) {
                _saveProduct()
            }
        } else {
            _saveProduct()
        }
        setModalVisible(false)
        navigation.goBack()
    }

    const _handleLanjutScan = () => {
        _saveProduct()
        setModalVisible(false)
        setScanWork(true)
    }

    const _handleMinusQuantity = () => {
        if (productQuantity > 0) {
            let a = parseInt(productQuantity) - 1
            setProductQuantity(a)
        }
    }

    const _handlePlusQuantity = () => {
        if (productData.manage_stock == 1) {
            if (productQuantity < (parseInt(productData.stock) - parseInt(productData.quantity || 0))) {
                let a = productQuantity + 1
                setProductQuantity(a)
            }
        }
        else {
            let a = productQuantity + 1
            setProductQuantity(a)
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <GlobalHeader
                title="Tambah dengan barcode"
                onPressBack={() => navigation.goBack()}
            />
            {modalVisible ?
                <Modal animation="fade" style={{ padding: 10 }} visible={modalVisible}>
                    <Wrapper style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} justify="space-between">
                        <View width="70%">
                            <Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{productData.name_product}</Text>
                            <Text style={{ color: ColorsList.greyFont }}>{convertRupiah(productData.price_out_product)} x {productQuantity}</Text>
                        </View>
                        <Text _style={{ width: '30%', alignItems: 'flex-end' }} style={{ textAlignVertical: 'center', color: ColorsList.greyFont }}>{convertRupiah(Number(productData.price_out_product) * productQuantity)}</Text>
                    </Wrapper>
                    <Wrapper justify="space-around" style={{ marginTop: 20 }}>
                        <TouchableOpacity onPress={_handleMinusQuantity} _style={{ width: '40%', alignItems: 'flex-end' }} style={{ fontSize: 50, color: ColorsList.primaryColor }}>
                            <Image size={45} source={require('src/assets/icons/minusedit.png')} />
                        </TouchableOpacity>
                        <TextInput _width="10%" textAlign={'center'} keyboardType="numeric"
                            onChangeText={text => {
                                let a = Number(text)
                                if ((a > 0 && a < (parseInt(productData.stock) - parseInt(productData.quantity) || 0))) {
                                    setProductQuantity(a)
                                }
                            }} value={productQuantity.toString()} />
                        <TouchableOpacity onPress={_handlePlusQuantity} _style={{ width: '40%', alignItems: 'flex-start' }} style={{ fontSize: 50, color: ColorsList.primaryColor }}>
                            <Image size={45} source={require('src/assets/icons/plusedit.png')} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper justify="flex-end" style={{ marginTop: 20 }}>
                        <Button color="link" onPress={_handleKembali}>KEMBALI</Button>
                        <Button onPress={_handleLanjutScan} style={styles.buttonSimpan}>
                            <Text size={12} style={{ color: 'white' }}>LANJUT SCAN</Text>
                        </Button>
                    </Wrapper>
                </Modal>
                : null}
            <RNCamera
                style={styles.camera}
                onBarCodeRead={scanWork ? _onBarCodeRead : () => console.debug("SCAN DISABLE")}
                defaultTouchToFocus
                onFocusChanged={() => { }}
                ratio="1:1"
                autoFocus={RNCamera.Constants.AutoFocus.on}
            >
                <BarcodeMask
                    width={250} height={250}
                    showAnimatedLine
                    transparency={0}
                />
            </RNCamera>
        </View>

    )
}

export default AddCartWithBarcode;

const styles = StyleSheet.create({
    camera: {
        flex: 1
    },
    buttonSimpan: {
        margin: 5,
        paddingHorizontal: 30,
        backgroundColor: ColorsList.primaryColor,
        borderRadius: 5
    },
    buttonBatal: {
        elevation: 0,
        backgroundColor: 'transparent',
        margin: 5,
        paddingHorizontal: 30,
    },
    viewButtonPopup: { marginTop: 15, borderColor: 'transparent', flexDirection: 'row-reverse', alignItems: 'flex-start' },

})
