import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import Container, { Body } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { Button } from 'src/components/Button/Button'
import { $Padding } from 'src/utils/stylehelper'
import { Image } from 'src/components/CustomImage'
import { Wrapper } from 'src/components/View/Wrapper'
import { Text } from 'src/components/Text/CustomText'
import { getListProducts } from 'src/utils/api/setupharga'
import { DEV_IMG_URL } from 'src/config'

const SettingHargaPPOB = ({ navigation }) => {
    const [listProducts, setListProducts] = useState()
    const _getData = async () => {
        const { status, data } = await getListProducts()
        if (status == 200) {
            setListProducts(data)
        } else {
            setListProducts([])
        }
    }
    useEffect(() => {
        _getData()
    }, [])
    return <Container>
        <GlobalHeader title="Atur Harga Produk" onPressBack={() => navigation.goBack()} />
        <Body>
            <FlatList
                data={listProducts}
                renderItem={({ item }) => <Button
                    onPress={() => navigation.navigate(`/ppob/settings/sub-product`, item)}
                    style={{ marginBottom: 5 }}
                    padding={$Padding(5, 10)}
                    wrapper={{ justify: 'flex-start' }}
                    color={['whiteColor', 'greyFont']}>
                    <Image width="13%" size={30} source={{ uri: `${DEV_IMG_URL}/${item.image}` }} />
                    <Wrapper width="87%" justify="space-between">
                        <Text>{item.product}</Text>
                        <Image size={20} source={require('src/assets/icons/next.png')} />
                    </Wrapper>
                </Button>}
                keyExtractor={(item, i) => i.toString()}
            />
        </Body>
    </Container>
}

export default SettingHargaPPOB
