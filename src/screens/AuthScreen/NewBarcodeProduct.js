import React , {useState} from "react";
import {
    Text,
    Button
} from 'native-base';
import {useDispatch, useSelector } from 'react-redux'
import { View , StyleSheet, TouchableOpacity} from "react-native";
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { GlobalHeader } from "../../components/Header/Header";
import { checkBarcode } from "../../utils/authhelper";
import { addProductBarcode, addProductName } from "../../redux/actions/actionsNewProduct";

const NewBarcodeProduct = ({navigation}) =>  {
  const dispatch = useDispatch()
  const newProduct = useSelector(state => state.NewProduct)
  const[focusCoords , setFocusCoords] = useState({
    x: 0.5,
    y: 0.5,
    autoExposure: true
  })
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

  const _onTapToFocus = (event) => {
    const {pageX, pageY} = event.nativeEvent;
    // compensate for top/left changes
    let pageX2 = pageX;
    let pageY2 = pageY;
    // normalize coords as described by https://gist.github.com/Craigtut/6632a9ac7cfff55e74fb561862bc4edb
    const x0 = pageX2;
    const y0 = pageY2;
    let x = x0;
    let y = y0;
    // if portrait, need to apply a transform because RNCamera always measures coords in landscape mode
    // with the home button on the right. If the phone is rotated with the home button to the left
    // we will have issues here, and we have no way to detect that orientation!
    // TODO: Fix this, however, that orientation should never be used due to camera positon
    setFocusCoords({
        x: x,
        y: y,
        autoExposure: true
      }
    )}

  
     return (
        <View style={{flex : 1}}>
          {/* <GlobalHeader onPressBack={() =>navigation.goBack()}/> */}
          <View style={styles.upperSection}>
            <RNCamera
              style={styles.camera}
                onBarCodeRead={_onBarCodeRead}
                defaultTouchToFocus
                onFocusChanged={() => {}}
                // autoFocusPointOfInterest={{ x : 0.3, y : 0.5}}
                autoFocus={RNCamera.Constants.AutoFocus.on}
              >
                <TouchableOpacity
                onPressIn={_onTapToFocus}
              >
              </TouchableOpacity>
              <View style={{borderWidth:2, width : 300}}></View>
              {/* <BarcodeMask
                width={300} height={180}
                showAnimatedLine
                transparency={0.2}
              /> */}
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
  lowerSection: {
    position : 'absolute',
    bottom : 0,
      paddingVertical: 30,
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
  },
  camera: {
      height: '100%',
      justifyContent : "center",
      alignItems : "center"
  },
});
