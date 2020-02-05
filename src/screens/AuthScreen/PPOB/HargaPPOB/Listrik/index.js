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

const AturListrik = ({ navigation }) => {
    return <Container>
        <GlobalHeader title="Atur Harga Listrik" onPressBack={() => navigation.goBack()} />
        <ContainerBody>
            <Wrapper style={styles.wrapper} justify="space-between">
                <Wrapper _width="60%">
                    <Image size={50} source={require('src/assets/ppob/bca.png')} />
                    <Text _width="60%">Telekomunikasi - Halo</Text>
                </Wrapper>
                <MDInput _style={{ width: '40%', }} label="Biaya Pembayaran" />
            </Wrapper>
        </ContainerBody>
    </Container>
}

export default AturListrik

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: ColorsList.whiteColor,
        padding: 10
    }
})