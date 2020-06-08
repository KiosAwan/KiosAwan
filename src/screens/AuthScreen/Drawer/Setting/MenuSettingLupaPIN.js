import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SizeList } from 'src/styles/size';
import { useSelector } from 'react-redux'
import { ColorsList } from 'src/styles/colors';
import { sendOTPAuth } from 'src/utils/authhelper';
import { FontList } from 'src/styles/typography';
import { showPhoneNumber } from 'src/utils/unauthhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Container, { Footer, Body } from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';
const MenuSettingLupaPIN = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const [apiLoading, setApiLoading] = useState(false)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)

    const _nextBtn = async () => {
        setApiLoading(true)
        const data = {
            phone_number: User.data.phone_number
        }
        const res = await sendOTPAuth(data)
        setApiLoading(false)
        if (res.status == 400) {
            setAlertMessage(res.data.errors.msg)
            setAlert(true)
        }
        else {
            navigation.navigate('/drawer/settings/forgot-pin')
        }
    }

    return (
        <Container header={{
            title: "Lupa PIN",
            onPressBack: () => navigation.goBack()
        }}>
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <AwanPopup.Loading visible={apiLoading} />
            <Body>
                <View style={{ padding: 20,borderRadius: 5, alignItems: "center" }}>
                    <Text style={{ ...FontList.titleFont, color: ColorsList.greySoft, marginBottom: 15 }}>Kode OTP akan dikirim melalui SMS ke</Text>
                    <View style={{ alignItems: "center", backgroundColor: ColorsList.white, padding: 10, width: '90%', borderRadius: 5 }}>
                        <Text style={{ ...FontList.titleFont, fontSize: 20, color: ColorsList.greySoft }}>62- {showPhoneNumber(User.data.phone_number.slice(2, User.data.length))}</Text>
                    </View>
                </View>
            </Body>
            <Footer>
                <Button onPress={_nextBtn}>
                    LANJUT
                </Button>
            </Footer>
        </Container>
    )
}

export default MenuSettingLupaPIN