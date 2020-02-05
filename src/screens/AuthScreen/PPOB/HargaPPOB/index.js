import React from 'react'
import { View } from 'react-native'
import Container, { ContainerBody } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { Button } from 'src/components/Button/Button'
import { $Padding } from 'src/utils/stylehelper'
import { Image } from 'src/components/CustomImage'
import { Wrapper } from 'src/components/View/Wrapper'
import { Text } from 'src/components/Text/CustomText'

const SettingHargaPPOB = ({ navigation }) => {
    return <Container>
        <GlobalHeader title="Atur Harga Produk" onPressBack={() => navigation.goBack()} />
        <ContainerBody>
            <Button
                onPress={() => { }}
                style={{ marginBottom: 5 }}
                padding={$Padding(5, 10)}
                wrapper={{ justify: 'flex-start' }}
                color={['whiteColor', 'greyFont']}>
                <Image width="13%" size={30} source={require('src/assets/icons/next.png')} />
                <Wrapper width="87%" justify="space-between">
                    <Text>kjaskhdasjd</Text>
                    <Image size={20} source={require('src/assets/icons/next.png')} />
                </Wrapper>
            </Button>
        </ContainerBody>
    </Container>
}

export default SettingHargaPPOB
