import React, { useState, useEffect } from 'react';
import Container, { Body } from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import styles from './PDAMStyles'
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { $Padding, $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import MDInput from 'src/components/Input/MDInput';
import { Bottom, BottomVertical } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AwanPopup, Modal } from 'src/components/ModalContent/Popups';
import { SizeList } from 'src/styles/size';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { FloatingInput } from 'src/components/Input/InputComp';
import { getPDAMProductList, checkTagihanPDAM, payTagihanPDAM } from 'src/utils/api/ppob/pdam_api';
import { convertRupiah, verifyUserPIN } from 'src/utils/authhelper';
import { useDispatch, useSelector } from 'react-redux';
import { AddPPOBToCart, SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import SearchInput from 'src/components/Input/SearchInput';
import SwitchButton from 'src/components/Button/SwitchButton';
import GlobalEnterPin from '../../GlobalEnterPin';

const PDAM = ({ navigation }) => {
    const dispatch = useDispatch()
    //Reducer for product data
    const Product = useSelector(state => state.Product)
    //User data
    const User = useSelector(state => state.User)

    const [modal, setModal] = useState(false)
    const [idPelanggan, setIdPelanggan] = useState('01008488')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState({ name: "PDAM Kota Semarang", code: 400371 })

    //PDAM Product data list state
    const [productData, setProductData] = useState([])

    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState()

    //Tagihan state
    const [tagihanLoading, setTagihanLoading] = useState(false)
    const [tagihanData, setTagihanData] = useState()

    //PIN Modal state 
    const [pinVisible, setPinVisible] = useState(false)

    //Loading pay state
    const [payLoading, setPayLoading] = useState(false)
    useEffect(() => {
        _getProductList()
    }, [[]])

    //Function for getting pdam product list
    const _getProductList = async () => {
        const res = await getPDAMProductList()
        setProductData(res.data)
    }

    //Function when user clicked check tagihan button
    const _cekTagihan = async (selected, idPelanggan) => {
        if (!selected) {
            alert("Harap pilih PDAM")
        }
        else {
            setTagihanLoading(true)
            const data = {
                productID: selected.code,
                customerID: idPelanggan
            }
            const res = await checkTagihanPDAM(data)
            setTagihanLoading(false)
            if (res.status == 400) {
                setAlertMessage("Data tidak ditemukan")
                setAlert(true)
            } else {
                setTagihanData(res.data)
            }
        }
    }

    //Set pin modal visible when user clicked pay button
    const _onPressBayar = () => {
        if (tagihanData) {
            setPinVisible(true)
        } else {
            setAlertMessage("Harap cek tagihan terlebih dahulu")
            setAlert(true)
        }
    }

    //Check user pin 
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
            id_multi: Product.id_multi
        }
        const res = await payTagihanPDAM(data)
        setPayLoading(false)
        if (res.status == 200) {
            const data = { type: "pdam", customerID: res.data.payment.customerID, price: parseInt(res.data.transaction.total), productName: selected.name }
            dispatch(AddPPOBToCart(data))
            dispatch(SetIdMultiCart(res.data.transaction.id_multi_transaction))
            navigation.navigate("/ppob/status", { params: res.data })
        } else if (res.status == 400) {
            setAlertMessage(res.data.errors.msg.trim())
            setAlert(true)
        } else {
            console.debug(res)
        }
    }

    const testJsonData = require('src/assets/json/test-pdam.json')
    const [testSelected, setTestSelected] = useState({})
    return <Container header={{
        title: "PDAM",
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
        {/* Popup components */}
        {/* <SelectBoxModal style={{ marginTop: 15 }}
            label="Pilih PDAM" closeOnSelect
            data={testJsonData}
            value={testSelected ? testSelected.id_pelanggan : ""}
            handleChangePicker={(item) => {
                setTestSelected(item)
                _cekTagihan({ code: item.code }, item.id_pelanggan)
            }}
            renderItem={(item) => (<Text color={testSelected.id_pelanggan == item.id_pelanggan && 'primary'}>{item.id_pelanggan}</Text>)}>
            <Text>Data tidak ditemukan</Text>
        </SelectBoxModal> */}
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
                value={selected ? selected.name : ""}
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
                <Body style={{ padding: 0 }}>
                    <View style={{ ...$Margin(0, 15), borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Nama Pelanggan</Text>
                            <Text font="Regular">{tagihanData.transaction.nama}</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Id Pelanggan</Text>
                            <Text font="Regular">{tagihanData.transaction.customerID}</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Jumlah Tagihan</Text>
                            <Text font="Regular">{convertRupiah(tagihanData.transaction.tagihan)}</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Denda</Text>
                            <Text font="Regular">{convertRupiah(tagihanData.transaction.denda)}</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Admin</Text>
                            <Text font="Regular">{convertRupiah(tagihanData.transaction.admin)}</Text>
                        </Wrapper>
                        <Divider />
                        <Wrapper justify="space-between" style={{ padding: 10 }}>
                            <Text font="Regular">Total Tagihan</Text>
                            <Text font="Regular">{convertRupiah(tagihanData.transaction.total)}</Text>
                        </Wrapper>
                    </View>
                </Body>
                : null}
        <BottomVertical>
            <Button onPress={() => _cekTagihan(selected, idPelanggan)} color="white" width="100%">
                CEK TAGIHAN
            </Button>
            <Button style={{ marginTop: 5 }} onPress={_onPressBayar} width="100%">
                BAYAR
            </Button>
        </BottomVertical>
    </Container >
}
export default PDAM