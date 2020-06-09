import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';

//Redux Actions
import { addVerifyOTP } from '../../redux/actions/actionsRegistration'

//Functions
import { sendVerifyOTP, sendPhoneNumber } from '../../utils/unauthhelper';
import BarStatus from '../../components/BarStatus';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { Text } from 'src/components/Text/CustomText';
import Container from 'src/components/View/Container';
import { SizeList } from 'src/styles/size';


const VerifyOTPRegister = (props) => {
    const dispatch = useDispatch()
    const RegisterOTP = useSelector(state => state.Registration)
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    let [countdown, setCountdown] = useState(59)

    //Render when get intro screen
    useEffect(() => {
        _firstRender()
    }, [])

    //Function disabling button and set timer 
    const _firstRender = () => {
        let waktu = 58
        const a = setInterval(
            () => {
                if (waktu == 0) {
                    clearInterval(a)
                }
                setCountdown(waktu--)
            },
            1000
        );
        setTimeout(() => {
            setIsResendDisabled(false)
        }, 60000)
    }

    //Resend Code function
    const _resendCode = async () => {
        props.sendOTP()
        setIsResendDisabled(true)
        let theTimer = 58
        const a = setInterval(
            () => {
                if (theTimer == 0) {
                    clearInterval(a)
                }
                setCountdown(theTimer--)
            },
            1000
        );
        setTimeout(() => {
            setIsResendDisabled(false)
        }, 60000)

    }

    return (
        <Container style={{ justifyContent: 'center', padding: SizeList.base }}>
            <View style={styles.container}>
                <BarStatus />
                <Text style={{ marginTop: 10, }}>Masukkan kode OTP </Text>
                <Text style={{ marginTop: 10, }}>OTP telah dikirim melalui SMS ke nomor HP anda </Text>
                <CodeInput
                    keyboardType="numeric"
                    activeColor='black'
                    inactiveColor='grey'
                    codeLength={4}
                    size={40}
                    autoFocus
                    onFulfill={(code) => props.otpFulfilled(code)}
                />
                {isResendDisabled ?
                    <Text style={{ marginTop: 70 }}>RESEND ({countdown} s)</Text> :
                    <TouchableOpacity onPress={_resendCode} style={{ marginTop: 70 }}>
                        <Text color="primary">RESEND</Text>
                    </TouchableOpacity>
                }
            </View>
        </Container>
    );
}

export default VerifyOTPRegister

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        alignItems: "center"
    },
    borderStyleBase: {
        width: 30,
        height: 45
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