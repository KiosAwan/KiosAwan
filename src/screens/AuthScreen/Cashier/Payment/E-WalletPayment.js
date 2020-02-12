import React, { useState, useEffect } from 'react'
import Container, { ContainerBody } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { Text } from 'src/components/Text/CustomText'
import { convertRupiah } from 'src/utils/authhelper'
import { useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { ColorsList } from 'src/styles/colors'
import Divider from 'src/components/Row/Divider'
import { Image } from 'src/components/CustomImage'
import { Bottom } from 'src/components/View/Bottom'
import { Button } from 'src/components/Button/Button'
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
            <ContainerBody>
                <View style={styles.childCont}>
                    <Text>{User.store.name_store.toUpperCase()}</Text>
                    <Text>{`${User.store.address_store.split('%')[0]}, ${User.store.address_store.split('%')[4]}`}</Text>
                    <View style={[styles.qrWrap, {marginTop: 10}]}>
                        <View style={styles.group}>
                            <Image size={250} source={require("src/assets/payment/AssetQR.png")} />
                            <Text align="center">Silahkan scan kode QR untuk melanjutkan transaksi</Text>
                        </View>
                        <Divider style={{ width: "100%" }} />
                        <View style={styles.group}>
                            <Text>Total Transaksi</Text>
                            <Text font="Bold" size={25} color="primary">{convertRupiah(amountBill)}</Text>
                        </View>
                    </View>
                </View>
            </ContainerBody>
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
        alignItems: "center",
        marginHorizontal: 25,
        padding: 5
    },
    qrWrap: {
        backgroundColor: ColorsList.whiteColor,
        width: "100%",
        alignItems: "center",
    },
    group : {
        padding : 20,
        alignItems : "center"
    }
})