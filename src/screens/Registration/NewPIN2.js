import React from 'react';
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

//Functions


const NewPIN2 = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    // //Sending OTP code to server
    const _handleChangePIN = (psw) => {
            dispatch(addSecondPassword(psw))
    }

    const _handleSendNewPIN =async () => {
        if (FormRegister.password != FormRegister.secondpassword) {
            alert("Pin harus sama")
        } else {
            const data = {
                phone_number: "62" + FormRegister.phone_number,
                password: FormRegister.password
            }
            const res = await sendNewPassword(data)
            if (res.status == 200) {
                await dispatch(clearAllRegistration())
                navigation.navigate('Home')
            } else {
                if (res.status == 400) {
                    alert(res.data.errors.msg)
                } else {
                    alert("Cek koneksi anda")
                }
            }
        }
    }

    return (
        <View style={styles.container} >
            <BarStatus />
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Enter PIN"
            />
            <View style={{ alignItems: "center" }}>
                <View style={{ width: '70%', paddingTop: 30 }}>
                    <Text style={{ textAlign: "center", color: 'black' }}>Confirm your PIN</Text>
                </View>
                <InputPIN
                    textColor="black"
                    inputWidth={250}
                    value={FormRegister.secondPIN}
                    handleChangeText={(pin) => _handleChangePIN(pin)}
                />
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleSendNewPIN}
                    style={{backgroundColor: ColorsList.primaryColor, width: SizeList.width - 20 }}
                    buttonTitle="LANJUT"
                />
            </View>
        </View>
    );
}

export default NewPIN2

const styles = StyleSheet.create({
    container: {
        flex: 1,
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