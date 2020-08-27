import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet, Dimensions, Alert, BackHandler } from "react-native";
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { GlobalHeader } from "src/components/Header/Header";
import { checkBarcode } from "src/utils/authhelper";
import { addProductBarcode, addProductName, addProductIdCategory } from "src/redux/actions/actionsNewProduct";
import { FontList } from "src/styles/typography";
import { BottomButton } from "src/components/Button/ButtonComp";
import Container from "src/components/View/Container";
import { Text } from "src/components/Text/CustomText";
import { Wrapper } from "src/components/View/Wrapper";
import { ColorsList } from "src/styles/colors";
import { Button } from "src/components/Button/Button";
import { SizeList } from "src/styles/size";
import { Bottom } from "src/components/View/Bottom";


const height = Dimensions.get('window').height

const NewBarcodeProduct = ({ navigation }) => {
  const dispatch = useDispatch()
  const NewProduct = useSelector(state => state.NewProduct)
  const [scanWork, setScanWork] = useState(true)
  const [cameraLayout, setCameraLayout] = useState({})

  const _onBarCodeRead = async (scanResult) => {
    await setScanWork(false)
    const data = {
      barcode: scanResult.data
    }
    const response = await checkBarcode(data)
    if (response.status == 400) {
      Alert.alert(
        '',
        response.data.errors.msg,
        [
          {
            text: 'Scan ulang', onPress: () => {
              setScanWork(true)
            }
          },
        ],
        { cancelable: false }
      )
    } else {
      await dispatch(addProductBarcode(response.data.barcode.toString()))
      if (response.data.nama_product != undefined) {
        Alert.alert(
          '',
          'Produk yang Anda scan ditemukan ',
          [
            {
              text: 'Lanjut', onPress: () => {
                dispatch(addProductName(response.data.nama_product))
                dispatch(addProductIdCategory(null))
                navigation.navigate('/cashier/new-product-name')
              }
            },
          ],
          { cancelable: false }
        )
      } else {
        Alert.alert(
          '',
          'Barcode berhasil discan, namun data barang tidak ditemukan di database.',
          [
            {
              text: 'Lanjut', onPress: () => {
                dispatch(addProductName(''))
                dispatch(addProductIdCategory(null))
                navigation.navigate('/cashier/new-product-name')
              }
            },
          ],
          { cancelable: false }
        )
      }
    }
  }
  const _handleNoBarcode = async () => {
    await setScanWork(false)
    dispatch(addProductName(''))
    dispatch(addProductIdCategory(null))
    navigation.navigate('/cashier/new-product-name')
  }
  return <View style={{ backgroundColor: "transparent", flex: 1 }}>
    <GlobalHeader
      title="TAMBAH PRODUK"
      onPressBack={() => navigation.goBack()}
      renderRightAccessory={() => <Wrapper style={{ width: 30 }} spaceBetween>
        {[1, '/', 3].map(v => <Text color="primary" size={16}>{v}</Text>)}
      </Wrapper>}
    />
    <View style={{ justifyContent: "center" }}>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={scanWork ? _onBarCodeRead : null}
        defaultTouchToFocus
        onFocusChanged={() => { }}
        ratio="1:1"
        autoFocus={RNCamera.Constants.AutoFocus.on}
      >
        <BarcodeMask
          style={{ width: 300, height: 300 }}
          showAnimatedLine
          transparency={0}
        />
      </RNCamera>
    </View>

    <View style={styles.lowerSection}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ marginTop: 30, fontFamily: "Rubik-Regular", color: 'white' }}>PINDAI BARCODE</Text>
        <View style={{ width: '70%', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: 'white', textAlign: "center", fontFamily: FontList.primaryFont }}>Jika produk tidak memiliki barcode, Anda dapat melewati langkah ini.</Text>
        </View>
      </View>
      <Bottom>
        <Button
          width="100%"
          onPress={_handleNoBarcode}
        >LEWATI</Button>
      </Bottom>
    </View>
  </View>
}
export default NewBarcodeProduct

const styles = StyleSheet.create({
  lowerSection: {
    width: "100%",
    height: '85%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  camera: {
    height: height,
    alignItems: "flex-start",
  }
});