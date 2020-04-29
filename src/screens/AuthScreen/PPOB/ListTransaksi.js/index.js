import React, { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import Container, { Body } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { Button } from 'src/components/Button/Button'
import { $Padding } from 'src/utils/stylehelper'
import { Image } from 'src/components/CustomImage'
import { Wrapper } from 'src/components/View/Wrapper'
import { Text } from 'src/components/Text/CustomText'
import { getPPOBTransactionList } from 'src/utils/api/setupharga'
import { DEV_IMG_URL } from 'src/config'
import { ColorsList } from 'src/styles/colors'
import moment from 'moment'

const ListTransaksiPPOB = ({ navigation }) => {
    const [listTransaction, setListTransaction] = useState([])
    const [listParam, setListParam] = useState({
        search: "",
        date: null
        // date param "2020-04-28"
    })
    const [loading, setLoading] = useState(true)

    const _getData = async (param) => {
        const res = await getPPOBTransactionList(listParam)
        if (res.status == 200) {
            let a = []
            const b = res.data
            if (b.length != 0) {
                for (const key in b) {
                    a.push(b[key])
                }
            }
            setListTransaction(a)
            setLoading(false)
        } else {
            setListTransaction([])
            setLoading(false)
        }
    }
    useEffect(() => {
        let param = null
        _getData(param)
    }, [])
    return <Container>
        <GlobalHeader title="List Transaksi PPOB" onPressBack={() => navigation.goBack()} />
        <Body>
            {loading ?
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "70%", alignSelf: "center" }}>
                    <ActivityIndicator color={ColorsList.primary} />
                </View> :
                listTransaction.length == 0 ?
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "70%", alignSelf: "center" }}>
                        <Image style={{ resizeMode: 'contain', width: 250, height: 250 }} source={require("src/assets/images/riwayat.png")} />
                        <Text font="Bold" size={16}>Tidak ada transaksi</Text>
                        {/* <Text style={{ marginTop: 20 }} align="center">Silahkan lakukan pembelian produk pulsa dan tagihan</Text> */}
                    </View>
                    :
                    <FlatList
                        data={listTransaction}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1 }}>
                                <View style={{ padding: 5, backgroundColor: ColorsList.greyAuthHard }}>
                                    <Wrapper justify="space-between">
                                        <Text>{moment(item.tanggal).format('ddd, DD MMM YYYY')}</Text>
                                        {/* <Text>{convertRupiah(item.total)}</Text> */}
                                    </Wrapper>
                                </View>
                                <View>
                                    {item.data.map((data, i) => (
                                        <Button
                                            key={i}
                                            onPress={() => navigation.navigate(`/drawer/transaction/detail/digital`, { param: data.id })}
                                            style={{ marginBottom: 5 }}
                                            padding={$Padding(5, 10)}
                                            wrapper={{ justify: 'flex-start' }}
                                            color={['whiteColor', 'greyFont']}>
                                            {/* <Image width="13%" size={30} source={require('src/assets/icons/phone.png')} /> */}
                                            <Image width="13%" size={30} source={{ uri: `${DEV_IMG_URL}/${data.image}` }} />
                                            <Wrapper width="87%" justify="space-between">
                                                <View>
                                                    <Text color="primary">{data.transaction_name.split("_").join(" ").toUpperCase()}</Text>
                                                    <Text size={10}>{data.customerID}</Text>
                                                    {data.customer_name && <Text size={10}>{data.customer_name}</Text>}
                                                </View>
                                                <Image size={20} source={require('src/assets/icons/next.png')} />
                                            </Wrapper>
                                        </Button>
                                    ))}
                                </View>
                            </View>
                        )
                        }
                        keyExtractor={(item, i) => i.toString()}
                    />
            }
        </Body>
    </Container>
}

export default ListTransaksiPPOB
