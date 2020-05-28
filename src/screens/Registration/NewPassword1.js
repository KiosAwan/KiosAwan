import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';

//Own Custom Component
import { GlobalHeader } from '../../components/Header/Header'
import { InputPIN } from '../../components/Input/InputPIN'

//Redux Actions
import { addFirstPassword } from '../../redux/actions/actionsRegistration'
import BarStatus from '../../components/BarStatus';
import { BottomButton } from '../../components/Button/ButtonComp';
import { SizeList } from '../../styles/size';
import { ColorsList } from '../../styles/colors';
import { FontList } from 'src/styles/typography';
import { AwanPopup } from 'src/components/ModalContent/Popups';

//Functions

const height = Dimensions.get('window').height

const NewPassword1 = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    // //Sending OTP code to server
    const _handleChangePIN = async (psw) => {
        await dispatch(addFirstPassword(psw))
    }
    const _handleNextBtn = () => {
        if (FormRegister.password.length < 8) {
            setAlertMessage("Password minimal 8 karakter")
            setAlert(true)
        }
        else {
            navigation.navigate('/unauth/login/forgot-password/new-password-2')
        }
    }
    return (
        <View style={styles.container} >
            <BarStatus />
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Atur password"
            />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <View style={{ alignItems: "center" }}>
                <View style={{ width: '70%', paddingTop: 30 }}>
                    <Text style={{...FontList.title, textAlign: "center", color: ColorsList.greySoft }}>Buat password baru</Text>
                </View>
                <InputPIN
                    textColor="black"
                    inputWidth={200}
                    value={FormRegister.firstPIN}
                    handleChangeText={(pin) => _handleChangePIN(pin)}
                />
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleNextBtn}
                    style={{backgroundColor: ColorsList.primaryColor, width: SizeList.width - 20 }}
                    buttonTitle="LANJUT"
                />
            </View>
        </View>
    );
}

export default NewPassword1

const styles = StyleSheet.create({
    container: {
        flex: 1,
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