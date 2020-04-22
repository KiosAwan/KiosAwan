import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
//Styling
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { Spinner } from 'native-base'
import LinearGradient from 'react-native-linear-gradient';

//Own Custom Component
import { HeaderRegister } from '../../components/Header/Header'
import { InputPIN } from '../../components/Input/InputPIN'
import BarStatus from '../../components/BarStatus';


//Redux Actions
import { clearAllRegistration, addSecondPassword } from '../../redux/actions/actionsRegistration'
import { registerUser } from '../../utils/unauthhelper';
import { getProfile } from '../../redux/actions/actionsUserData';
import { UnauthBottomButton } from '../../components/Button/UnauthButton';

//Functions


const SecondPassword = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    const [isLoading, setIsLoading] = useState(false)
    // //Sending OTP code to server
    const _handleChangePIN = async (psw) => {
        await dispatch(addSecondPassword(psw))
    }
    //Next button function
    const _handleNextButton = async () => {
        if (FormRegister.password != FormRegister.secondpassword) {
            alert("Password harus sama")
        } else {
            setIsLoading(true)
            const pushToken = await AsyncStorage.getItem("@push_token")
            const data = {
                name: FormRegister.name,
                phone_number: "62" + FormRegister.phone_number,
                role: 'Owner',
                password: FormRegister.password,
                id_device: FormRegister.deviceId,
                push_token: pushToken
            }
            const res = await registerUser(data)
            if (res.status == 200) {
                await AsyncStorage.setItem('userId', res.data.id.toString())
                await AsyncStorage.setItem('@user_token', res.data.token)
                await dispatch(getProfile(res.data.id.toString(), res.data.token))
                setIsLoading(false)
                await dispatch(clearAllRegistration())
                navigation.navigate('/')
            } else {
                if (res.status == 400) {
                    alert(res.data.errors.msg)
                }
            }
        }
    }

    return (
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container} >
            <BarStatus />
            <HeaderRegister
                onPressBack={() => navigation.goBack()}
                onPressNext={_handleNextButton}
            />
            <View style={{ width: '70%', paddingVertical: 20 }}>
                <Text style={{ textAlign: "center", color: 'white' }}>Masukkan kembali password</Text>
            </View>
            <InputPIN
                inputWidth={250}
                value={FormRegister.secondPIN}
                handleChangeText={(pin) => _handleChangePIN(pin)}
            />
            <View style={{ position: 'absolute', bottom: 10 }}>
                <UnauthBottomButton
                    onPressBackBtn={() => navigation.goBack()}
                    onPressNextBtn={_handleNextButton}
                />
            </View>

            {isLoading ? <Spinner color="white" /> : null}
        </LinearGradient>
    );
}

export default SecondPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#cd0192'
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
})