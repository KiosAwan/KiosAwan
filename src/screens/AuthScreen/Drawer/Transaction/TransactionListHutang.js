import React, { Component, useState, useEffect } from 'react';
import { View, Image, ScrollView, RefreshControl, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { getReportHutang, convertRupiah } from 'src/utils/authhelper';
import { useSelector } from 'react-redux';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { ColorsList } from 'src/styles/colors';
import Container, { Body } from 'src/components/View/Container';
import moment from 'moment';
import { SizeList } from 'src/styles/size';

const RingkasanHutang = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const DataTransaksi = useSelector(state => state.Transaction)
    const [reportHutang, setReportHutang] = useState({})

    useEffect(() => {
        _effect()
    }, [])
    const _effect = async () => {
        _reportHutang()
    }

    const _reportHutang = async () => {
        const res = await getReportHutang(User.store.id_store)
        setReportHutang(res.data)
    }
    const filterResult = (data) => {
        return data ? data
            .filter(item => item.status_payment.includes('2'))
            : []
    }
    return (
        <Container header={{ title: "Daftar Hutang", onPressBack: () => navigation.goBack() }}>
            <Body refreshControl={<RefreshControl onRefresh={_reportHutang} />}>
                {!reportHutang ?
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Image style={{ width: 250, height: 250, marginTop: 50 }} source={require('src/assets/images/no-transaction.png')} />
                        <View style={{ alignItems: 'center', width: '75%' }}>
                            <Text font="SemiBold" size={17}>Anda belum memiliki piutang!</Text>
                            <Text align="center">Silahkan melalukan transaksi baru untuk mengisi laporan.</Text>
                        </View>
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginBottom: 10 }}>Ringkasan Hutang</Text>
                        <View style={{ backgroundColor: "white", elevation: 1, borderRadius: 5, padding: 5 }}>
                            <Wrapper style={styles.wrapper} justify="space-between">
                                <Text>Jumlah Transaksi Hutang</Text>
                                <Text font="SemiBold">{convertRupiah(reportHutang.jumlah_hutang)}</Text>
                            </Wrapper>
                            <Wrapper style={styles.wrapper} justify="space-between">
                                <Text>Jumlah Pelanggan</Text>
                                <Text font="SemiBold">{reportHutang.jumlah_pelanggan}</Text>
                            </Wrapper>
                            <Wrapper style={styles.wrapper} justify="space-between">
                                <Text>Transaksi Jatuh Tempo</Text>
                                <Text font="SemiBold">{reportHutang.trx_jatuh_tempo}</Text>
                            </Wrapper>
                            <Wrapper style={styles.wrapper} justify="space-between">
                                <Text>Transaksi Belum Lunas</Text>
                                <Text font="SemiBold">{reportHutang.trx_belum_lunas}</Text>
                            </Wrapper>
                        </View>

                        <Text style={{ marginVertical: 10 }}>List Hutang</Text>
                        <FlatList
                            data={DataTransaksi.data}
                            renderItem={({ item }) => {
                                return filterResult(item.data).rMap(trx => {
                                    return <TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/detail', { transactionId: trx.id_transaction })}>
                                        <Wrapper shadow style={{ marginTop: SizeList.base, paddingHorizontal: 5, paddingVertical: 15, backgroundColor: ColorsList.white }} justify="space-between">
                                            <Wrapper _width="50%" style={{alignSelf : "flex-start", paddingHorizontal : 5}}>
                                                <View>
                                                    <Text font="SemiBold">{trx.payment_code}</Text>
                                                    <Text>{trx.name_customer ? trx.name_customer : 'Tidak ada Pelanggan'}</Text>
                                                </View>
                                            </Wrapper>
                                            <View _style={{ width: '30%' }}>
                                                <Text color="primary">{convertRupiah(trx.total_transaction)}</Text>
                                            </View>
                                            <Text color="success" font="SemiBold" size={15}>LUNASI</Text>
                                        </Wrapper>
                                    </TouchableOpacity>
                                })
                            }}
                            keyExtractor={(it, id) => id.toString()}
                        />
                    </View>
                }
            </Body>
            <Bottom>
                <Button onPress={() => navigation.navigate('/drawer/transaction/hutang')} width='100%'>LIHAT DAFTAR HUTANG</Button>
            </Bottom>
        </Container>
    )
}

export default RingkasanHutang


const styles = StyleSheet.create({
    containerEmptyData: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    containerWithData: {
        flex: 1
    },
    wrapper: { padding: 5, backgroundColor: ColorsList.whiteColor, marginBottom: 5 }
})