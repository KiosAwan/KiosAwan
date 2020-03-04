import React, { useState } from 'react';
import Container, { ContainerBody } from 'src/components/View/Container';
import styles from './BPJSStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { $Padding, $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import MDInput from 'src/components/Input/MDInput';
import { BottomVertical } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AwanPopup, Modal } from 'src/components/ModalContent/Popups';
import { SizeList } from 'src/styles/size';
import SearchInput from 'src/components/Input/SearchInput';
import SwitchButton from 'src/components/Button/SwitchButton';
import { convertRupiah } from 'src/utils/authhelper';
import { AddPPOBToCart } from 'src/redux/actions/actionsPPOB';
import { checkTagihanBPJS } from 'src/utils/api/ppob/bpjs_api';
import { useDispatch } from 'react-redux';

const BPJS = ({ navigation }) => {
    //Initialize dispatch 
    const dispatch = useDispatch()


    const [tagihanLoading, setTagihanLoading] = useState(false)
    const [tagihanData, setTagihanData] = useState()
    const [detail, setDetail] = useState(false)
    const [virtualNumber, setVirtualNumber] = useState(8888801314742533)
    const [selected, setSelected] = useState()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [nativeEvent, setNativeEvent] = useState({})
    const _layout = ({ nativeEvent }) => {
        setNativeEvent(nativeEvent)
    }
    const _selectMonth = () => {
        setSelected({ index: 1, name: "Januari 2020" })
    }
    const [modal, setModal] = useState(false)

    const _cekTagihan = async () => {
        // if (!selected) {
        //     alert("Harap pilih PDAM")
        // }
        // else {
        setTagihanLoading(true)
        const data = {
            productID: 900001,
            customerID: virtualNumber
        }
        const res = await checkTagihanBPJS(data)
        setTagihanLoading(false)
        if (res.status == 400) {
            alert(res.data.errors.msg)
        } else {
            setTagihanData(res.data)
        }
        // }
    }

    const _onPressSimpan = async () => {
        if (tagihanData) {
            const data = { type: "bpjs", customerID: tagihanData.idPelanggan, productID: 900001, price: tagihanData.total, productName: "BPJS" }
            dispatch(AddPPOBToCart(data))
            navigation.goBack()
        } else {
            alert("Harap cek tagihan terlebih dahulu")
        }
    }
    return <Container header={{
        title: "BPJS Kesehatan",
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
        <View onLayout={_layout} style={styles.topComp}>
            <MDInput _width="80%"
                label="No. Virtual Account"
                value={virtualNumber}
                onChangeText={text => setVirtualNumber(text)}
            />
            {/* <TouchableOpacity onPress={() => setDropdownVisible(true)}>
                <View style={styles.selectContainer}>
                    <Wrapper justify="space-between" style={styles.selectWrapper}>
                        <Text size={16}>{selected ? selected.name : "Pembayaran sampai"}</Text>
                        <Icon color={ColorsList.greyFont} size={15} name="chevron-down" />
                    </Wrapper>
                </View>
            </TouchableOpacity> */}
            <AwanPopup.Menu noTitle transparent absolute visible={dropdownVisible}
                backdropDismiss={() => setDropdownVisible(false)}
                style={[styles.dropdownStyle, { width: "100%", top: Object.keys(nativeEvent).length > 0 ? nativeEvent.layout.y + nativeEvent.layout.height : 200 }]}
                contentStyle={[styles.dropdownContentStyle]}
            >
                {
                    [1, 2].map((item, i) => [
                        <Button onPress={_selectMonth} key={i} width={SizeList.width} wrapper={{ justify: 'flex-start', }} key={i} justify="space-between" color="link">
                            <Text>{i}</Text>
                            <Text>Pilihan nya ada berapa makan</Text>
                        </Button>,
                        <Divider />
                    ])
                }
            </AwanPopup.Menu>
        </View>
        <View style={styles.simpan}>
            <Text>Simpan VA ini untuk masuk ke favorit</Text>
            <SwitchButton
                // handleChangeToggle={_handleChangeToggle}
                toggleValue={true}
            />
        </View>
        {tagihanLoading ? <ActivityIndicator color={ColorsList.primary} />
            :
            tagihanData ?
                <ContainerBody style={{ marginBottom: 120, padding: 0 }}>
                    <View style={{ ...$Margin(0, 15), borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Nama pelanggan</Text>
                            <Text font="Regular">{tagihanData.nama.trim()}</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Jumlah peserta</Text>
                            <Text font="Regular">{tagihanData.peserta} orang</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Periode</Text>
                            <Text font="Regular">{tagihanData.periode} bulan</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Admin</Text>
                            <Text font="Regular">{convertRupiah(tagihanData.adminBank)}</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Jumlah tagihan</Text>
                            <Text font="Regular">{convertRupiah(tagihanData.total)}</Text>
                        </Wrapper>
                        <TouchableOpacity onPress={() => setDetail(!detail)} style={{ padding: 10, alignSelf: "flex-end" }}>
                            <Text color="primary" font="Regular">DETAIL</Text>
                            {/* <Text font="Regular">{convertRupiah(tagihanData.total)}</Text> */}
                        </TouchableOpacity>
                        {detail ? tagihanData.detail.map((item, i) => (
                            <View key={i}>
                                <Wrapper justify="space-between" style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                    <Text font="Regular">{item.nama.trim()}</Text>
                                    <Text font="Regular">{item.noVa.trim()}</Text>
                                </Wrapper>
                                <Divider />
                            </View>
                        )) : null}

                        {/* <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Total Tagihan</Text>
                            <Text font="Regular">{convertRupiah(tagihanData.data.total)}</Text>
                        </Wrapper> */}
                    </View>
                </ContainerBody>
                : null}
        <BottomVertical>
            <Button onPress={_cekTagihan} color="white" width="100%" wrapper={{ justify: 'space-between' }}>
                CEK TAGIHAN
            </Button>
            <Button onPress={_onPressSimpan} width="100%" style={{ marginTop: 5 }} wrapper={{ justify: 'space-between' }}>
                SIMPAN
            </Button>
        </BottomVertical>
    </Container >
}
export default BPJS