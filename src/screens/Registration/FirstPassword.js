import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
    Image,
    TextInput
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


//Own Custom Component
import { HeaderRegister } from 'src/components/Header/Header'
import { InputPIN } from 'src/components/Input/InputPIN'

//Redux Actions
import { addFirstPIN, addFirstPassword } from 'src/redux/actions/actionsRegistration'
import { UnauthBottomButton } from 'src/components/Button/UnauthButton';
import { FontList } from 'src/styles/typography';
import { ColorsList } from 'src/styles/colors';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Container from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { Icon } from 'native-base';
import UnauthHeader, { UnauthBackHeader } from 'src/components/View/UnauthHeader';
import { Input } from 'src/components/Input/MDInput';
import { SizeList } from 'src/styles/size';

//Functions

const FirstPassword = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    //alert
    const [alert, setAlert] = useState(false)
    const [secure, setSecure] = useState(true)
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [alertMessage, setAlertMessage] = useState(false)
    // //Sending OTP code to server
    const _handleChangePassword = async (pass) => {
        if (pass.length > 7) setBtnDisabled(false)
        else setBtnDisabled(true)
        await dispatch(addFirstPassword(pass))
    }
    //Next button function
    const _handleNextButton = async () => {
        if (FormRegister.password.length < 8) {
            setAlertMessage("Password minimal 8 karakter")
            setAlert(true)
        } else {
            navigation.navigate('/unauth/registration/second-password')
        }
    }
    return <Container style={{ justifyContent: 'center', padding: SizeList.base }}>
        <UnauthBackHeader onPressBack={() => navigation.goBack()} />
        <View style={{ marginBottom: 10, flex: 1, justifyContent: "center", alignItems: "center" }}>
            <UnauthHeader />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <Text align="center">Buat password untuk kemananan dalam mengakses aplikasi ini.</Text>
            <Input
                _flex
                autoFocus
                noLabel
                secureTextEntry={secure}
                placeholder="Masukkan password"
                style={{ marginTop: SizeList.base, color: ColorsList.greyFont }}
                value={FormRegister.password}
                onChangeText={(pass) => _handleChangePassword(pass)}
                renderRightAccessory={() => <Icon onPress={() => setSecure(!secure)} style={{ color: ColorsList.greyFont, fontSize: 20 }} name={!secure ? "eye" : "eye-off"} />}
            />
        </View>
        <Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handleNextButton}>LANJUT</Button>
    </Container>
}

export default FirstPassword
