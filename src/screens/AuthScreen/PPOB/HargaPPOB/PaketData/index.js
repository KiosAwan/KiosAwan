import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Container, { ContainerBody } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { ColorsList } from 'src/styles/colors'
import { Wrapper } from 'src/components/View/Wrapper'
import { Text } from 'src/components/Text/CustomText'

import Icon from 'react-native-vector-icons/FontAwesome5'
import styles from './PaketDataStyle'
import { AwanPopup } from 'src/components/ModalContent/Popups'

const AturPaketData = ({ navigation }) => {
    const [dropdownVisible, setDropdownVisible ] = useState(false)

    return (
        <Container>
            <GlobalHeader title="Atur Harga Paket Data" onPressBack={() => navigation.goBack()} />
            <TouchableOpacity onPress={() => setDropdownVisible(true)}>
                <View style={styles.selectContainer}>
                    <Wrapper justify="space-between" style={styles.selectWrapper}>
                        <Text size={16}>Pilih layanan seluler</Text>
                        <Icon color={ColorsList.greyFont} size={15} name="chevron-down" />
                    </Wrapper>
                </View>
            </TouchableOpacity>
            {dropdownVisible ?
            <AwanPopup    
        }
            <ContainerBody>
            </ContainerBody>
        </Container>
    )
}

export default AturPaketData
