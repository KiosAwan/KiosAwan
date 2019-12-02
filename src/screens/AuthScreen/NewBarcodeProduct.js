import React, { useState } from "react";
import {
  Text,
  Button,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet, Dimensions } from "react-native";
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { GlobalHeader } from "../../components/Header/Header";
import { checkBarcode } from "../../utils/authhelper";
import { addProductBarcode, addProductName } from "../../redux/actions/actionsNewProduct";
import StepIndicator from "../../components/StepIndicator/StepIndicator";
import { RowChild } from "../../components/Helper/RowChild";
import { FontList } from "../../styles/typography";
import { BottomButton } from "../../components/Button/ButtonComp";


const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
const NewBarcodeProduct = ({ navigation }) => {
  const dispatch = useDispatch()
  const newProduct = useSelector(state => state.NewProduct)
  const step = [1, 2, 3]
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
      <GlobalHeader onPressBack={() =>navigation.goBack()}/>
      <View style={{height : height *0.1, ...RowChild, justifyContent : "center"}}>
        <Text style={{fontFamily : FontList.primaryFont, marginRight : 10}}>Langkah</Text>
        {[<View style={styles.stepIcons}>
          <StepIndicator
          key={1}
          stepNum={1}
          isFirstStep={true}
          isCompletedStep={false}
          isActiveStep={true}
          />
          <View style={styles.divider}>
            <View style={styles.hrLine} />
          </View>
          <StepIndicator
          key={2}
         stepNum={2}
         isCompletedStep={false}
         isActiveStep={false}
          />
          <View style={styles.divider}>
            <View style={styles.hrLine} />
          </View>
          <StepIndicator
          stepNum={3}
          key={3}
          isLastStep
          isCompletedStep={false}
          isActiveStep={false}
          />
          </View>
        ]}      
      </View>       
      <View style={{ justifyContent : "center"}}>
        <RNCamera
          style={styles.camera}
          onBarCodeRead={_onBarCodeRead}
          defaultTouchToFocus
          onFocusChanged={() => { }}
          ratio="1:1"
          // autoFocusPointOfInterest={{ x : 0.3, y : 0.5}}
          autoFocus={RNCamera.Constants.AutoFocus.on}
        >
          <BarcodeMask
            width='90%' height={200}
            showAnimatedLine
            transparency={0.2}
          />
        </RNCamera>
      </View>
      <View style={styles.lowerSection}>
          <BottomButton
          onPressBtn={_handleNoBarcode}
          buttonTitle="No Barcode?"
          />         
      </View>
    </View>
  )
}
export default NewBarcodeProduct

const styles = StyleSheet.create({
  lowerSection: {
    width : "95%",
    height : '8%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
  },
  camera: {
    height: height * 0.9,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal : 20
  },
  stepIcons: {
    position: 'relative',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    alignItems : 'center',
    flexDirection: 'row',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hrLine: {
    width: 30,
    backgroundColor: '#cd0192',
    height: 5,
  },
});
