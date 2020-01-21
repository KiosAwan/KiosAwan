import React, { useState } from 'react'
import { View, Text, Modal } from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';

// import { createUserPIN } from '../../../utils/authhelper';
import AsyncStorage from '@react-native-community/async-storage';
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import { FontList } from '../../../../styles/typography';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { changeUserPIN } from '../../../../utils/authhelper';
import { ScrollView } from 'react-native-gesture-handler';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const ChangePINNewPIN = ({ navigation }) => {
    const [pin, setPin] = useState()
    const [confirmPin, setConfirmPin] = useState()
    const [old_pin, setOld_pin] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    const _handlePINFulfilled = (code) => {
        setPin(code)
    }
    const _handleConfirmPINFulfilled = (code) => {
        setConfirmPin(code)
    }

    const _handleSavePIN = async () => {
        if (!pin || !confirmPin) {
            alert("Pin harus 4 digit")
        } else if (pin != confirmPin) {
            alert("Pin harus sama")
        } else {
            setLoading(true)
            const id = await AsyncStorage.getItem('userId')
            const data = {
                id,
                pin,
                old_pin
            }
            const res = await changeUserPIN(data)
            setLoading(false)
            if (res.status == 200) {
                setModalVisible(true)
                setTimeout(() => {
                    setModalVisible(false)
                    navigation.navigate('/drawer/settings')
                }, 1000)
            } else if (res.status == 400) {
                setAlertMessage(res.data.errors.msg)
                setAlert(true)
            }
        }
    }
    return (
        <View style={{ flex: 1, alignItems: "center", backgroundColor: ColorsList.authBackground }}>
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <GlobalHeader title="Ganti PIN" onPressBack={() => navigation.goBack()} />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <ModalContent
                    image={require('../../../../assets/images/successchangepin.png')}
                    infoText="Anda Berhasil Mengubah PIN!"
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
            <AwanPopup.Loading visible={loading} />
            <ScrollView style={{ flex: 1, marginBottom: 60 }} showsVerticalScrollIndicator={false}>
                <View style={{ margin: 20, height: 100, alignItems: "center", backgroundColor: 'white', padding: 15, paddingHorizontal: 25, borderRadius: 5 }}>
                    <Text style={{ ...FontList.titleFont, color: ColorsList.greySoft }}>Masukkan PIN Lama anda</Text>
                    <CodeInput
                        secureTextEntry
                        className='border-circle'
                        keyboardType="numeric"
                        activeColor='#cd0192'
                        inactiveColor='#cd0192'
                        codeLength={4}
                        size={30}
                        autoFocus
                        onFulfill={(code) => setOld_pin(code)}
                    />
                </View>
                <View style={{ margin: 20, height: 100, alignItems: "center", backgroundColor: 'white', padding: 15, paddingHorizontal: 25, borderRadius: 5 }}>
                    <Text style={{ ...FontList.titleFont, color: ColorsList.greySoft }}>Masukkan 6 Digit PIN Baru</Text>
                    <CodeInput
                        secureTextEntry
                        className='border-circle'
                        keyboardType="numeric"
                        activeColor='#cd0192'
                        inactiveColor='#cd0192'
                        codeLength={4}
                        size={30}
                        autoFocus={false}
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
                        codeLength={4}
                        size={30}
                        autoFocus={false}
                        onFulfill={(code) => _handleConfirmPINFulfilled(code)}
                    />
                </View>
            </ScrollView>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleSavePIN}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="SIMPAN"
                />
            </View>
        </View>
    )
}

export default ChangePINNewPIN;