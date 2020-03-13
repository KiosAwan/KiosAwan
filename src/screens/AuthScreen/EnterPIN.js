import React, { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
// import PinView from 'react-native-pin-view';
import { ColorsList } from 'src/styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativePinView from "react-native-pin-view"
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';

const EnterPIN = ({ navigation }) => {
    return <LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: ColorsList.primary
    }}>
        {/* <Text color="whiteColor" size={20} style={{ alignSelf: 'center', }}>Enter your PIN</Text>
            <ReactNativePinView
                onComplete={(val, clear) => { alert(val) }}
                pinLength={4}
                inputSize={10}
                buttonDeletePosition="right"
                keyboardViewStyle={{backgroundColor : 'transparent', borderWidth : 1, borderColor : ColorsList.whiteColor}}
                // inputBgColor={ColorsList.whiteColor}
                keyboardViewTextStyle={{color : ColorsList.whiteColor}}
                inputActiveBgColor={ColorsList.whiteColor}
            /> */}
        <PinView
            pinLength={6}
            onComplete={(val, clear) => { alert(val) }}
        />
    </LinearGradient>
}

const PinView = props => {
    const { pinLength, customBtnText, customBtnCallback, onComplete } = props
    const [pin, setPin] = useState('')
    const [_pinLength, setPinLength] = useState(6)
    const pinClick = btn => {
        if (!['~', 'del'].includes(btn)) {
            let pinDone = pin.toString() + btn
            if (pin.length < _pinLength) setPin(pinDone)
            if (pinLength - 1 == pin.length) {
                onComplete(pinDone, () => setPin(''))
            }
        } else if (btn == 'del') {
            let deleted = pin.substr(0, pin.length - 1)
            setPin(deleted)
        } else {
            customBtnCallback && customBtnCallback()
        }
    }
    useEffect(() => {
        if (pinLength) {
            setPinLength(pinLength)
        }
    }, [])
    return <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ alignSelf: 'center', flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            {
                [
                    Array.generateEmpty(pinLength).map((item, i) => {
                        let txt = pin[item]
                        return <View key={i} style={{
                            padding: 10,
                            backgroundColor: 'blue',
                            margin: 2
                        }}>
                            <Text color={txt ? ColorsList.whiteColor : ColorsList.transparent}>{txt || '8'}</Text>
                        </View>
                    })
                ]
            }
            {props.children}
        </View>
        <View>
            <FlatList
                style={{ padding: 10, }}
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, '~', 0, 'del']}
                numColumns={3}
                keyExtractor={(item, i) => i.toString()}
                renderItem={({ item }) => <Button
                    style={{
                        flex: 1,
                        borderRadius: 50
                    }}
                    padding={20}
                    textProps={{ size: 20 }}
                    color={['transparent', 'whiteColor']}
                    onPress={() => pinClick(item)}>
                    {item == '~' ? (customBtnText ? customBtnText : '') : item.toString().toUpperCase()}
                </Button>}
            />
        </View>
    </View>
}

export default EnterPIN;