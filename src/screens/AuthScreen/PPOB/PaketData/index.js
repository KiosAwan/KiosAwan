import React, { useState } from 'react';
import Container from 'src/components/View/Container';
import styles from './PaketDataStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { $Padding } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import MDInput from 'src/components/Input/MDInput';
import { Bottom } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Modal } from 'src/components/ModalContent/Popups';
import SearchInput from 'src/components/Input/SearchInput';

const PpobPaketData = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState()
    const [selected, setSelected] = useState()
    const _selectPulsa = ({ item, index }) => {
        setSelected(index)
    }
    const [modal, setModal] = useState(false)
    return <Container header={{
            title: "Paket Data",
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
            <Wrapper justify="space-between" style={$Padding(5, 15)}>
                <MDInput _width="80%"
                    label="No. Handphone"
                    value={phoneNumber}
                    onChangeText={text => setPhoneNumber(text)}
                />
                <Image style={{ borderWidth: 1, borderColor: ColorsList.greyAuthHard }} source={require('src/assets/icons/phone.png')} size={50} />
            </Wrapper>
            <Divider />
            <Wrapper justify="space-between">
                <Button _width="49%" color="link" onPress={() => { }}>
                    <Image style={{ marginRight: 5 }} source={require('src/assets/icons/phone.png')} size={15} />
                    <Text>Nomor Saya</Text>
                </Button>
                <Divider height={40} />
                <Button _width="49%" color="link">
                    <Image style={{ marginRight: 5 }} source={require('src/assets/icons/contact.png')} size={15} />
                    <Text>Kontak</Text>
                </Button>
            </Wrapper>
        </View>
        <FlatList style={styles.listPulsa} numColumns={2} keyExtractor={(a, i) => i.toString()}
            showsVerticalScrollIndicator={false}
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            renderItem={({ item, index }) =>
                <TouchableOpacity onPress={() => _selectPulsa({ item, index })} style={[styles.pulsaWrapper, index === selected && styles.pulsaWrapperActive]}>
                    <View style={{ height: 50 }}>
                        <Text color="primary" style={styles.pulsaComp}>{index % 2 == 0 ? "Paket data 420MB 7 Hari Paket data 420MB" : "Paket data 28MB"}</Text>
                    </View>
                    <Divider />
                    <Text size={12} style={styles.pulsaComp}>Harga: Rp. 5.925</Text>
                </TouchableOpacity>
            }
        />
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
    </Container>
}
export default PpobPaketData