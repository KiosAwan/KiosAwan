import React, { useEffect } from 'react'
import {
  StyleSheet,
  View,
  Image
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Text } from 'native-base';


const CheckMember = ({navigation}) => {

    useEffect(() => { 
        _checkFunc()
    }, [])

    const _checkFunc = async () => {
        try {
        //Cek Token Pas Awal
        const checkUserToken = await AsyncStorage.getItem('userToken');
        const checkUserData = await AsyncStorage.getItem('userData');
            if (checkUserData != null) {
                navigation.navigate('AuthNavigator')
            }
            else {
                navigation.navigate('UnauthNavigator')
            }
        } catch (e) {
        alert(e)
        }
    }
    return (
      <View style={styles.container}>
        {/* <Image
          style={{width: 300, height: 300 ,justifyContent:"center",alignContent:"center"}}
          source={require('../screen/component/staticimage/loading.png')}
        /> */}
        <Text>Ini Loading screen</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'  
  }
})

export default CheckMember;