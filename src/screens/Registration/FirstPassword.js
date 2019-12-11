import React from 'react';
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

//Functions

const height = Dimensions.get('window').height

const FirstPassword = ({ navigation }) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    // //Sending OTP code to server
    const _handleChangePassword = async (pass) => {
        await dispatch(addFirstPassword(pass))
    }
    //Next button function
    const _handleNextButton = async () => {
        if (FormRegister.password.length < 8) {
            alert("Password minimal 8 karakter")
        } else {
            navigation.navigate('SecondPassword')
        }
    }

    return (
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container} >
            <HeaderRegister
                onPressBack={() => navigation.goBack()}
                onPressNext={_handleNextButton}
            />
            <View style={{ width: '70%', paddingTop: 30 }}>
                <Text style={{ textAlign: "center", color: 'white'}}>Set Your Password</Text>
            </View>
            <InputPIN
                inputWidth={200}
                value={FormRegister.password}
                handleChangeText={(pass) => _handleChangePassword(pass)}
            />
            <View style={{position : 'absolute', bottom : 10}}>
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
        backgroundColor: '#cd0192'
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