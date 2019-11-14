import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import { 
    View, 
    StyleSheet,
    Text,
    StatusBar
} from 'react-native';

//Own Custom Component
import { GlobalHeader} from '../../components/Header/Header'
import { InputPIN } from '../../components/Input/InputPIN'


//Redux Actions
import { addSecondPIN, clearAllRegistration } from '../../redux/actions/actionsRegistration'
import { sendNewPIN } from '../../utils/unauthhelper';
import { ColorsList } from '../../styles/colors';

//Functions


const NewPIN2 = ({navigation}) => {
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
                        phone_number : "62"+FormRegister.phone_number,
                        pin : pin
                    }
                const res = await sendNewPIN(data)
                await dispatch(clearAllRegistration())
                navigation.navigate('Home') 
                }
            }
        }
    }
    
    return (
    <View style={styles.container} >
        <StatusBar
                backgroundColor={ColorsList.primaryColor}/>
        <GlobalHeader 
            onPressBack={() => navigation.goBack()}
            title="Enter PIN"
        />
        <View style={{alignItems : "center"}}>
            <View style={{width : '70%', paddingTop : 30}}>
                <Text style={{textAlign : "center", color : 'black'}}>Confirm your PIN</Text>
            </View>
            <InputPIN
            textColor="black"
            inputWidth={250}
            value={FormRegister.secondPIN}
            handleChangeText={(pin) => _handleChangePIN(pin)}
            />
        </View>
    </View>
    );
}

export default NewPIN2

const styles = StyleSheet.create({
    container : {
        flex : 1,
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