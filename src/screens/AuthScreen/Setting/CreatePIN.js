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

const CreatePIN = ({ navigation }) => {
    const [pin, setPin] = useState()
    const [confirmPin, setConfirmPin] = useState()
    const [ modalVisible , setModalVisible] = useState(false)
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
            const id = await AsyncStorage.getItem('userId')
            const data = {
                id,
                pin
            }
            await createUserPIN(data)
            setTimeout(() => {
                setModalVisible(false)
                navigation.navigate('Home')
            }, 800)
        }
    }
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
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
            infoText="Anda Berhasil Menambah Produk!"
            closeModal={() => setModalVisible(false)}

            />
			</Modal>
            <View style={{ margin: 30, height: 100, alignItems: "center" }}>
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
            <View style={{ marginTop: 30, alignItems: "center" }}>
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