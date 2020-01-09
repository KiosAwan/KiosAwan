import React, {useState} from 'react'
import { View, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { AddCartByBarcode } from '../../../../redux/actions/actionsStoreProduct';
import { GlobalHeader } from '../../../../components/Header/Header';

const AddCartWithBarcode = ({ navigation }) => {
    const dispatch = useDispatch()
    const Product = useSelector(state => state.Product)
    const [scanWork, setScanWork] = useState(true)
    const _onBarCodeRead = async (scanResult) => {
        setScanWork(false)
        let barcode = scanResult.data
        let barcodeProduct = Product.data.find(item => barcode == item.barcode_product)
        if (barcodeProduct) {
            await dispatch(AddCartByBarcode(barcode))
            navigation.goBack()
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
    return (
        <View style={{ flex: 1 }}>
            <GlobalHeader
                title="Tambah dengan barcode"
                onPressBack={() => navigation.goBack()}
            />
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
    }
})
