import React, { useState } from 'react';
import Container, { Body } from 'src/components/View/Container';
import styles from './BPJSStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { $Padding, $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import MDInput from 'src/components/Input/MDInput';
import { BottomVertical } from 'src/components/View/Bottom';
import { AwanPopup, Modal } from 'src/components/ModalContent/Popups';
import SearchInput from 'src/components/Input/SearchInput';
import SwitchButton from 'src/components/Button/SwitchButton';
import { convertRupiah, verifyUserPIN } from 'src/utils/authhelper';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import { checkTagihanBPJS, payTagihanBPJS } from 'src/utils/api/ppob/bpjs_api';
import { useDispatch, useSelector } from 'react-redux';
import GlobalEnterPin from '../../GlobalEnterPin';
import { getProfile } from 'src/redux/actions/actionsUserData';

const BPJS = ({ navigation }) => {
    //Initialize dispatch 
    const dispatch = useDispatch()
    // Reducer for product data
    const Product = useSelector(state => state.Product)
    //Reducer User data
    const User = useSelector(state => state.User)

    const [tagihanLoading, setTagihanLoading] = useState(false)
    const [tagihanData, setTagihanData] = useState()
    const [detail, setDetail] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("081232131")
    const [virtualNumber, setVirtualNumber] = useState(8888801314742533)
    const [modal, setModal] = useState(false)

    // alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState()

    // PIN Modal state 
    const [pinVisible, setPinVisible] = useState(false)

    // Loading pay state
    const [payLoading, setPayLoading] = useState(false)
    const _cekTagihan = async () => {
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
    }

    // Set pin modal visible when user clicked pay button
    const _onPressBayar = () => {
        // If response not equal to undefined 
        if (tagihanData) {
            if (!phoneNumber) {
                setAlertMessage("Harap masukkan nomer telepon pelanggan")
                setAlert(true)
            } else {
                setPinVisible(true)
            }
        } else {
            setAlertMessage("Harap masukkan nomer virtual yang benar")
            setAlert(true)
        }
    }

    // Check user pin 
    const _userAuthentication = async (pin) => {
        const data = {
            pin,
            phone_number: User.data.phone_number
        }
        const res = await verifyUserPIN(data)
        if (res.status == 200) {
            setPinVisible(false)
            _processPayment()
        }
        else if (res.status == 400) {
            setAlertMessage(res.data.errors.msg)
            setAlert(true)
        }
    }

    const _processPayment = async () => {
        setPayLoading(true)
        const data = {
            customerID: tagihanData.transaction.customerID,
            productID: tagihanData.transaction.productID,
            noHanphone: phoneNumber,
            id_multi: Product.id_multi
        }
        const res = await payTagihanBPJS(data)
        setPayLoading(false)
        if (res.status == 200) {
            const data = { type: "bpjs", customerID: res.data.transaction.customerID, price: parseInt(res.data.transaction.total), productName: "BPJS" }
            dispatch(AddPPOBToCart(data))
            dispatch(getProfile(User.data.id))
            dispatch(SetIdMultiCart(res.data.transaction.id_multi_transaction))
            navigation.navigate("/ppob/status", { params: res.data })
        } else if (res.status == 400) {
            setAlertMessage(res.data.errors.msg.trim())
            setAlert(true)
        } else {
            console.debug(res)
        }
    }
    return <Container header={{
        title: "BPJS Kesehatan",
        // image: require('src/assets/icons/phonebook.png'),
        // onPressIcon: () => setModal(true),
        onPressBack: () => navigation.goBack(),
    }}>
        {/* Modal for check user pin */}
        <GlobalEnterPin
            title="Masukkan PIN"
            codeLength={4}
            subtitle="Masukkan PIN untuk melanjutkan transaksi"
            visible={pinVisible}
            visibleToggle={setPinVisible}
            pinResolve={(pin) => _userAuthentication(pin)} />
        {/* Modal for check user pin */}
        {/* Popup components */}
        <AwanPopup.Alert
            message={alertMessage}
            visible={alert}
            closeAlert={() => setAlert(false)}
        />
        <AwanPopup.Loading visible={payLoading} />
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
            <MDInput _width="80%"
                label="No. Virtual Account"
                value={virtualNumber}
                onChangeText={text => setVirtualNumber(text)}
            />
            <MDInput _width="80%"
                label="No. Handphone"
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
            />
        </View>
        {/* <View style={styles.simpan}>
            <Text>Simpan VA ini untuk masuk ke favorit</Text>
            <SwitchButton
                // handleChangeToggle={_handleChangeToggle}
                toggleValue={true}
            />
        </View> */}
        {tagihanLoading ? <ActivityIndicator color={ColorsList.primary} />
            :
            tagihanData ?
                <Body style={{ marginBottom: 120, padding: 0 }}>
                    <View style={{ ...$Margin(0, 15), borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Nama pelanggan</Text>
                            <Text font="Regular">{tagihanData.transaction.nama.trim()}</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Jumlah peserta</Text>
                            <Text font="Regular">{tagihanData.transaction.peserta} orang</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Periode</Text>
                            <Text font="Regular">{tagihanData.transaction.periode} bulan</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Admin</Text>
                            <Text font="Regular">{convertRupiah(tagihanData.transaction.adminBank)}</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Jumlah tagihan</Text>
                            <Text font="Regular">{convertRupiah(tagihanData.transaction.total)}</Text>
                        </Wrapper>
                        <TouchableOpacity onPress={() => setDetail(!detail)} style={{ padding: 10, alignSelf: "flex-end" }}>
                            <Text color="primary" font="Regular">DETAIL</Text>
                        </TouchableOpacity>
                        {detail ? tagihanData.details.map((item, i) => (
                            <View key={i}>
                                <Wrapper justify="space-between" style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                    <Text font="Regular">{item.nama.trim()}</Text>
                                    <Text font="Regular">{item.noVa.trim()}</Text>
                                </Wrapper>
                                <Divider />
                            </View>
                        )) : null}
                    </View>
                </Body>
                : null}
        <BottomVertical>
            <Button onPress={_cekTagihan} color="white" width="100%" wrapper={{ justify: 'space-between' }}>
                CEK TAGIHAN
            </Button>
            <Button onPress={_onPressBayar} width="100%" style={{ marginTop: 5 }} wrapper={{ justify: 'space-between' }}>
                BAYAR
            </Button>
        </BottomVertical>
    </Container >
}
export default BPJS