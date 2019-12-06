import React, { useState } from "react";
import {
  Text,
} from 'native-base';
import { useDispatch} from 'react-redux'
import { View, StyleSheet, Dimensions } from "react-native";
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { GlobalHeader } from "../../components/Header/Header";
import { checkBarcode } from "../../utils/authhelper";
import { addProductBarcode, addProductName } from "../../redux/actions/actionsNewProduct";
import { FontList } from "../../styles/typography";
import { BottomButton } from "../../components/Button/ButtonComp";
import ProgressIndicator from "../../components/StepIndicator/ProgressIndicator";


const height = Dimensions.get('window').height
const NewBarcodeProduct = ({ navigation }) => {
  const dispatch = useDispatch()
  const _onBarCodeRead = async (scanResult) => {
    const data = {
      barcode: scanResult.data
    }
    const response = await checkBarcode(data)
    await dispatch(addProductBarcode(response.data.barcode))
    if (response.data.nama_product != undefined) {
      await dispatch(addProductName(response.data.nama_product))
    }
    else {
      await dispatch(addProductName(''))
    }
    navigation.navigate('NewProductName')
  }

  const _handleNoBarcode = () => {
    dispatch(addProductName(''))
    navigation.navigate('NewProductName')
  }
  return (
    <View style={{ flex: 1 }}>
      <GlobalHeader title="Tambah Produk" onPressBack={() =>navigation.goBack()}/>
      <ProgressIndicator
            firstIsCompleteStep={false}
            firstIsActiveStep={true}
            secondIsCompleteStep={false}
            secondIsActiveStep={false}
            thirdIsCompleteStep={false}
            thirdIsActiveStep={false}
            />
      <View style={{ justifyContent : "center"}}>
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
      <View style={{flex : 2}}/>

      <View style={styles.lowerSection}>
        <View style={{alignItems : "center"}}>
        <Text style={{marginTop : 30,fontFamily : FontList.primaryFont, color : 'white', fontSize:20}}>Pindai Barcode</Text>
        </View>
        <View style={{width : '100%', alignItems :"center"}}>
          <View style={{width :'70%', alignItems: 'center',marginBottom : 10}}>
            <Text style={{color : 'white', textAlign : "center", fontFamily : FontList.primaryFont}}>Jika produk tidak memiliki barcode , Anda dapat melewati langkah ini.</Text>
          </View>
        <BottomButton
        onPressBtn={_handleNoBarcode}
        buttonTitle="LEWATI"
        style={{borderWidth: 1,borderColor: 'white'}}
        /> 
        </View>             
      </View>
    </View>
  )
}
export default NewBarcodeProduct

const styles = StyleSheet.create({
  lowerSection: {
    width : "100%",
    height : '80%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent : 'space-between'
  },
  camera: {
    // marginTop : height * 0.05,
    height: height * 0.92,
    alignItems: "flex-start",
  }
});
