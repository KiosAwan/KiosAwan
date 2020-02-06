import React from 'react'
import Container, { ContainerBody } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { Button } from 'src/components/Button/Button'
import { $Padding } from 'src/utils/stylehelper'
import { Image } from 'src/components/CustomImage'
import { Wrapper } from 'src/components/View/Wrapper'
import { Text } from 'src/components/Text/CustomText'
import MDInput from 'src/components/Input/MDInput'
import { ColorsList } from 'src/styles/colors'
import { StyleSheet } from 'react-native'

const AturTelkom = ({ navigation }) => {
    return <Container>
        <GlobalHeader title="Atur Harga Telkom" onPressBack={() => navigation.goBack()} />
        <ContainerBody>
            {[1, 2].map((item, i) => (<Wrapper key={i} style={styles.wrapper} justify="space-between">
                <Wrapper _width="60%" style={styles.leftWrapper}>
                    <Image style={{ resizeMode: "contain" }} size={50} source={require('src/assets/ppob/bca.png')} />
                    <Text _width="60%">Telekomunikasi - Halo</Text>
                </Wrapper>
                <MDInput _style={styles.rightWrapper} value="20000" label="Biaya Pembayaran" />
            </Wrapper>))}
        </ContainerBody>
    </Container>
}

export default AturTelkom

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: ColorsList.whiteColor,
        marginBottom : 10
    },
    leftWrapper: {
        padding: 5,
    },
    rightWrapper: {
        width: '40%',
        backgroundColor: ColorsList.greyBg,
        padding: 5,
    }
})