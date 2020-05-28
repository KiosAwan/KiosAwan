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
import { loginData, sendOTP } from '../../utils/unauthhelper';
import BarStatus from '../../components/BarStatus';
import { getProfile } from '../../redux/actions/actionsUserData';
import LinearGradient from 'react-native-linear-gradient';
import { HeaderRegister } from '../../components/Header/Header';
import { FontList } from '../../styles/typography';
import { InputPIN } from '../../components/Input/InputPIN';
import { UnauthBottomButton } from 'src/components/Button/UnauthButton';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { ColorsList } from '../../styles/colors';
import Container from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { Icon } from 'native-base';
import { Button } from 'src/components/Button/Button';


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
            push_token: pushToken
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
        const data = {
            phone_number: "62" + FormRegister.phone_number
        }
        navigation.navigate('/unauth/login/forgot-password')
        await sendOTP(data)
    }
    return <Container style={{ padding: 15 }}>
        <View style={{ justifyContent: 'center', marginBottom: 10, flex: 1 }}>
            <Image
                style={{ width: 170, height: 100, alignSelf: "center" }}
                source={require('src/assets/images/logo.png')}
            />
            <Text align="center">Masukkan password Anda.</Text>
            <Wrapper spaceBetween style={{ marginVertical: 10, color: ColorsList.greyFont, marginLeft: 5, elevation: 2, padding: 10, backgroundColor: ColorsList.authBackground }}>
                <TextInput
                    _flex
                    autoFocus
                    secureTextEntry={secure}
                    placeholder="Masukkan Konfirmasi Password"
                    style={{ color: ColorsList.greyFont }}
                    value={FormRegister.secondPIN}
                    onChangeText={(psw) => {
                        if (psw.length > 7) setBtnDisabled(false)
                        else setBtnDisabled(true)
                        dispatch(addFirstPassword(psw))
                    }}
                />
                <Icon onPress={() => setSecure(!secure)} style={{ color: ColorsList.greyFont }} name={!secure ? "eye" : "eye-off"} />
            </Wrapper>
            <Button color="link" align="center" onPress={_forgotPIN}>Lupa password?</Button>
        </View>
        <Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handlePasswordLogin}>LANJUT</Button>
    </Container>
    return (
        <LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={styles.container}>
            <BarStatus />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <AwanPopup.Loading visible={loading} />
            <View style={{ paddingTop: 10 }}>
                <HeaderRegister />
            </View>
            <Text style={[styles.subtitleEnterPhone, {}]}>Nomor ini telah terdaftar</Text>
            <Text style={[styles.subtitleEnterPhone, { paddingBottom: 10 }]}>Masukkan password Anda</Text>
            <View style={styles.inputView}>
                <InputPIN
                    inputWidth={250}
                    value={FormRegister.secondPIN}
                    handleChangeText={(psw) => dispatch(addFirstPassword(psw))}
                    inputProps={{
                        onBlur: () => setViewForgot(true),
                        onFocus: () => setViewForgot(false)
                    }}
                />
            </View>
            <Text style={styles.textForgot} onPress={_forgotPIN}>Lupa password ?</Text>
            <View style={{ position: 'absolute', bottom: 10 }}>
                <UnauthBottomButton
                    onPressBackBtn={() => navigation.goBack()}
                    onPressNextBtn={_handlePasswordLogin}
                    login
                />
            </View>
        </LinearGradient>
    );
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