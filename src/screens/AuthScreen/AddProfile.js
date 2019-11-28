import React, { useState, useEffect } from 'react';
import { View, Text} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker'

//redux
import {useDispatch} from 'react-redux'
import { getProfile } from '../../redux/actions/actionsUserData';

//Maps
import Maps from '../../components/Maps/Maps';
import Geocoder from 'react-native-geocoding';

//Custom Comp
import { InputWithLabel, InputTextArea } from '../../components/Input/InputComp';
import { RegisterButton } from '../../components/Button/ButtonComp';

//Function
import { sendProfileData } from '../../utils/authhelper';

const AddProfile = ({navigation}) =>  {
  const dispatch = useDispatch()
  const [region, setRegion] = useState({latitude: -6.208980,longitude: 106.832828})
  const [name_store, setName_Store] = useState('')
  const [email_store, setEmail_Store] = useState('')
  const [id_user, setId_User] = useState('')
  const [photo_store, setPhotoStore] = useState('')
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

    const formData = new FormData()
    formData.append("id_user", id_user)
    formData.append("name_store", name_store)
    formData.append("email_store", email_store)
    formData.append("address_store", address_store)
    formData.append("location_store_latitude", region.latitude)
    formData.append("location_store_longitude", region.longitude)
    formData.append('photo_store', photo_store != "" ? {uri: photo_store,
        type: "image/jpeg",
        name: `${Date.now()}.jpeg`} : null)
        console.log(photo_store)
      const res = await sendProfileData(formData)
      console.log(res)
      try {
        if(res.status == 400){
          alert("Isi semua field dengan format yang benar")
        }else {
          await dispatch(getProfile(id_user))
          navigation.navigate('Home')
        }
      }
      catch (err) {
        alert("Periksa jaringan anda")
      }
      
  }

  const _handleChoosePhoto = () => {
    ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true
      }).then(image=> {
        setPhotoStore(image.path)
        });
    };
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
        buttonTitle="Ambil foto"
        onPressBtn={_handleChoosePhoto}
        />
        <RegisterButton 
        onPressBtn={_handleUploadBtn}
        buttonTitle="Set Profil"/>  
      </View>         
    );
    }



export default AddProfile