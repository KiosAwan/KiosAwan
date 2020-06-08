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
import ProgressIndicator from "src/components/StepIndicator/ProgressIndicator";
import Container from "src/components/View/Container";
import { Text } from "src/components/Text/CustomText";
import { Wrapper } from "src/components/View/Wrapper";
import { ColorsList } from "src/styles/colors";
import FillToAspectRatio from '../../../components/View/FIllToAspectRatio';
import { Button } from "src/components/Button/Button";
import { SizeList } from "src/styles/size";


const height = Dimensions.get('window').height

const NewBarcodeProduct = ({ navigation }) => {
  const dispatch = useDispatch()
  const NewProduct = useSelector(state => state.NewProduct)
  const [scanWork, setScanWork] = useState(true)
  const [cameraLayout, setCameraLayout] = useState({})

  const _onBarCodeRead = async (scanResult) => {
    console.debug("Scanned")
    await setScanWork(false)
    const data = {
      barcode: scanResult.data
    }
    const response = await checkBarcode(data)
    await dispatch(addProductBarcode(response.data.barcode))

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
        'Barang yang Anda scan tidak ditemukan',
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
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', (e) => {
      if (NewProduct.fromManajemen) {
        navigation.navigate(NewProduct.fromManajemen.back)
        BackHandler.removeEventListener('hardwareBackPress')
        return true
      }
      return false
    })
    // setScanWork(true)
  })
  const _handleNoBarcode = () => {
    dispatch(addProductName(''))
    dispatch(addProductIdCategory(null))
    navigation.navigate('/cashier/new-product-name')
  }
  return <Container>
    <GlobalHeader
      title="TAMBAH PRODUK"
      onPressBack={() => navigation.goBack()}
      renderRightAccessory={() => <Wrapper style={{ width: 30 }} spaceBetween>
        {[1, '/', 3].map(v => <Text color="primary" size={16}>{v}</Text>)}
      </Wrapper>}
    />
    <View style={{ paddingBottom: SizeList.base, paddingHorizontal: SizeList.base, justifyContent: "space-between", flex: 1, backgroundColor: ColorsList.black, paddingTop: 50 }}>
      <View>
        <Text align="center">PINDAI BARCODE</Text>
        <Text align="center">Jika produk Anda tidak memiliki barcode, maka Anda dapat melewati langkah ini</Text>
      </View>
      <View style={{ flex: 1, borderRadius: 5, marginVertical: SizeList.base * 5, width: '80%', alignSelf: "center", marginTop: "50%" }}>
        <RNCamera
          style={{}}
          onBarCodeRead={scanWork ? _onBarCodeRead : null}
          defaultTouchToFocus
          onFocusChanged={() => { }}
          ratio="1:1"
          autoFocus={RNCamera.Constants.AutoFocus.on}
        >
          <BarcodeMask
            width={SizeList.width * 0.7} height={SizeList.width * 0.7}
            showAnimatedLine
            transparency={0}
          />
        </RNCamera>
      </View>
      <Button onPress={_handleNoBarcode}>LEWATI</Button>
    </View>
  </Container>
}
export default NewBarcodeProduct