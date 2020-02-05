import React from 'react'
import { View } from 'react-native'
import Container, { ContainerBody } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'

const AturPaketData = ({ navigation }) => {
    return (
        <Container>
            <GlobalHeader title="Atur Harga Paket Data" onPressBack={()=> navigation.goBack()}/>
            <ContainerBody>
                
            </ContainerBody>
        </Container>
    )
}

export default AturPaketData
