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
import SearchInput, { SearchInputV2 } from 'src/components/Input/SearchInput';
import { TextInput } from 'src/components/Input/MDInput';

const RingkasanHutang = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const DataTransaksi = useSelector(state => state.Transaction)
    const [reportHutang, setReportHutang] = useState({})
    const [search, setSearch] = useState('')
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
                        <SearchInputV2
                            placeholder="Cari transaksi"
                            onFocus={() => setSearchIconColor(ColorsList.primary)}
                            onBlur={() => setSearchIconColor(ColorsList.greyFont)}
                            value={search}
                            onChangeText={text => setSearch(text)}
                        />
                        <Text style={{ marginVertical: 10 }}>Ringkasan Hutang</Text>
                        <View style={{ backgroundColor: "white", borderWidth: SizeList.borderWidth, borderColor: ColorsList.borderColor, borderRadius: 5, padding: SizeList.padding }}>
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
                        <FlatList
                            data={DataTransaksi.data}
                            renderItem={({ item }) => [
                                filterResult(item.data).length > 0 ?
                                    <View style={{ marginTop: 10 }}>
                                        <Wrapper justify="space-between">
                                            <Text>{moment(item.date).format('ddd, DD MMM YYYY')}</Text>
                                        </Wrapper>
                                    </View> : null,
                                filterResult(item.data).rMap(trx => {
                                    return <TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/detail', { transactionId: trx.id_transaction })}>
                                        <Wrapper shadow style={{ marginTop: SizeList.base, paddingHorizontal: SizeList.padding, paddingVertical: 15, backgroundColor: ColorsList.white }} justify="space-between">
                                            <Wrapper _width="58%" style={{ alignSelf: "flex-start" }}>
                                                <View>
                                                    <Text font="SemiBold">{trx.payment_code}</Text>
                                                    <Text>{trx.name_customer ? trx.name_customer : 'Tidak ada Pelanggan'}</Text>
                                                </View>
                                            </Wrapper>
                                            <View _style={{ width: '40%', }}>
                                                <Text align="right" color="warning" font="SemiBold" size={15}>LUNASI</Text>
                                                <Text align="right">{convertRupiah(trx.total_transaction)}</Text>
                                            </View>
                                        </Wrapper>
                                    </TouchableOpacity>
                                })
                            ]}
                            keyExtractor={(it, id) => id.toString()}
                        />
                    </View>
                }
            </Body>
        </Container >
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
    wrapper: { backgroundColor: ColorsList.whiteColor, marginBottom: 5 }
})