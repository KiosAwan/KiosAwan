import React from 'react'
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { AddCartByBarcode } from '../../../../redux/actions/actionsStoreProduct';
import { GlobalHeader } from '../../../../components/Header/Header';

const AddCartWithBarcode = ({ navigation }) => {
    const dispatch = useDispatch()
    const Product = useSelector(state => state.Product)

    const _onBarCodeRead = (scanResult) => {
        let barcode = scanResult.data
        let barcodeProduct = Product.data.find(item => barcode == item.barcode_product)
        if (barcodeProduct) {
            dispatch(AddCartByBarcode(barcode))
            navigation.goBack()
        } else {
            alert("Produk tidak ditemukan , coba lagi")
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <GlobalHeader
                title="Tambah dengan barcode"
                onPressBack={() => navigation.goBack()}
            />
            <RNCamera
                style={styles.camera}
                onBarCodeRead={_onBarCodeRead}
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
    }
})
