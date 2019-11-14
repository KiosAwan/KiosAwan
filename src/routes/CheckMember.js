import React, { useEffect } from 'react'
import {
  StyleSheet,
  View,
  Image,
  StatusBar
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient'
import Strings from '../utils/Strings';
import { ColorsList } from '../styles/colors';

const CheckMember = ({navigation}) => {

    useEffect(() => { 
      setTimeout(function() 
      { _checkFunc()}
      , 1500);
    }, [])

    const _checkFunc = async () => {
        try {
        //Cek Token Pas Awal
        const checkUserIntro = await AsyncStorage.getItem('introApp');
        const checkUserData = await AsyncStorage.getItem('userData');
            // if (checkUserData != null) {
                navigation.navigate('AuthNavigator')
            // }
            // else {
            //     if(checkUserIntro == "sudah"){
            //       navigation.navigate('PhoneRegistration')
            //     }else {
            //       navigation.navigate('AppIntro')
            //     }
            // }
        } catch (e) {
        alert(e)
        }
    }
    return (
      <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container}>
        <StatusBar
                backgroundColor={ColorsList.primaryColor} />
        <Image
          style={{width: 170, height: 100}}
          source={require('../assets/images/logo.png')}
        />
        <View style={{width : '60%', alignItems :"center"}}>
          <Text style={styles.infoText}>{Strings.SPLASHSCREENTEXT}</Text>
        </View>
      </LinearGradient>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText : {
    fontFamily : 'Nunito-Light',
    textAlign : "center",
    color : 'white'
  },
  logo : {
    height : 100, 
    width : 170,
  }
})

export default CheckMember;