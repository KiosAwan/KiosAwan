import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { SizeList } from 'src/styles/size';
import { useSelector } from 'react-redux'
import { ColorsList } from 'src/styles/colors';
import { sendOTPAuth } from 'src/utils/authhelper';
import { showPhoneNumber } from 'src/utils/unauthhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Container, { Footer, Body } from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';
import { Input } from 'src/components/Input/MDInput';
import { Text } from 'src/components/Text/CustomText';
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
                <Input label="No.HP" value={`62-${showPhoneNumber(User.data.phone_number.slice(2, User.data.length))}`}
                    editable={false}
                    renderRightAccessory={() =>
                        <Image style={{ width: 30, height: 30 }} source={User.data.status == 0 ? require('src/assets/icons/rejectcheck.png') : require('src/assets/icons/successcheck.png')} />} />
                <View style={{ backgroundColor: ColorsList.settingBg, marginTop: SizeList.base, borderRadius: SizeList.borderRadius }}>
                    <Text style={{ padding: 10 }} color="settingFont">Anda akan dikirimkan OTP melalui SMS ke nomor berikut </Text>
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