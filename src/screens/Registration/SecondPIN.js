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
import {HeaderRegister} from '../../components/Header/Header'
import { InputPIN } from '../../components/Input/InputPIN'
import BarStatus from '../../components/BarStatus';


//Redux Actions
import { addSecondPIN, clearAllRegistration } from '../../redux/actions/actionsRegistration'
import { registerUser } from '../../utils/unauthhelper';

//Functions

const height = Dimensions.get('window').height

const FirstPIN = ({navigation}) => {
    const dispatch = useDispatch()
    const FormRegister = useSelector(state => state.Registration)
    // //Sending OTP code to server
    const _handleChangePIN = async (pin) => {
        if(pin.length <= 6) {
            await dispatch(addSecondPIN(pin))
            if (pin.length == 6) {
                if(FormRegister.firstPIN != pin) {
                    alert("Pin harus sama")
                }else {
                    const data = {
                        name : FormRegister.name,
                        phone_number : "62"+FormRegister.phone_number,
                        role : 'Owner',
                        pin : pin
                    }
                const res = await registerUser(data)
                console.log(res)
                if(res.status == 200) {
                    await dispatch(clearAllRegistration())
                    navigation.navigate('Home')    
                }else {
                    if(res.data.errors.msg){
                        alert(res.data.errors.msg)
                    }else {
                        alert("Cek koneksi anda")
                    }
                }             
                }
            }
        }
    }
    //Next button function
    const _handleNextButton = async () => {
        if(FormRegister.firstPIN != FormRegister.secondPIN) {
            alert("Pin harus sama")
        }else {
        navigation.navigate('Home')             
    }}

    return (
    <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container} >
        <BarStatus/>
        <HeaderRegister 
            onPressBack={() => navigation.goBack()}
            onPressNext={_handleNextButton}
            />
            <View style={{width : '70%', paddingTop : 30}}>
                <Text style={{textAlign : "center", color : 'white'}}>Confirm your PIN</Text>
            </View>
            <InputPIN
            inputWidth={250}
            value={FormRegister.secondPIN}
            handleChangeText={(pin) => _handleChangePIN(pin)}
            />
    </LinearGradient>
    );
}

export default FirstPIN

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : "center",
        backgroundColor : '#cd0192'
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