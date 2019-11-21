import React, { useState, useEffect } from 'react';
import Geocoder from 'react-native-geocoding';
import {useDispatch} from 'react-redux'
import { View, Text} from 'react-native'
import Maps from '../../components/Maps/Maps';
import { InputWithLabel, InputTextArea } from '../../components/Input/InputComp';
import { RegisterButton } from '../../components/Button/ButtonComp';
import { sendProfileData } from '../../utils/authhelper';
import AsyncStorage from '@react-native-community/async-storage';
import { getProfile } from '../../redux/actions/actionsUserData';

const AddProfile = ({navigation}) =>  {
  const dispatch = useDispatch()
  const [region, setRegion] = useState({latitude: -6.208980,longitude: 106.832828})
  const [name_store, setName_Store] = useState('')
  const [email_store, setEmail_Store] = useState('')
  const [id_user, setId_User] = useState('')
  const [address_store, setAddress_Store] = useState()
  useEffect(() => { 
    _firstRender()
  }, [])

  const _firstRender = async () =>  {
    Geocoder.init("AIzaSyANsdJHxgATik6RklXekH0UrtTFKv9BFgQ")
    _identifyAddress()
    const userId = await AsyncStorage.getItem('userId')
    setId_User(userId)
  }

  const _identifyAddress = () => {
    Geocoder.from(region.latitude, region.longitude).then(json => {
      setAddress_Store(json.results[0].formatted_address)
  })
  .catch(error => console.warn(error));
  }

  const _changeRegion = nativeEvent => {
    setRegion( ...nativeEvent.coordinate);
  };

  const _onMapsPress = e => {
    setRegion(e.nativeEvent.coordinate)
    _identifyAddress()
  }

  const _handleUploadBtn = async () => {
      const data = {
        id_user ,
        name_store ,
        email_store,
        address_store,
        location_store_latitude  : region.latitude,
        location_store_longitude : region.longitude
      }
      const res = await sendProfileData(data)
      if(res.status == 400){
        alert("Isi semua field dengan format yang benar")
      }else {
        await dispatch(getProfile(id_user))
        navigation.navigate('Home')
      }
  }
    return (
      <View style={{flex : 1, padding : 20}}>
        <View>
          <InputWithLabel
          label="Nama toko"
          handleChangeText={(text) => setName_Store(text)}
          value={name_store}
          />
          <InputWithLabel
          label="Email"
          handleChangeText={(text) => setEmail_Store(text)}
          value={email_store}
          />
          <InputTextArea
          label="Alamat toko"
          disabled
          value={address_store}
          />
        </View>
        <View style={{marginBottom : 10}}>
          <Text>Pilih lokasi toko </Text>
          <Maps
            onMapsPress={_onMapsPress}
            region={region}
            height={200}
            draggable={true}
            changeRegion={_changeRegion}
          />
        </View>
        <RegisterButton 
        onPressBtn={_handleUploadBtn}
        buttonTitle="Set Profil"/>  
      </View>         
    );
    }



export default AddProfile