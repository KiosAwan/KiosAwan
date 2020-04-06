import React, { useState } from 'react'
import { View, Modal } from 'react-native';
import { GlobalHeader } from '../../../components/Header/Header';
import CodeInput from 'react-native-confirmation-code-input';
import { BottomButton } from '../../../components/Button/ButtonComp';
import { ColorsList } from '../../../styles/colors';
import { SizeList } from '../../../styles/size';
import { FontList } from '../../../styles/typography';
import { createUserPIN } from '../../../utils/authhelper';
import ModalContent from '../../../components/ModalContent/ModalContent';
import { useSelector } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Container from 'src/components/View/Container';
import PinView from 'src/components/Input/PinView';
import LinearGradient from 'src/components/View/LinearGradient';
import { Text } from 'src/components/Text/CustomText';

const CreatePIN = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const [pin, setPin] = useState()
    const [confirmPin, setConfirmPin] = useState()
    const [modalVisible, setModalVisible] = useState(false)

    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)

    const _handlePINFulfilled = (code) => {
        setPin(code)
    }
    const _handleConfirmPINFulfilled = (code) => {
        setConfirmPin(code)
    }

    const _handleCreatePIN = async () => {
        if (pin.length != 4 || confirmPin.length != 4) {
            setAlertMessage("PIN harus 4 digit")
            setAlert(true)
        } else if (pin != confirmPin) {
            setAlertMessage("PIN harus sama")
            setAlert(true)
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
                setAlertMessage("Gagal membuat PIN")
                setAlert(true)
            }
        }
    }
    const areturn = <View style={{ flex: 1, alignItems: "center", backgroundColor: ColorsList.authBackground }}>
        <AwanPopup.Alert
            message={alertMessage}
            visible={alert}
            closeAlert={() => setAlert(false)}
        />
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
        <ScrollView showsVerticalScrollIndicator={false} style={{ height: SizeList.height, marginBottom: 70 }}>
            <View style={{ alignSelf: 'center', width: '90%', paddingTop: 15 }}>
                <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold }}>Untuk menunjang kemanan Anda saat bertransaksi buat PIN dengan benar dan pastikan tidak diketahui oleh orang lain.</Text>
            </View>
            <View style={{ margin: 20, height: 100, alignItems: "center", backgroundColor: 'white', padding: 15, borderRadius: 5 }}>
                <Text style={{ ...FontList.titleFont, color: ColorsList.greySoft }}>Masukkan 4 Digit PIN</Text>
                <CodeInput
                    secureTextEntry
                    className='border-circle'
                    keyboardType="numeric"
                    activeColor='#cd0192'
                    inactiveColor='#cd0192'
                    codeLength={4}
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
                    codeLength={4}
                    size={30}
                    autoFocus={false}
                    onFulfill={(code) => _handleConfirmPINFulfilled(code)}
                />
            </View>
        </ScrollView>
        <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
            <BottomButton
                onPressBtn={_handleCreatePIN}
                style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                buttonTitle="LANJUTKAN"
            />
        </View>
    </View>
    return <Container>
        <LinearGradient>
            <PinView
                name="Buat PIN"
                title={
                    <View style={{ width: "60%", alignItems: "center" }}>
                        <Text style={{ marginBottom: 10 }} size={16} color="white">Silahkan masukkan PIN Anda</Text>
                        <Text align="center" size={12} color="whiteColor">Proses pemotongan saldo akan dilakukan setelah memasukkan PIN</Text>
                    </View>
                }
                onPressBack={() => navigation.goBack()}
                pinLength={4}
                onComplete={(code, clear) => pinResolve(code, () => {
                    clear()
                })}
            />
        </LinearGradient>
    </Container>
}

export default CreatePIN;