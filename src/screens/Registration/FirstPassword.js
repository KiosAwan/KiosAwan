import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


//Own Custom Component
import { HeaderRegister } from '../../components/Header/Header'
import { InputPIN } from '../../components/Input/InputPIN'

//Redux Actions
import { addFirstPIN, addFirstPassword } from '../../redux/actions/actionsRegistration'
import { UnauthBottomButton } from '../../components/Button/UnauthButton';
import { FontList } from '../../styles/typography';
import { ColorsList } from 'src/styles/colors';
import { AwanPopup } from 'src/components/ModalContent/Popups';

//Functions

const FirstPassword = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    // //Sending OTP code to server
    const _handleChangePassword = async (pass) => {
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