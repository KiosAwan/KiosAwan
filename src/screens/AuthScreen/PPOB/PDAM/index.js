import React, { useState, useEffect } from 'react';
import Container, { ContainerBody } from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import styles from './PDAMStyles'
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { $Padding, $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import MDInput from 'src/components/Input/MDInput';
import { Bottom } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AwanPopup, Modal } from 'src/components/ModalContent/Popups';
import { SizeList } from 'src/styles/size';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { FloatingInput } from 'src/components/Input/InputComp';
import { getPDAMProductList, checkTagihan } from 'src/utils/api/ppob/pdam_api';
import { convertRupiah } from 'src/utils/authhelper';
import { useDispatch } from 'react-redux';
import { AddPPOBToCart } from 'src/redux/actions/actionsPPOB';
import SearchInput from 'src/components/Input/SearchInput';

const PDAM = ({ navigation }) => {
    const dispatch = useDispatch()

    const [idPelanggan, setIdPelanggan] = useState('000790922')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState({ name: "pdam palyja test", code: 400441 })
    const [productData, setProductData] = useState([])

    const [tagihanData, setTagihanData] = useState()

    useEffect(() => {
        _getProductList()
    }, [[]])

    const _getProductList = async () => {
        const res = await getPDAMProductList()
        setProductData(res.data)
    }

    const _cekTagihan = async () => {
        if (!selected) {
            alert("Harap pilih PDAM")
        }
        else {
            const data = {
                productID: selected.code,
                customerID: idPelanggan
            }
            const res = await checkTagihan(data)
            if (res.status == 400) {
                alert(res.data.errors.msg)
            } else {
                setTagihanData(res.data)
            }
        }
    }

    const _onPressSimpan = async () => {
        if (tagihanData) {
            const data = { customerID: tagihanData.customerID, productID: tagihanData.productID, price: tagihanData.data.total, productName: selected.name }
            dispatch(AddPPOBToCart(data))
            navigation.goBack()
        } else {
            alert("Harap cek tagihan terlebih dahulu")
        }
    }
    const [modal, setModal] = useState(false)
    return <Container header={{
        title: "PDAM",
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
            <SelectBoxModal style={{ marginTop: 15 }}
                label="Pilih PDAM" closeOnSelect
                data={productData ? productData.filter(item => item.name.toLowerCase().includes(search.toLowerCase())) : []}
                header={
                    <View>
                        <FloatingInput left="10%" label="Cari PDAM">
                            <Icon _width='10%' style={{ color: ColorsList.primary }} name="search" />
                            <TextInput _width='90%' value={search} onChangeText={text => setSearch(text)} />
                        </FloatingInput>
                        <Divider />
                    </View>
                }
                value={selected ? selected.name : null}
                handleChangePicker={(item) => setSelected(item)}
                renderItem={(item) => (<Text>{item.name}</Text>)}>
                <Text>Data tidak ditemukan</Text>
            </SelectBoxModal>
            <MDInput _width="80%"
                label="No Pelanggan"
                value={idPelanggan.toString()}
                onChangeText={text => setIdPelanggan(text)}
            />
        </View>
        <TouchableOpacity style={styles.cekTagihan}>
            <Text color="primary" onPress={_cekTagihan}>CEK TAGIHAN</Text>
        </TouchableOpacity>
        {tagihanData ?
            <ContainerBody style={{ padding: 0 }}>
                <View style={{ ...$Margin(0, 15), borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
                    <Wrapper justify="space-between" style={{ padding: 10 }}>
                        <Text font="Regular">Nama Pelanggan</Text>
                        <Text font="Regular">{tagihanData.data.nama}</Text>
                    </Wrapper>
                    <Divider />
                    <Wrapper justify="space-between" style={{ padding: 10 }}>
                        <Text font="Regular">Id Pelanggan</Text>
                        <Text font="Regular">{tagihanData.customerID}</Text>
                    </Wrapper>
                    <Divider />
                    <Wrapper justify="space-between" style={{ padding: 10 }}>
                        <Text font="Regular">Jumlah Tagihan</Text>
                        <Text font="Regular">{convertRupiah(tagihanData.data.tagihan)}</Text>
                    </Wrapper>
                    <Divider />
                    <Wrapper justify="space-between" style={{ padding: 10 }}>
                        <Text font="Regular">Denda</Text>
                        <Text font="Regular">{convertRupiah(tagihanData.data.denda)}</Text>
                    </Wrapper>
                    <Divider />
                    <Wrapper justify="space-between" style={{ padding: 10 }}>
                        <Text font="Regular">Admin</Text>
                        <Text font="Regular">{convertRupiah(tagihanData.data.admin)}</Text>
                    </Wrapper>
                    <Divider />
                    <Wrapper justify="space-between" style={{ padding: 10 }}>
                        <Text font="Regular">Total Tagihan</Text>
                        <Text font="Regular">{convertRupiah(tagihanData.data.total)}</Text>
                    </Wrapper>
                </View>
            </ContainerBody>
            : null}
        <Bottom>
            <Button onPress={_onPressSimpan} width="100%" wrapper={{ justify: 'space-between' }}>
                SIMPAN
            </Button>
        </Bottom>
    </Container >
}
export default PDAM