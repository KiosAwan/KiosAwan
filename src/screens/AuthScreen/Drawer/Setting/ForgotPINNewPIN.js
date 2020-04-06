import React, { useState } from 'react'
import ModalContent from 'src/components/ModalContent/ModalContent';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Modal } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { stateObject } from 'src/utils/state';
import { GlobalHeader } from 'src/components/Header/Header';
import { createUserPIN } from 'src/utils/authhelper';
import { ColorsList } from 'src/styles/colors';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Container from 'src/components/View/Container';
import PinView from 'src/components/Input/PinView';

const ForgotPINNewPIN = ({ navigation }) => {
    const [params] = stateObject(navigation.state.params)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const _handlePINFulfilled = code => {
        if (params.pin) {
            _handleSavePIN(code)
        } else {
            navigation.push('/temp/create-pin', { pin: code })
        }
    }
    const _handleSavePIN = async confirmPin => {
        const { pin } = params
        if (!pin || !confirmPin) {
            alert("Pin harus 4 digit")
        } else if (pin != confirmPin) {
            alert("Pin harus sama")
        } else {
            setLoading(true)
            const id = await AsyncStorage.getItem('userId')
            const data = {
                id,
                pin
            }
            await createUserPIN(data)
            setLoading(false)
            setModalVisible(true)
            setTimeout(() => {
                setModalVisible(false)
                navigation.navigate('/drawer/settings')
            }, 1000)
        }
    }
    return <Container>
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <ModalContent
                image={require('src/assets/images/createpinsuccess.png')}
                infoText="Anda Berhasil Membuat PIN Baru!"
                closeModal={() => setModalVisible(false)}
            />
        </Modal>
        <AwanPopup.Loading visible={loading} />
        <PinView
            title={
                <View style={{ width: "60%", alignItems: "center" }}>
                    <Text style={{ marginBottom: 10 }} size={16}>{params.pin ? "Ulangi PIN" : "Buat PIN Baru"}</Text>
                </View>
            }
            notTransparent
            pinLength={4}
            name="Lupa PIN"
            btnColor={['transparent', 'greyFont']}
            pinColor={ColorsList.authBackground}
            pinActiveColor={ColorsList.primary}
            onPressBack={() => navigation.goBack()}
            onComplete={_handlePINFulfilled}
        />
    </Container>
}

export default ForgotPINNewPIN;