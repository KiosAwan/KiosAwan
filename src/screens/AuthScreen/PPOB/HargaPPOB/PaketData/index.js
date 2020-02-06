import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Container, { ContainerBody } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { ColorsList } from 'src/styles/colors'
import { Wrapper } from 'src/components/View/Wrapper'
import { Text } from 'src/components/Text/CustomText'

import Icon from 'react-native-vector-icons/FontAwesome5'
import styles from './PaketDataStyle'
import { AwanPopup } from 'src/components/ModalContent/Popups'
import { Button } from 'src/components/Button/Button'
import { SizeList } from 'src/styles/size'
import Divider from 'src/components/Row/Divider'
import { Image } from 'src/components/CustomImage'
import MDInput from 'src/components/Input/MDInput'
import { convertRupiah } from 'src/utils/authhelper'
import { Bottom } from 'src/components/View/Bottom'

const AturPaketData = ({ navigation }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [nativeEvent, setNativeEvent] = useState({})
    const _layout = ({ nativeEvent }) => {
        setNativeEvent(nativeEvent)
    }
    return (
        <Container>
            <GlobalHeader title="Atur Harga Paket Data" onPressBack={() => navigation.goBack()} />
            <TouchableOpacity onLayout={_layout} onPress={() => setDropdownVisible(true)}>
                <View style={styles.selectContainer}>
                    <Wrapper justify="space-between" style={styles.selectWrapper}>
                        <Text size={16}>Pilih layanan seluler</Text>
                        <Icon color={ColorsList.greyFont} size={15} name="chevron-down" />
                    </Wrapper>
                </View>
            </TouchableOpacity>
            <AwanPopup.Menu noTitle transparent absolute visible={dropdownVisible}
                backdropDismiss={() => setDropdownVisible(false)}
                style={styles.dropdownStyle}
                contentStyle={[styles.dropdownContentStyle, Object.keys(nativeEvent).length > 0 ? { top: parseInt(nativeEvent.layout.y) + parseInt(nativeEvent.layout.height) } : { top: 60 }]}
            >
                {
                    [1, 2].map((item, i) => [
                        <Button key={i} width={SizeList.width} wrapper={{ justify: 'flex-start', }} key={i} justify="space-between" color="link">
                            <Text>{i}</Text>
                            <Text>Pilihan nya ada berapa makan</Text>
                        </Button>,
                        <Divider />
                    ])
                }
            </AwanPopup.Menu>
            <ContainerBody>
                {[1, 2, 3, 4].map((item, i) => (
                    <Wrapper key={i} style={styles.wrapper} justify="space-between">
                        <View _width="60%" style={styles.leftWrapper}>
                            <Text font="Bold" color="primary" _width="60%">Paket Data 28MB</Text>
                            <Text _width="60%">Modal : {convertRupiah(28100)}</Text>
                        </View>
                        <MDInput _style={styles.rightWrapper} value="20000" label="Biaya Pembayaran" />
                    </Wrapper>
                ))}
            </ContainerBody>
            <Bottom>
                <Button width="100%">SIMPAN</Button>
            </Bottom>
        </Container>
    )
}

export default AturPaketData

