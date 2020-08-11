import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

//Styling
import {
    View,
    StyleSheet,
    Image,
    TextInput
} from 'react-native';
//Redux Actions
import { clearAllRegistration, addFirstPassword } from '../../redux/actions/actionsRegistration'

//Functions
import { loginData, sendOTP, showPhoneNumber, sendVerifyOTP } from '../../utils/unauthhelper';
import BarStatus from '../../components/BarStatus';
import { getProfile } from '../../redux/actions/actionsUserData';
import { FontList } from '../../styles/typography';

import { AwanPopup } from 'src/components/ModalContent/Popups';
import { ColorsList } from '../../styles/colors';
import Container from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { Icon } from 'native-base';
import { Button } from 'src/components/Button/Button';
import UnauthHeader, { UnauthBackHeader } from 'src/components/View/UnauthHeader';
import { Input } from 'src/components/Input/MDInput';
import { SizeList } from '../../styles/size';
import { openOtp } from 'src/utils/pin-otp-helper';
import { APP_VERSION } from 'src/config/constant';


const LoginVerification = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    const [loading, setLoading] = useState(false)
    const [viewForgot, setViewForgot] = useState(true)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    const [secure, setSecure] = useState(true)
    const [btnDisabled, setBtnDisabled] = useState(true)
    //Sending OTP code to server
    const _handlePasswordLogin = async (psw) => {
        const pushToken = await AsyncStorage.getItem("@push_token")
        setLoading(true)
        await dispatch(addFirstPassword(psw))
        const data = {
            phone_number: "62" + FormRegister.phone_number,
            password: FormRegister.password,
            id_device: FormRegister.deviceId,
            push_token: pushToken,
            app_version: APP_VERSION,
            phone : FormRegister.deviceName
        }
        try {
            const res = await loginData(data)
            if (res.data.errors) {
                setLoading(false)
                setAlertMessage(res.data.errors.msg)
                setAlert(true)
            }
            else {
                await dispatch(clearAllRegistration())
                await AsyncStorage.setItem('userId', res.data.id)
                await AsyncStorage.setItem('@user_token', res.data.token)
                await dispatch(getProfile(res.data.id, res.data.token))
                setLoading(false)
                navigation.navigate('/')
            }
        }
        catch (err) {
            console.debug(err)
            setLoading(false)
        }
    }

    const _forgotPIN = async () => {
        _sendOTP()
        openOtp({
            navigation,
            title: '',
            textTitle: `OTP telah di kirim ke nomor +${showPhoneNumber(`62${FormRegister.phone_number}`)}`,
            info: "Untuk membuat password baru, anda harus memasukkan kode OTP yang telah dikirim ke nomor HP anda",
            resend: _sendOTP,
            onResolve: async otp => {
                const data = {
                    phone_number: "62" + FormRegister.phone_number,
                    otp
                }
                const res = await sendVerifyOTP(data)
                if (res.status == 400) {
                    setAlertMessage(res.data.errors.msg)
                    setAlert(true)
                }
                else if (res.status == 200) {
                    navigation.navigate('/unauth/login/forgot-password/new-password-1')
                }
            }
        })
    }

    const _sendOTP = async () => {
        setLoading(true)
        const data = {
            phone_number: "62" + FormRegister.phone_number
        }
        const res = await sendOTP(data)
        setLoading(false)
        if (res.status == 400) {
            setAlertMessage(res.data.errors.msg)
            setAlert(true)
        }
    }
    return <Container style={{ padding: SizeList.bodyPadding }}>
        <UnauthBackHeader onPressBack={() => navigation.goBack()} />
        <View style={{ justifyContent: 'center', marginBottom: 10, flex: 1 }}>
            <UnauthHeader />
            <AwanPopup.Loading visible={loading} />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <Text align="center">{`Nomor anda telah terdaftar. Silahkan masukkan \n password anda`}</Text>
            <Input
                _flex
                autoFocus
                noLabel
                secureTextEntry={secure}
                placeholder="Masukkan password"
                style={{ marginTop: SizeList.base, color: ColorsList.greyFont }}
                value={FormRegister.secondPIN}
                onChangeText={(psw) => {
                    if (psw.length > 7) setBtnDisabled(false)
                    else setBtnDisabled(true)
                    dispatch(addFirstPassword(psw))
                }}
                renderRightAccessory={() => <Icon onPress={() => setSecure(!secure)} style={{ color: ColorsList.greyFont, fontSize: 20 }} name={!secure ? "eye" : "eye-off"} />}
            />
            <Button color="link" textStyle={{ color: ColorsList.primary }} align="center" onPress={_forgotPIN}>LUPA PASSWORD?</Button>
        </View>
        <Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handlePasswordLogin}>LANJUT</Button>
    </Container>
}

export default LoginVerification

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    textForgot: {
        marginTop: 5,
        color: 'white',
        ...FontList.titleFont
    },
    wrapHeader: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "flex-end",
    },
    subtitleEnterPhone: {
        paddingHorizontal: 20,
        color: 'white',
        textAlign: "center",
        fontFamily: FontList.semiBoldFont
    },
    inputView: {
        alignItems: "center",
        justifyContent: "center"
    }
})