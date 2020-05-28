import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
    TextInput
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
import Container from 'src/components/View/Container';
import UnauthHeader from 'src/components/View/UnauthHeader';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { Icon } from 'native-base';
import { Button } from 'src/components/Button/Button';

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
        if (psw.length < 8) setBtnDisabled(true)
        else setBtnDisabled(false)
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
            <Text align="center">Masukkan password baru Anda.</Text>
            <Wrapper spaceBetween style={{ marginVertical: 10, color: ColorsList.greyFont, marginLeft: 5, elevation: 2, padding: 10, backgroundColor: ColorsList.authBackground }}>
                <TextInput
                    _flex
                    autoFocus
                    secureTextEntry={secure}
                    placeholder="Masukkan Password"
                    style={{ color: ColorsList.greyFont }}
                    value={FormRegister.firstPIN}
                    onChangeText={(pin) => _handleChangePIN(pin)}
                />
                <Icon onPress={() => setSecure(!secure)} style={{ color: ColorsList.greyFont }} name={!secure ? "eye" : "eye-off"} />
            </Wrapper>
        </View>
        <Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handleNextBtn}>LANJUT</Button>
    </Container>
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
                    <Text style={{ ...FontList.title, textAlign: "center", color: ColorsList.greySoft }}>Buat password baru</Text>
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
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 20 }}
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