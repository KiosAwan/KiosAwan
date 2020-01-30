import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { getRiwayatTransaksi } from 'src/redux/actions/actionsRiwayatTransaksi';
import { getUserToken, getUserId } from 'src/utils/authhelper';
import { Text } from 'src/components/Text/CustomText';
import { ColorsList } from 'src/styles/colors';
import moment from 'moment';

const RiwayatTransaksi = ({ navigation }) => {
    const dispatch = useDispatch()
    const RiwayatTransaksi = useSelector(state => state.RiwayatTransaksi)

    useEffect(() => {
        _getRiwayat()
    }, [])

    const _getRiwayat = async () => {
        const userToken = await getUserToken()
        const userId = await getUserId()
        await dispatch(getRiwayatTransaksi(userToken, userId))
    }
    return (
        RiwayatTransaksi.isLoading ? <Text>Loading</Text>
            :
            <View style={{ flex: 1 }}>
                <GlobalHeader title="Riwayat Transaksi" onPressBack={() => navigation.goBack()} />
                <FlatList
                    data={RiwayatTransaksi.data}
                    renderItem={({ item }) => (
                        <View style={{ padding: 20, borderWidth: 1, borderColor: ColorsList.greyAuthHard }}>
                            <Text>Nomer VA : {item.va_code}</Text>
                            <Text>Topup Code : {item.topup_code}</Text>
                            <Text>Metode : {item.va}</Text>
                            <Text>Tanggal : {moment(item.created_at).format('DD MMM YYYY HH:mm')}</Text>
                        </View>
                    )}
                    keyExtractor={(item, i) => i.toString()}
                />
            </View>
    )
}

export default RiwayatTransaksi;