import React from 'react';
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
import { addFirstPIN, addFirstPassword } from '../../redux/actions/actionsRegistration'
import BarStatus from '../../components/BarStatus';
import { BottomButton } from '../../components/Button/ButtonComp';
import { SizeList } from '../../styles/size';
import { ColorsList } from '../../styles/colors';

//Functions

const height = Dimensions.get('window').height

const NewPIN1 = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    // //Sending OTP code to server
    const _handleChangePIN = async (psw) => {
        await dispatch(addFirstPassword(psw))
    }
    const _handleNextBtn = () => {
        if (FormRegister.password.length < 8) {
            alert("Password minimal 8 karakter")
        }
        else {
            navigation.navigate('NewPIN2')
        }
    }
    return (
        <View style={styles.container} >
            <BarStatus />
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Enter Password"
            />
            <View style={{ alignItems: "center" }}>
                <View style={{ width: '70%', padding: 30 }}>
                    <Text style={{ textAlign: "center", color: 'black' }}>Set your new password</Text>
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

export default NewPIN1

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