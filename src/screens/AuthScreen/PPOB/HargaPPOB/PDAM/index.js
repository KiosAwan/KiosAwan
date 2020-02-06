import React from 'react'
import Container, { ContainerBody } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { Button } from 'src/components/Button/Button'
import { $Padding } from 'src/utils/stylehelper'
import { Image } from 'src/components/CustomImage'
import { Wrapper } from 'src/components/View/Wrapper'
import { Text } from 'src/components/Text/CustomText'
import MDInput from 'src/components/Input/MDInput'
import { ColorsList } from 'src/styles/colors'
import { StyleSheet, View } from 'react-native'
import { Bottom } from 'src/components/View/Bottom'
import SearchInput, { SearchInputV2 } from 'src/components/Input/SearchInput'

const AturPDAM = ({ navigation }) => {
    return <Container>
        <GlobalHeader title="Atur Harga PDAM" onPressBack={() => navigation.goBack()} />
        <View style={[styles.wrapper, styles.wrapperSearch]}>
            <SearchInput placeholder="Cari PDAM" />
        </View>
        <ContainerBody style={{paddingTop:0}}>
            {[1, 2,3,4,5,6,7,8].map((item, i) => (<Wrapper key={i} style={styles.wrapper} justify="space-between">
                <Wrapper _width="60%" style={styles.leftWrapper}>
                    <Image style={{ resizeMode: "contain" }} size={50} source={require('src/assets/ppob/bca.png')} />
                    <Text _width="60%">Telekomunikasi - Halo</Text>
                </Wrapper>
                <MDInput _style={styles.rightWrapper} value="20000" label="Biaya Pembayaran" />
            </Wrapper>))}
        </ContainerBody>
        <Bottom>
            <Button width="100%">SIMPAN</Button>
        </Bottom>
    </Container>
}

export default AturPDAM

const styles = StyleSheet.create({
    wrapperSearch: {
        padding: 10
    },
    wrapper: {
        backgroundColor: ColorsList.whiteColor,
        marginBottom: 10
    },
    leftWrapper: {
        padding: 5,
    },
    rightWrapper: {
        width: '40%',
        backgroundColor: ColorsList.greyBg,
        padding: 5,
    }
})