import React, { useState } from 'react'
import { View, Text, Modal } from 'react-native';
import { GlobalHeader } from '../../../components/Header/Header';
import CodeInput from 'react-native-confirmation-code-input';
import { BottomButton } from '../../../components/Button/ButtonComp';
import { ColorsList } from '../../../styles/colors';
import { SizeList } from '../../../styles/size';
import { FontList } from '../../../styles/typography';
import { createUserPIN } from '../../../utils/authhelper';
import AsyncStorage from '@react-native-community/async-storage';
import ModalContent from '../../../components/ModalContent/ModalContent';
import {useSelector} from 'react-redux'

const CreatePIN = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const [pin, setPin] = useState()
    const [confirmPin, setConfirmPin] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const _handlePINFulfilled = (code) => {
        setPin(code)
    }
    const _handleConfirmPINFulfilled = (code) => {
        setConfirmPin(code)
    }

    const _handleCreatePIN = async () => {
        if (pin.length != 6 || confirmPin.length != 6) {
            alert("Pin harus 6 digit")
        } else if (pin != confirmPin) {
            alert("Pin harus sama")
        } else {
            setModalVisible(true)
            const id = User.data.id
            const data = {
                id,
                pin
            }
            const res = await createUserPIN(data)
            if (res.status == 200) {
                setTimeout(() => {
                    setModalVisible(false)
                    navigation.navigate('/temp/update-profile')
                }, 800)
            } else {
                alert('Gagal membuat pin')
            }
        }
    }
    return (
        <View style={{ flex: 1, alignItems: "center", backgroundColor: ColorsList.authBackground }}>
            <GlobalHeader title="Buat PIN" onPressBack={() => navigation.goBack()} />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            ><ModalContent
                    image={require('../../../assets/images/createpinsuccess.png')}
                    infoText="Anda Berhasil Membuat PIN!"
                    closeModal={() => setModalVisible(false)}

                />
            </Modal>
            <View style={{alignSelf : 'center', width : '70%', paddingTop : 15}}>
                <Text style={{textAlign : "center", ...FontList.subtitleFontGreyBold}}>Untuk menunjang kemanan Anda saat bertransaksi buat PIN dengan benar dan pastikan tidak diketahui oleh orang lain</Text>

            </View>
            <View style={{ margin: 20, height: 100, alignItems: "center", backgroundColor: 'white', padding: 15, paddingHorizontal: 25, borderRadius: 5 }}>
                <Text style={{ ...FontList.titleFont, color: ColorsList.greySoft }}>Masukkan 6 Digit PIN</Text>
                <CodeInput
                    secureTextEntry
                    className='border-circle'
                    keyboardType="numeric"
                    activeColor='#cd0192'
                    inactiveColor='#cd0192'
                    codeLength={6}
                    size={30}
                    autoFocus
                    onFulfill={(code) => _handlePINFulfilled(code)}
                />
            </View>
            <View style={{ margin: 20, height: 100, alignItems: "center", backgroundColor: 'white', padding: 15, paddingHorizontal: 25, borderRadius: 5 }}>
                <Text style={{ ...FontList.titleFont, color: ColorsList.greySoft }}>Masukkan kembali PIN anda</Text>
                <CodeInput
                    secureTextEntry
                    className='border-circle'
                    keyboardType="numeric"
                    activeColor='#cd0192'
                    inactiveColor='#cd0192'
                    codeLength={6}
                    size={30}
                    autoFocus={false}
                    onFulfill={(code) => _handleConfirmPINFulfilled(code)}
                />
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleCreatePIN}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="LANJUTKAN"
                />
            </View>
        </View>
    )
}

export default CreatePIN;