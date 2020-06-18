import React, { useState, useEffect } from 'react'
import Container, { Body } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { Text } from 'src/components/Text/CustomText'
import { convertRupiah } from 'src/utils/authhelper'
import { useSelector } from 'react-redux'
import { View, StyleSheet, Image as NativeImage } from 'react-native'
import { ColorsList, infoColorSetting } from 'src/styles/colors'
import Divider from 'src/components/Row/Divider'
import { Image } from 'src/components/CustomImage'
import { Bottom } from 'src/components/View/Bottom'
import { Button, Info } from 'src/components/Button/Button'
import { SizeList } from 'src/styles/size'
const EWalletPayment = ({ navigation }) => {
    const [amountBill, setAmount] = useState()
    const User = useSelector(state => state.User)
    useEffect(() => {
        _getParams()
    }, [])

    const _getParams = async () => {
        const { amount } = navigation.state.params
        setAmount(amount)
    }
    return (
        <Container>
            <GlobalHeader title="Kode QR" onPressBack={() => navigation.goBack()} />
            <Body>
                <View style={styles.childCont}>
                    <Text>Total belanja anda :
                    <Text font="SemiBold" color="primary">{` ${convertRupiah(amountBill)}`}</Text>
                    </Text>
                    <View style={[styles.qrWrap, { marginTop: 10 }]}>
                        <View style={styles.group}>
                            <Text font="SemiBold" style={{ marginBottom: SizeList.base }} align="center">{User.store.name_store}</Text>
                            <Text align="center">{`${User.store.address_store.split('%')[0]}`}</Text>
                            <Divider style={{ marginVertical: SizeList.base }} />
                            <Image style={{ alignSelf: "center" }} size={150} source={require("src/assets/payment/AssetQR.jpg")} />
                            <NativeImage style={{ width: 150, height: 30, marginTop: SizeList.base, alignSelf: "center" }} source={require("src/assets/payment/iconQris.png")} />
                        </View>
                    </View>
                </View>
                <Info color={infoColorSetting} style={{ marginVertical: SizeList.padding }}>
                    Silahkan scan kode QR untuk melanjutkan proses transaksi
                    </Info>
            </Body>
            <Bottom>
                <Button onPress={() => navigation.goBack()} width="100%">
                    SIMPAN
                </Button>
            </Bottom>
        </Container>
    )
}

export default EWalletPayment

const styles = StyleSheet.create({
    childCont: {
        // marginBottom: 90
    },
    qrWrap: {
        backgroundColor: ColorsList.whiteColor,
        width: "100%",
        alignItems: "center",
        borderWidth: SizeList.borderWidth,
        borderColor: ColorsList.borderColor,
        borderRadius: SizeList.borderRadius
    },
    group: {
        padding: SizeList.padding,
        // alignItems: "center"
    }
})