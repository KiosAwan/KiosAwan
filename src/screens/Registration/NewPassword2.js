import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    TextInput
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
import { Spinner, Icon } from 'native-base';
import { FontList } from 'src/styles/typography';
import AsyncStorage from '@react-native-community/async-storage';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Container from 'src/components/View/Container';
import UnauthHeader from 'src/components/View/UnauthHeader';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import Alert from 'src/utils/alert';

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
        if (psw.length < 8) setBtnDisabled(true)
        else setBtnDisabled(false)
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
                    Alert("", JSON.stringify(res))
                    // alert(JSON.stringify(res))
                }
            }
        }
    }

    const [secure, setSecure] = useState(true)
    const [btnDisabled, setBtnDisabled] = useState(true)
    return <Container style={{ padding: 15 }}>
        <AwanPopup.Alert
            message={alertMessage}
            visible={alert}
            closeAlert={() => setAlert(false)}
        />
        <View style={{ justifyContent: 'center', marginBottom: 10, flex: 1 }}>
            <UnauthHeader />
            <Text align="center">Masukkan konfirmasi password.</Text>
            <Wrapper spaceBetween style={{ marginVertical: 10, color: ColorsList.greyFont, marginLeft: 5, elevation: 2, padding: 10, backgroundColor: ColorsList.authBackground }}>
                <TextInput
                    _flex
                    autoFocus
                    secureTextEntry={secure}
                    placeholder="Masukkan Password"
                    style={{ color: ColorsList.greyFont }}
                    value={FormRegister.secondPIN}
                    onChangeText={(pin) => _handleChangePIN(pin)}
                />
                <Icon onPress={() => setSecure(!secure)} style={{ color: ColorsList.greyFont }} name={!secure ? "eye" : "eye-off"} />
            </Wrapper>
        </View>
        <Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handleSendNewPIN}>LANJUT</Button>
    </Container>
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