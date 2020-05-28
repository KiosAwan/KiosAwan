import React, { useEffect } from 'react'
import {
  StyleSheet,
  View,
  Image,
} from "react-native";
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient'
import Strings from '../utils/Strings';
import BarStatus from '../components/BarStatus';
import { getProfile } from '../redux/actions/actionsUserData';
import Axios from 'axios';
import { HOST_URL } from 'src/config';

const CheckMember = (props) => {
  const { navigation } = props
  const dispatch = useDispatch()
  useEffect(() => {
    _checkFunc()
    // setTimeout(() => _checkFunc(), 1500);
  }, [])

  const _checkFunc = async () => {
    try {
      //Cek Token Pas Awal
      const checkUserIntro = await AsyncStorage.getItem('introApp');
      const checkUserData = await AsyncStorage.getItem('userId');
      const userToken = await AsyncStorage.getItem('@user_token');
      NetInfo.addEventListener(state => {
        if (!state.isInternetReachable) {
          navigation.navigate('/not-connected')
        }
      });
      if (checkUserData != null) {
        try {
          const res = await Axios.get(`${HOST_URL}/auth/check`, {
            headers: { "authorization": userToken }
          })
          if (res.status == 200) {
            await AsyncStorage.setItem('@user_token', res.data.data.token)
            await dispatch(getProfile(checkUserData, res.data.data.token))
            navigation.navigate('/intro')
          }
        } catch (err) {
          // navigation.navigate('/unauth')
        }
      } else {
        if (checkUserIntro == "sudah") {
          navigation.navigate('/unauth')
        } else {
          navigation.navigate('/intro')
        }
      }
    } catch (e) {
      alert(e)
    }
  }
  return (
    <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container}>
      <BarStatus />
      <Image
        style={{ width: 170, height: 100 }}
        source={require('../assets/images/logo.png')}
      />
      <View style={{ width: '60%', alignItems: "center" }}>
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
  infoText: {
    fontFamily: 'Nunito-Light',
    textAlign: "center",
    color: 'white'
  },
  logo: {
    height: 100,
    width: 170,
  }
})

export default CheckMember;