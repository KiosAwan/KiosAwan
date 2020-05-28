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
    return <Container style={{ justifyContent: 'center', padding: 15 }}>
        <View style={{ marginBottom: 10, flex:1 }}>
            <Image
                style={{ width: 170, height: 100, alignSelf: "center" }}
                source={require('src/assets/images/logo.png')}
            />
            <Text align="center">Buat password untuk kemananan dalam mengakses aplikasi ini.</Text>
            <Wrapper spaceBetween style={{ marginVertical: 10, color: ColorsList.greyFont, marginLeft: 5, elevation: 2, padding: 10, backgroundColor: ColorsList.authBackground }}>
                <TextInput
                    _flex
                    autoFocus
                    secureTextEntry={secure}
                    placeholder="Masukkan Password"
                    value={FormRegister.password}
                    style={{ color: ColorsList.greyFont }}
                    onChangeText={(pass) => _handleChangePassword(pass)}
                />
                <Icon onPress={() => setSecure(!secure)} style={{ color: ColorsList.greyFont }} name={!secure ? "eye" : "eye-off"} />
            </Wrapper>
        </View>
        <Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handleNextButton}>LANJUT</Button>
    </Container>

    return (
        <LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={styles.container} >
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <HeaderRegister
                onPressBack={() => navigation.goBack()}
                onPressNext={_handleNextButton}
            />
            <View style={{ width: '70%', paddingVertical: 20 }}>
                <Text style={{ textAlign: "center", color: 'white' }}>Masukkan password</Text>
            </View>
            <InputPIN
                placeholderTextColor={ColorsList.primaryColor}
                inputWidth={200}
                value={FormRegister.password}
                handleChangeText={(pass) => _handleChangePassword(pass)}
            />
            <View style={{ position: 'absolute', bottom: 10 }}>
                <UnauthBottomButton
                    onPressBackBtn={() => navigation.goBack()}
                    onPressNextBtn={_handleNextButton}
                />
            </View>
        </LinearGradient>
    )
}

export default FirstPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: ColorsList.primary
    },
    borderStyleBase: {
        width: 30,
        height: 45,
        borderRadius: 20
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