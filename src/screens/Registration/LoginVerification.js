import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

//Styling
import {
    View,
    StyleSheet,
} from 'react-native';
import {
    Text,
    Spinner
} from 'native-base';
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


const LoginVerification = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    const [loading, setLoading] = useState(false)
    const [viewForgot, setViewForgot] = useState(true)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
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
        await sendOTP(data)
        navigation.navigate('/unauth/login/forgot-password')

    }

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