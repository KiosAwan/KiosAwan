import React , {Component} from "react";
import {
    Text,
    Button
} from 'native-base';
import {useDispatch, useSelector } from 'react-redux'
import { View , StyleSheet} from "react-native";
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { GlobalHeader } from "../../components/Header/Header";
import { checkBarcode } from "../../utils/authhelper";
import { addProductBarcode, addProductName } from "../../redux/actions/actionsNewProduct";

const NewBarcodeProduct = ({navigation}) =>  {
  const dispatch = useDispatch()
  const newProduct = useSelector(state => state.NewProduct)
  
  const _onBarCodeRead = async (scanResult) => {
    const data = {
      barcode : scanResult.data
    }
    const response = await checkBarcode(data)
    await dispatch(addProductBarcode(response.data.barcode))
    if(response.data.nama_product != undefined){
      await dispatch(addProductName(response.data.nama_product))
    }
    navigation.navigate('NewProductName')
  }
  
     return (
        <View style={{flex : 1}}>
          <GlobalHeader onPressBack={() =>navigation.goBack()}/>
          <View style={styles.upperSection}>
            <RNCamera
              style={styles.camera}
                onBarCodeRead={_onBarCodeRead}
                // barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                flashMode={RNCamera.Constants.FlashMode.on}
                autoFocus={RNCamera.Constants.AutoFocus.on}
              >
              <BarcodeMask
                width={300} height={180} showAnimatedLine transparency={0.2}
              />
            </RNCamera>
          </View>
          <View style={styles.lowerSection}>
            <View style={{flexDirection : 'row'}}>
            <Button
                primary
                onPress={() => navigation.navigate('NewProductName')}
            >
              <Text>No Barcode ? </Text>
            </Button>
            </View>           
          </View>
        </View>
     )
}
export default NewBarcodeProduct

const styles = StyleSheet.create({
  root: {
      flex: 1,
  },
  // upperSection: {
  //     flex: 1
  // },
  lowerSection: {
    position : 'absolute',
    bottom : 0,
      paddingVertical: 30,
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
  },
  camera: {
      height: '100%',
  },
});
