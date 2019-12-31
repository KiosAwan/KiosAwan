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
import { BottomButton } from '../../components/Button/ButtonComp';
import { SizeList } from '../../styles/size';
import { InputText, InputNumber } from '../../components/Input/InputComp';
import { InputPIN } from '../../components/Input/InputPIN';


const LoginVerification = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    const [loading, setLoading] = useState(false)

    //Sending OTP code to server
    const _handlePasswordLogin = async (psw) => {
        setLoading(true)
        await dispatch(addFirstPassword(psw))
        const data = {
            phone_number: "62" + FormRegister.phone_number,
            password: FormRegister.password,
            id_device: FormRegister.deviceId
        }
        try {
            const res = await loginData(data)
            if (res.data.errors) {
                alert(res.data.errors.msg)
                setLoading(false)
            }
            else {
                await dispatch(clearAllRegistration())
                await AsyncStorage.setItem('userId', res.data.id)
                await dispatch(getProfile(res.data.id))
                setLoading(false)
                navigation.navigate('/')
            }
        }
        catch (err) {
            alert("Mohon periksa kembali jaringan Anda")
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
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container}>
            <BarStatus />
            {loading ? <Spinner color="white" /> : null}
            <View style={{padding : 20}}>
                <HeaderRegister
                />
            </View>
            <Text style={[styles.subtitleEnterPhone, {}]}>Nomor ini telah terdaftar</Text>
            <Text style={[styles.subtitleEnterPhone, { paddingBottom: 20 }]}>Masukkan password Anda</Text>
            <View style={styles.inputView}>
                <InputPIN
                    inputWidth={250}
                    value={FormRegister.secondPIN}
                    handleChangeText={(psw) => dispatch(addFirstPassword(psw))}
                />
            </View>
            <Text style={styles.textForgot} onPress={_forgotPIN}>
                Lupa password ?
            </Text>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handlePasswordLogin}
                    style={{ borderWidth: 1, borderColor: 'white', width: SizeList.width - 20 }}
                    buttonTitle="LOGIN"
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
        marginTop: 20,
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