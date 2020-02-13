import React, { useState } from 'react';
import Container, { ContainerBody } from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import styles from './KreditStyles'
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { $Padding, $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import MDInput from 'src/components/Input/MDInput';
import { Bottom } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AwanPopup, Modal } from 'src/components/ModalContent/Popups';
import { SizeList } from 'src/styles/size';
import SearchInput from 'src/components/Input/SearchInput';

const Kredit = ({ navigation }) => {
    const [idPelanggan, setIdPelanggan] = useState(123123)
    const [amount, setAmount] = useState(20000)
    const [selected, setSelected] = useState()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [nativeEvent, setNativeEvent] = useState({})
    const _layout = ({ nativeEvent }) => {
        console.debug(nativeEvent)
        setNativeEvent(nativeEvent)
    }
    const _selectMonth = () => {
        setSelected({ index: 1, name: "BAF" })
        setDropdownVisible(false)
    }
    const data = [{ a: 'Nama Pelanggan', b: 'Albert Stanley' }, { a: 'ID Pelanggan', b: '1234567 ' }]
    const [modal, setModal] = useState(false)
    return <Container header={{
        title: "Kredit",
        image: require('src/assets/icons/phonebook.png'),
        onPressIcon: () => setModal(true),
        onPressBack: () => navigation.goBack(),
    }}>
        <Modal backdropDismiss={() => setModal(false)} visible={modal}>
            <View>
                <Text size={17} align="center">Nomor Pelanggan</Text>
                <SearchInput textInput={{
                    placeholder: 'Cari nomor'
                }} />
                <ScrollView persistentScrollbar style={{ maxHeight: 250, marginTop: 10 }}>
                    {[1, 2, 3, 4, 5, 6]
                        .map((item, i) => [
                            <Button color="link">Albert Stanley - 123456789123456789</Button>,
                            i != 5 && <Divider />
                        ])
                    }
                </ScrollView>
            </View>
        </Modal>
        <View style={styles.topComp}>
            <TouchableOpacity onLayout={_layout} onPress={() => setDropdownVisible(true)}>
                <View style={styles.selectContainer}>
                    <Wrapper justify="space-between" style={styles.selectWrapper}>
                        <Text size={16}>{selected ? selected.name : "Pilih angsuran"}</Text>
                        <Icon color={ColorsList.greyFont} size={15} name="chevron-down" />
                    </Wrapper>
                </View>
            </TouchableOpacity>
            <AwanPopup.Menu noTitle transparent absolute visible={dropdownVisible}
                backdropDismiss={() => setDropdownVisible(false)}
                style={[styles.dropdownStyle, { width: "100%", top: Object.keys(nativeEvent).length > 0 ? nativeEvent.layout.y + nativeEvent.layout.height * 2 + 20 : 80 }]}
                contentStyle={[styles.dropdownContentStyle]}
            >
                {
                    [1, 2].map((item, i) => (
                        <View key={i}>
                            <Button onPress={_selectMonth} wrapper={{ justify: 'flex-start' }} key={i} justify="space-between" color="link">
                                {/* <Text>{i}</Text> */}
                                <Text>Pilihan nya ada berapa makan</Text>
                            </Button>
                            <Divider />
                        </View>
                    ))
                }
            </AwanPopup.Menu>
            <MDInput _width="80%"
                label="No Kontrak"
                value={idPelanggan.toString()}
                onChangeText={text => setVirtualNumber(text)}
            />
            <MDInput _width="80%"
                label="Jumlah pembayaran"
                value={amount.toString()}
                onChangeText={text => setAmount(text)}
            />
        </View>
        <TouchableOpacity style={styles.cekTagihan}>
            <Text color="primary">CEK TAGIHAN</Text>
        </TouchableOpacity>
        <ContainerBody style={{ padding: 0 }}>
            <View style={{ ...$Margin(0, 15), borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
                {data.map((item, i) => [
                    <Wrapper key={i} justify="space-between" style={{ padding: 10 }}>
                        <Text font="Regular">{item.a}</Text>
                        <Text font="Regular">{item.b}</Text>
                    </Wrapper>,
                    i != data.length - 1 && <Divider />
                ])}
            </View>
        </ContainerBody>
        <Bottom>
            <Button width="100%" wrapper={{ justify: 'space-between' }}>
                <Wrapper>
                    <Icon name="shopping-cart" color={ColorsList.whiteColor} />
                    <Text style={{ marginLeft: 5 }} color="white">Belanja 1 Produk</Text>
                </Wrapper>
                <Wrapper _width="40%">
                    <Divider color={ColorsList.whiteColor} height="100%" />
                    <Text color="white">Rp. 2.500</Text>
                </Wrapper>
            </Button>
        </Bottom>
    </Container >
}
export default Kredit