import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
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
    const [listTransaction, setListTransaction] = useState()
    const _getData = async (param) => {
        const res = await getPPOBTransactionList(param)
        if (res.status == 200) {
            let a = []
            const b = res.data
            if (b.length != 0) {
                for (const key in b) {
                    a.push(b[key])
                }
            }
            setListTransaction(a)
        } else {
            setListTransaction([])
        }
    }
    useEffect(() => {
        let param = null
        _getData(param)
    }, [])
    return <Container>
        <GlobalHeader title="List Transaksi PPOB" onPressBack={() => navigation.goBack()} />
        <Body>
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
        </Body>
    </Container>
}

export default ListTransaksiPPOB
