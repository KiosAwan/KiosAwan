import React, { useState, useEffect } from 'react';
import PinView from 'src/components/Input/PinView';
import ModalContent from 'src/components/ModalContent/ModalContent';
import LinearGradient from 'src/components/View/LinearGradient';
import Container from 'src/components/View/Container';
import { View, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { Text } from 'src/components/Text/CustomText';
import { createUserPIN } from 'src/utils/authhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const CreatePIN = ({ navigation }) => {
    let pinTyped, pinLength = 4
    const User = useSelector(state => state.User)
    const [params] = useState(navigation.state.params)
    const [modalVisible, setModalVisible] = useState(false)
    
    // alert
    
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)

    const _handlePINFulfilled = code => {
        pinTyped = code
        if (params) {
            _handleCreatePIN()
        } else {
            navigation.push('/temp/create-pin', { pin: pinTyped })
        }
    }

    const _handleCreatePIN = async () => {
        const { pin, confirmPin } = {
            ...params,
            confirmPin: pinTyped
        }
        if (pin.length != 4 || confirmPin.length != 4) {
            setAlertMessage("PIN harus 4 digit")
            setAlert(true)
        } else if (pin != confirmPin) {
            setAlertMessage("PIN harus sama")
            setAlert(true)
        } else {
            setModalVisible(true)
            const id = User.data.id
            const data = { id, pin }
            const res = await createUserPIN(data)
            if (res.status == 200) {
                setTimeout(() => {
                    setModalVisible(false)
                    navigation.navigate('/temp/update-profile')
                }, 800)
            } else {
                setAlertMessage("Gagal membuat PIN")
                setAlert(true)
            }
        }
    }
    useEffect(() => {

    }, [])
    return <Container>
        <AwanPopup.Alert
            message={alertMessage}
            visible={alert}
            closeAlert={() => setAlert(false)}
        />
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <ModalContent
                image={require('src/assets/images/createpinsuccess.png')}
                infoText="Anda Berhasil Membuat PIN!"
                closeModal={() => setModalVisible(false)}
            />
        </Modal>
        <LinearGradient>
            <PinView
                name={params ? "Ulangi PIN" : "Buat PIN"}
                title={
                    <View style={{ width: "60%", alignItems: "center" }}>
                        <Text style={{ marginBottom: 10 }} size={16} color="white">{params ? "Ulangi PIN" : "Buat PIN"}</Text>
                        <Text align="center" size={12} color="whiteColor">Untuk menunjang keamanan profil Anda buatlah PIN dengan benar</Text>
                    </View>
                }
                onPressBack={() => navigation.goBack()}
                pinLength={pinLength}
                onComplete={(code) => _handlePINFulfilled(code)}
            />
        </LinearGradient>
    </Container>
}

export default CreatePIN;