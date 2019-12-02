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
import { addFirstPIN } from '../../redux/actions/actionsRegistration'
import BarStatus from '../../components/BarStatus';

//Functions

const height = Dimensions.get('window').height

const NewPIN1 = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    // //Sending OTP code to server
    const _handleChangePIN = async (pin) => {
        if (pin.length <= 6) {
            await dispatch(addFirstPIN(pin))
            if (pin.length == 6) {
                const tespin = /\b(\d)\1+\b/
                if (tespin.test(pin)) {
                    alert("Pin tidak boleh sama semua")
                } else {
                    navigation.navigate('NewPIN2')
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
                    <Text style={{ textAlign: "center", color: 'black' }}>Set your new PIN</Text>
                </View>
                <InputPIN
                    textColor="black"
                    inputWidth={200}
                    value={FormRegister.firstPIN}
                    handleChangeText={(pin) => _handleChangePIN(pin)}
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