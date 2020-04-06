import React, { useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux'
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import CodeInput from 'react-native-confirmation-code-input';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { SizeList } from 'src/styles/size';
import { FontList } from 'src/styles/typography';
import { verifyUserPIN } from 'src/utils/authhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Container from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import PinView from 'src/components/Input/PinView';

const UbahPasswordInputPIN = ({ navigation }) => {
    const User = useSelector(state => state.User)

    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)

    const _nextBtn = async pinCode => {
        if (!pinCode) {
            setAlertMessage("PIN tidak boleh kosong")
            setAlert(true)
        } else {
            const data = {
                pin: pinCode,
                phone_number: User.data.phone_number
            }
            const res = await verifyUserPIN(data)
            if (res.status == 200) {
                navigation.navigate('/drawer/settings/change-password/change', {
                    PIN: pinCode
                })
            }
            else if (res.status == 400) {
                setAlertMessage(res.data.errors.msg)
                setAlert(true)
            }
        }
    }
    return <Container>
        <AwanPopup.Alert
            message={alertMessage}
            visible={alert}
            closeAlert={() => setAlert(false)}
        />
        <PinView
            title={
                <View style={{ width: "60%", alignItems: "center" }}>
                    <Text style={{ marginBottom: 10 }} font="ExtraBold" size={16}>Masukkan PIN</Text>
                    <Text size={14} align="center">PIN dibutuhkan untuk mengubah password</Text>
                </View>
            }
            notTransparent
            pinLength={4}
            name="Ubah PIN"
            btnColor={['transparent', 'greyFont']}
            pinColor={ColorsList.authBackground}
            pinActiveColor={ColorsList.primary}
            onPressBack={() => navigation.goBack()}
            onComplete={_nextBtn}
        />
    </Container>
}

export default UbahPasswordInputPIN;