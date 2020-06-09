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
import { Spinner, Icon } from 'native-base';
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
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { ColorsList } from 'src/styles/colors';
import Container from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';
import UnauthHeader from 'src/components/View/UnauthHeader';
import { Input } from 'src/components/Input/MDInput';
import { SizeList } from 'src/styles/size';

//Functions


const SecondPassword = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    const [isLoading, setIsLoading] = useState(false)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    const [secure, setSecure] = useState(true)
    const [btnDisabled, setBtnDisabled] = useState(true)
    // //Sending OTP code to server
    const _handleChangePIN = async (psw) => {
        if (psw.length > 7) setBtnDisabled(false)
        else setBtnDisabled(true)
        await dispatch(addSecondPassword(psw))
    }
    //Next button function
    const _handleNextButton = async () => {
        if (FormRegister.password != FormRegister.secondpassword) {
            setAlertMessage("Password harus sama")
            setAlert(true)
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
                    setAlertMessage(res.data.errors.msg)
                    setAlert(true)
                }
            }
        }
    }
    return <Container style={{ justifyContent: 'center', padding: SizeList.base }}>
        <View style={{ marginBottom: 10, flex: 1, justifyContent: "center", alignItems: "center" }}>
            <UnauthHeader />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <AwanPopup.Loading visible={isLoading} />
            <Text align="center">Ulangi password Anda.</Text>
            <Input
                _flex
                autoFocus
                noLabel
                secureTextEntry={secure}
                placeholder="Konfirmasi password"
                style={{ marginTop: SizeList.base }}
                value={FormRegister.secondPIN}
                onChangeText={(pin) => _handleChangePIN(pin)}
                renderRightAccessory={() => <Icon onPress={() => setSecure(!secure)} style={{ color: ColorsList.greyFont }} name={!secure ? "eye" : "eye-off"} />}
            />
        </View>
        <Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handleNextButton}>LANJUT</Button>
    </Container>
}

export default SecondPassword
