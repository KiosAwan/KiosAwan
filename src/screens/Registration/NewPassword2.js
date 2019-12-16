import React, {useState} from 'react';
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

//Functions


const NewPassword2 = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    const [isLoading, setIsLoading] = useState(false)
    // //Sending OTP code to server
    const _handleChangePIN = (psw) => {
            dispatch(addSecondPassword(psw))
    }

    const _handleSendNewPIN =async () => {
        if (FormRegister.password != FormRegister.secondpassword) {
            alert("Pin harus sama")
        } else {
            setIsLoading(true)
            const data = {
                phone_number: "62" + FormRegister.phone_number,
                password: FormRegister.password
            }
            const res = await sendNewPassword(data)
            if (res.status == 200) {
                dispatch(clearAllRegistration())
                setIsLoading(false)
                navigation.navigate('/')
            } else {
                if (res.status == 400) {
                    alert(res.data.errors.msg)
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
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Enter PIN"
            />
            <View style={{ alignItems: "center" }}>
                <View style={{ width: '70%', paddingTop: 30 }}>
                    <Text style={{ textAlign: "center", color: 'black' }}>Confirm your Password</Text>
                </View>
                <InputPIN
                    textColor="black"
                    inputWidth={250}
                    value={FormRegister.secondPIN}
                    handleChangeText={(pin) => _handleChangePIN(pin)}
                />
            </View>
            {isLoading ? <Spinner color="#cd0192" /> : null}
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