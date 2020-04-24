import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

//Own Custom Component
import { GlobalHeader } from '../../components/Header/Header'
import { InputPIN } from '../../components/Input/InputPIN'


//Redux Actions
import { clearAllRegistration, addSecondPassword } from '../../redux/actions/actionsRegistration'
import BarStatus from '../../components/BarStatus';
import { BottomButton } from '../../components/Button/ButtonComp';
import { ColorsList } from '../../styles/colors';
import { SizeList } from '../../styles/size';
import { sendNewPassword } from '../../utils/unauthhelper';
import { Spinner } from 'native-base';
import { FontList } from 'src/styles/typography';
import AsyncStorage from '@react-native-community/async-storage';
import { AwanPopup } from 'src/components/ModalContent/Popups';

//Functions


const NewPassword2 = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    const [isLoading, setIsLoading] = useState(false)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    // //Sending OTP code to server
    const _handleChangePIN = (psw) => {
        dispatch(addSecondPassword(psw))
    }

    const _handleSendNewPIN = async () => {
        if (FormRegister.password != FormRegister.secondpassword) {
            setAlertMessage("PIN harus sama")
            setAlert(true)
        } else {
            setIsLoading(true)
            const data = {
                phone_number: "62" + FormRegister.phone_number,
                password: FormRegister.password
            }
            const res = await sendNewPassword(data)
            if (res.status == 200) {
                await AsyncStorage.setItem('userId', res.data.id.toString())
                await AsyncStorage.setItem('@user_token', res.data.token)
                dispatch(clearAllRegistration())
                setIsLoading(false)
                navigation.navigate('/')
            } else {
                if (res.status == 400) {
                    setAlertMessage(res.data.errors.msg)
                    setAlert(true)
                    setIsLoading(false)
                } else {
                    alert(JSON.stringify(res))
                }
            }
        }
    }

    return (
        <View style={styles.container} >
            <BarStatus />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Atur Password"
            />
            <View style={{ alignItems: "center" }}>
                <View style={{ width: '70%', paddingTop: 30 }}>
                    <Text style={{ ...FontList.title, textAlign: "center", color: ColorsList.greySoft }}>Masukkan kembali password</Text>
                </View>
                <InputPIN
                    textColor="black"
                    inputWidth={250}
                    value={FormRegister.secondPIN}
                    handleChangeText={(pin) => _handleChangePIN(pin)}
                />
            </View>
            {isLoading ? <Spinner color={ColorsList.primary} /> : null}
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleSendNewPIN}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 20 }}
                    buttonTitle="LANJUT"
                />
            </View>
        </View>
    );
}

export default NewPassword2

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },
    borderStyleHighLighted: {
        borderColor: ColorsList.successHighlight,
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: ColorsList.successHighlight,
    },
})