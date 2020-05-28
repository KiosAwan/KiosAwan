import React, { useState } from 'react';
import Container, { Body } from 'src/components/View/Container';
import styles from './AsuransiStyles';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { $Padding, $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import MDInput from 'src/components/Input/MDInput';
import { Bottom } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Modal } from 'src/components/ModalContent/Popups';
import SearchInput from 'src/components/Input/SearchInput';
const Asuransi = ({ navigation }) => {
    const [selected, setSelected] = useState()
    const [modal, setModal] = useState(false)
    const _selectMonth = () => {
        setSelected({ index: 1, name: "Gopay" })
        setDropdownVisible(false)
    }
    const _selectProduct = args => {
        navigation.navigate('/ppob/asuransi/tipus')
    }
    const data = [{ a: 'Nama Pelanggan', b: 'Albert Stanley' }, { a: 'ID Pelanggan', b: '1234567 ' }]

    return <Container header={{
        title: "Asuransi",
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
                        .rMap((item, i) => [
                            <Button color="link">Albert Stanley - 123456789123456789</Button>,
                            i != 5 && <Divider />
                        ])
                    }
                </ScrollView>
            </View>
        </Modal>
        <Body style={{ padding: 0 }}>
            <FlatList style={styles.listPulsa} numColumns={2} keyExtractor={(a, i) => i.toString()}
                showsVerticalScrollIndicator={false}
                data={[1, 2, 3, 4, 5, 6]}
                renderItem={({ item, index }) =>
                    <TouchableOpacity onPress={() => _selectProduct({ item, index })} style={[styles.pulsaWrapper, index === selected && styles.pulsaWrapperActive]}>
                        <Image size={50} source={require('src/assets/payment/gopay.png')} />
                        <Divider />
                        <Text style={styles.pulsaComp}>Tipus</Text>
                    </TouchableOpacity>
                }
            />
        </Body>
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
export default Asuransi