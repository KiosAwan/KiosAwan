import React, { Component, useState, useEffect } from 'react';
import { View, Image, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { getReportHutang, convertRupiah } from 'src/utils/authhelper';
import { useSelector } from 'react-redux';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { ColorsList } from 'src/styles/colors';
import Container, { Body } from 'src/components/View/Container';

const RingkasanHutang = ({ navigation }) => {
    const User = useSelector(state => state.User)
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
    return (
        <Container header={{ title: "Daftar Hutang", onPressBack: () => navigation.goBack() }}>
            <Body refreshControl={<RefreshControl onRefresh={_reportHutang} />}>
                {!reportHutang ?
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Image style={{ width: 250, height: 250, marginTop: 50 }} source={require('src/assets/images/no-transaction.png')} />
                        <View style={{ alignItems: 'center', width: '75%' }}>
                            <Text font="ExtraBold" size={17}>Anda belum memiliki piutang!</Text>
                            <Text align="center">Silahkan melalukan transaksi baru untuk mengisi laporan.</Text>
                        </View>
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <Wrapper style={styles.wrapper} justify="space-between">
                            <Text>Jumlah Transaksi Hutang</Text>
                            <Text font="ExtraBold" color="primary">{convertRupiah(reportHutang.jumlah_hutang)}</Text>
                        </Wrapper>
                        <Wrapper style={styles.wrapper} justify="space-between">
                            <Text>Jumlah Pelanggan</Text>
                            <Text font="ExtraBold" color="primary">{reportHutang.jumlah_pelanggan}</Text>
                        </Wrapper>
                        <Wrapper style={styles.wrapper} justify="space-between">
                            <Text>Transaksi Jatuh Tempo</Text>
                            <Text font="ExtraBold" color="primary">{reportHutang.trx_jatuh_tempo}</Text>
                        </Wrapper>
                        <Wrapper style={styles.wrapper} justify="space-between">
                            <Text>Transaksi Belum Lunas</Text>
                            <Text font="ExtraBold" color="primary">{reportHutang.trx_belum_lunas}</Text>
                        </Wrapper>
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
    wrapper: { padding: 15, backgroundColor: ColorsList.whiteColor, marginBottom: 5 }
})