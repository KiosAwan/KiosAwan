import React, { useEffect, useState } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { ColorsList } from 'src/styles/colors';
import { View, Image, StyleSheet, Clipboard, ActivityIndicator } from 'react-native';
import { Wrapper } from 'src/components/View/Wrapper';
import { $Border, $BorderRadius } from 'src/utils/stylehelper';
import Divider from 'src/components/Row/Divider';
import { convertRupiah, getUserToken } from 'src/utils/authhelper';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import Screenshot from 'src/utils/screenshot';
import { CopyButton } from 'src/components/Button/CopyButton';
import { Toast } from 'native-base';
import { GlobalHeader } from 'src/components/Header/Header';
import { getDetailPPOBTransaction } from 'src/utils/api/setupharga';
import { SizeList } from 'src/styles/size';

const TransactionDigitalDetail = ({ navigation }) => {
    let viewShotRef;
    const dispatch = useDispatch()
    const User = useSelector(state => state.User)
    const [params, setParams] = useState({
        details: null,
        payment: null,
        transaction: null
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (navigation.state.params.param) {
            _effect(navigation.state.params.param)
        }
    }, [])

    const _effect = async (id) => {

        const res = await getDetailPPOBTransaction(id)
        if (res.status == 200) {
            setParams(res.data)
        }
        setLoading(false)
    }
    const wrapper = {
        justify: 'space-between',
        style: { padding: 10 }
    }
    const { details, payment, transaction } = params

    const _checkData = (key, isCondition) => {
        let data = transaction ? transaction[key] : ''
        return isCondition ? Boolean(data) : data
    }

    const _shareBill = async () => {
        let imgPath = await Screenshot.take(viewShotRef)
        Screenshot.share({ url: imgPath })
    }

    const _renderProductDigital = item => {
        let filterPayment = ["id", "product_code", "supplier", "status", "token", "id_transaction", "payment_code", "customerID", "referenceID", "productID", "updated_at", "info"]
        let viewKey = key => {
            let keys = { ppn: "PPN", ppj: "PPJ", created_at: "Tanggal transaksi", adminBank: "Admin Bank", jmlTagihan: "Jumlah tagihan", referenceID: "ReferenceID", noReferensi: "No Referensi" }
            return keys[key] || key.split('_').join(' ').ucwords()
        }
        return <View>
            {
                (payment ? Object.keys(payment).filter(a => !filterPayment.includes(a)) : [])
                    .rMap(
                        item => {
                            // if (item == 'periode') {
                            //     console.debug(payment[item])
                            // }
                            return item != 'description' ? <View>
                                <Wrapper spaceBetween style={{ padding: 10 }}>
                                    <Text>{viewKey(item)}</Text>
                                    <Text align="right" _width="49%">{![
                                        'total',
                                        'admin',
                                        'ppj',
                                        'ppn',
                                        'angsuran',
                                        'tagihan',
                                        'adminBank',
                                        'denda',
                                        'stroom_token',
                                        'pembelian_token',
                                        'materai'
                                    ].includes(item) ? payment[item].trim() : payment[item].convertRupiah()}</Text>
                                </Wrapper>
                                {/* <Divider /> */}
                            </View> : <Button style={{ borderRadius: SizeList.borderRadius }} color="info" hideIfEmpty disabled><Text color="informationFont" align="center">{payment[item].split(';')[0]}</Text></Button>
                        })
            }
        </View>
    }
    const _renderPendingProductDigital = () => {
        let filterPayment = ["id", "updated_at", "status", "margin", "cash_back", "productID", "customerID", "customer_name", "id_multi_transaction", "admin_original", "id_user", "admin", "total_original", "status", "productID", "transaction_name", "date", "id_transaction", "info", "date", "supplier", "product_code", "trx_id", "transaction_code", "status_rekon"]
        let viewKey = key => {
            let keys = { ppn: "PPN", ppj: "PPJ", created_at: "Tanggal transaksi", adminBank: "Admin Bank", jmlTagihan: "Jumlah tagihan", referenceID: "ReferenceID", noReferensi: "No Referensi" }
            return keys[key] || key.split('_').join(' ').ucwords()
        }
        return <View>
            {
                (transaction ? Object.keys(transaction).filter(a => !filterPayment.includes(a)) : [])
                    .rMap(item => <View>
                        <Wrapper spaceBetween style={{ padding: 10 }}>
                            <Text>{viewKey(item)}</Text>
                            <Text align="right" _width="49%">{
                                !['total',
                                    'admin',
                                    'tarif',
                                    'ppj',
                                    'ppn',
                                    'angsuran',
                                    'tagihan',
                                    'adminBank',
                                    "denda"
                                ].includes(item) ? transaction[item] && transaction[item].trim() :
                                    parseInt(transaction[item]).convertRupiah()}</Text>
                        </Wrapper>
                    </View>
                    )
            }
        </View>
    }
    return <Container>
        <GlobalHeader title="Struk Pulsa dan Tagihan" onPressBack={() => navigation.goBack()} />
        {loading ? <ActivityIndicator /> :
            <Body>
                <ViewShot style={{ backgroundColor: ColorsList.authBackground }} ref={ref => viewShotRef = ref}>
                    {
                        _checkData('status') === 'PENDING' ?
                            <Button style={{ borderRadius: SizeList.borderRadius }} disabled color="warning" wrapper={{ justify: 'flex-start' }}>
                                <Icon color={ColorsList.whiteColor} name="exclamation-circle" />
                                <Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi sedang diproses!</Text>
                            </Button>
                            :
                            _checkData('status') === 'FAILED' ?
                                <Button style={{ borderRadius: SizeList.borderRadius }} disabled color="warning" wrapper={{ justify: 'flex-start' }}>
                                    <Icon color={ColorsList.whiteColor} name="exclamation-circle" />
                                    <Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi gagal!</Text>
                                </Button>
                                :
                                <Button style={{ borderRadius: SizeList.borderRadius }} disabled color="success" wrapper={{ justify: 'flex-start' }}>
                                    <Icon color={ColorsList.whiteColor} name="exclamation-circle" />
                                    <Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi berhasil!</Text>
                                </Button>
                    }
                    <View style={{ backgroundColor: ColorsList.whiteColor, borderRadius: SizeList.borderRadius, marginTop: SizeList.base, padding: SizeList.padding }}>
                        <View style={{ marginVertical: SizeList.base }}>
                            <Text align="center" size={16} font="SemiBold">
                                {User.store.name_store}
                            </Text>
                            <View style={{ ...$BorderRadius(5, 5, 0, 0), marginTop: 10, backgroundColor: ColorsList.whiteColor, padding: 10 }}>
                                <Wrapper spaceBetween>
                                    <Text>Kode Transaksi</Text>
                                    <Text>{transaction && transaction.transaction_code}</Text>
                                </Wrapper>
                                <Wrapper spaceBetween>
                                    <Text>Waktu dan Tanggal</Text>
                                    <Text>{transaction && transaction.created_at.slice(0, 16)}</Text>
                                </Wrapper>
                                <Wrapper spaceBetween>
                                    <Text>Operator</Text>
                                    <Text>{User.data.name}</Text>
                                </Wrapper>
                            </View>
                        </View>
                        <Divider />
                        <View style={{ backgroundColor: ColorsList.whiteColor, }}>
                            <Wrapper {...wrapper}>
                                <View>
                                    <Text color="primary" size={16}>{_checkData('transaction_name').split('_').join(' ').toUpperCase()}</Text>
                                    <Text>{_checkData('customerID')}</Text>
                                </View>
                                {
                                    transaction && transaction.tagihan == 0 ?
                                        <View /> :
                                        <Text>{convertRupiah(parseInt(_checkData('total')))}</Text>
                                }
                            </Wrapper>
                            {transaction && transaction.transaction_name == "pln_prepaid" && payment && payment.token && [
                                <View>
                                    <Wrapper style={{ paddingVertical: SizeList.base }} justify="space-between">
                                        <Text style={{ paddingLeft: 10 }}>{payment.token.match(/.{1,4}/g).join("-")}</Text>
                                        <CopyButton onPress={() => {
                                            Toast.show({ text: "Berhasil disalin", type: "success" })
                                            Clipboard.setString(payment.token)
                                        }} />
                                    </Wrapper>
                                </View>
                            ]}
                            <Divider />
                            {payment ? _renderProductDigital() : _renderPendingProductDigital()}
                            <Divider />
                            <View style={{ alignItems: 'center', flexDirection: "row", justifyContent: "center" }}>
                                <Text size={12} align="center">Powered by</Text>
                                <Image style={{ width: 100, height: 70, resizeMode: "contain" }} source={require('src/assets/images/logostruk.png')} />
                            </View>
                        </View>
                    </View>
                </ViewShot>
            </Body>
        }
        {!loading && <Footer>
            <Wrapper justify="space-between">
                <Button color="white" _width="49%" onPress={_shareBill}>
                    <Image _style={{ marginRight: 10 }} style={{ height: 18, width: 18 }} source={require('src/assets/icons/share-primary.png')} />
                    <Text color="primary" style={styles.btnwithIconText}>KIRIM STRUK</Text>
                </Button>
                <Button color="white" _width="49%" onPress={() => navigation.navigate('/drawer/transaction/cetakstruk', { singleData: params, type: false })}>
                    <Image _style={{ marginRight: 10 }} style={{ height: 18, width: 18 }} source={require('src/assets/icons/print-primary.png')} />
                    <Text color="primary" style={styles.btnwithIconText}>CETAK STRUK</Text>
                </Button>
            </Wrapper>
        </Footer>}
    </Container >
}
export default TransactionDigitalDetail

const styles = StyleSheet.create({
    token: {
        borderWidth: 1,
        padding: 5,
        marginHorizontal: 10,
        marginBottom: 10,
        borderColor: ColorsList.primary,
        borderRadius: 5
    }
})