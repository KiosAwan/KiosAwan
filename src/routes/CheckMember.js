import React, { useEffect } from 'react'
import {
  StyleSheet,
  View,
  Image,
  BackHandler
} from 'react-native';
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Strings from '../utils/Strings';
import BarStatus from '../components/BarStatus';
import { getProfile } from '../redux/actions/actionsUserData';
import Axios from 'src/utils/axios';
import { HOST_URL } from 'src/config';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import Container from 'src/components/View/Container';
import { VERSION, APP_VERSION } from 'src/config/constant';
import Alert from 'src/utils/alert';
import { Linking } from 'react-native';
import { getUniqueId, getBrand, getProduct } from 'react-native-device-info';
import { addDeviceId, addDeviceName } from 'src/redux/actions/actionsRegistration';

const CheckMember = (props) => {
  const { navigation } = props
  const dispatch = useDispatch()
  useEffect(() => {
    setTimeout(() => _checkVersion(), 1000);
    _getDeviceInfo()
  }, [])

  const _getDeviceInfo = async () => {
    let uniqueId = getUniqueId();
    let brand = await getBrand()
    let product = await getProduct()
    let deviceName = brand + " " + product
    await dispatch(addDeviceId(uniqueId))
    await dispatch(addDeviceName(`${deviceName}`))
  }

  const _checkVersion = async () => {
    const CheckUpdate = await AsyncStorage.getItem('CheckUpdate')
    let { data: { status, data } } = await Axios.get(`${HOST_URL}/version`)
    const { BUILD } = VERSION
    const { buildNumber, linkPs, majorUpdate, version } = data
    const updateNotif = force => {
      const Yes = () => {
        Linking.openURL(linkPs)
        setTimeout(BackHandler.exitApp, 500)
      }
      const No = () => _checkFunc()
      const DontAsk = async () => {
        await AsyncStorage.setItem('CheckUpdate', 'false')
        _checkFunc()
      }
      let button = force ? [['Ya', Yes]] : [
        ['Jangan tanya lagi', DontAsk],
        ['Ya', Yes],
        ['Tidak', No]
      ]
      if (status == 200) {
        if (buildNumber > BUILD) {
          Alert(
            'Perhatian',
            `Terdeteksi versi anda ${APP_VERSION}, ada update terbaru di Playstore ${version} (${buildNumber}). Update sekarang?`,
            button
          )
        } else {
          _checkFunc()
        }
      } else {
        BackHandler.exitApp()
      }
    }
    if (buildNumber - BUILD > 1) {
      updateNotif(true)
    } else {
      if (CheckUpdate != 'true' && majorUpdate != 'true') {
        if (CheckUpdate)
          _checkFunc()
        else
          updateNotif()
      } else {
        updateNotif(majorUpdate == 'true')
      }
    }
  }

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
            navigation.navigate('/')
          }
        } catch (err) {
          navigation.navigate('/unauth')
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
    <Container style={styles.container}>
      <BarStatus />
      <Image
        style={styles.logo}
        source={require('../assets/images/splash_logo.png')}
      />
    </Container>
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
    height: 80,
    width: 160,
    resizeMode: "contain"
  }
})

export default CheckMember;