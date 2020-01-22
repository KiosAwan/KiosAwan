import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import { Image } from 'src/components/CustomImage';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { convertRupiah } from 'src/utils/authhelper';
import { $Padding, $BorderRadius } from 'src/utils/stylehelper';
import { Bottom } from 'src/components/View/Bottom';

const TopupDetail = ({ navigation }) => {
    const [tutorials, setTutorials] = useState([
        {
            title: "Mobile Banking", steps: [
                "Masukkan pin ATM Anda",
                "Pada menu utama, pilih menu \"Transfer\"",
                "Pilih menu \"Virtual Account\"",
                "Masukkan nomor virtual account lalu pilih \"Benar\"",
                "Periksa kembali data transaksi Anda"
            ]
        },
        {
            title: "ATM", steps: [
                "Masukkan pin ATM Anda",
                "Pada menu utama, pilih menu \"Transfer\"",
                "Pilih menu \"Virtual Account\"",
                "Masukkan nomor virtual account lalu pilih \"Benar\"",
                "Periksa kembali data transaksi Anda"
            ]
        }
    ])
    const [toggled, setToggled] = useState({})
    return (
        <View style={{flex :1}}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <GlobalHeader onPressBack={() => navigation.goBack()} title="BCA Virtual Account" />
                <View style={styles.childContainer}>
                    <View style={styles.infoPembayaran}>
                        <View style={{ alignItems: "center", paddingBottom: 25 }}>
                            <Image style={{ resizeMode: 'contain' }} size={70} source={require('src/assets/ppob/bca.png')} />
                            <Text>Nomor BCA Virtual Account</Text>
                            <Text size={23} font="Bold" color="primary" style={{ marginBottom: 10, }}>8008808191011020</Text>
                            <Button width="30%" disabled color={['transparent', 'greyFont', 'greyFont']} padding={3}>Salin Nomor</Button>
                        </View>
                        <View style={styles.detailTagihan}>
                            <Wrapper justify="space-between" style={styles.wrapperDetail}>
                                <Text>Kode Transaksi</Text>
                                <Text font="Bold">API238563</Text>
                            </Wrapper>
                            <Wrapper justify="space-between" style={styles.wrapperDetail}>
                                <Text>Tanggal</Text>
                                <Text font="Bold">08 Jan 2020</Text>
                            </Wrapper>
                            <Wrapper justify="space-between" style={[styles.wrapperDetail, { borderBottomWidth: 0 }]}>
                                <Text>Total Pembayaran</Text>
                                <Text font="Bold">{convertRupiah(100500)}</Text>
                            </Wrapper>
                        </View>
                    </View>
                    <View style={{ alignItems: "center", paddingVertical: 5 }}>
                        <Text size={18}>Petunjuk Pembayaran</Text>
                    </View>
                    {
                        tutorials.map((ttr, i) => (
                            <View key={i} style={{ marginBottom: 15 }}>
                                <TouchableOpacity style={{ marginBottom: 0, backgroundColor: 'white', padding: 5 }} activeOpacity={.9} onPress={() => { setToggled({ ...toggled, [`${i}`]: !toggled[i] }); console.debug(toggled[i]); }}>
                                    <Wrapper justify="space-between" style={[styles.content, toggled[i] ? { borderBottomWidth: 1, borderBottomColor: ColorsList.greyAuthHard } : null]}>
                                        <Text>{ttr.title}</Text>
                                        <Image style={{ transform: toggled[i] ? [{ rotate: '270deg' }] : [{ rotate: '90deg' }] }} size={20} source={require('src/assets/icons/next.png')} />
                                    </Wrapper>
                                </TouchableOpacity>
                                {toggled[i] ?
                                    <View style={[styles.content, $BorderRadius(0, 0, 5, 5)]}>
                                        {ttr.steps.map((step, ia) => (
                                            <View key={ia} style={styles.categoryView}>
                                                {/* {ia != 0 ? <View style={{width : 1, height : 5, backgroundColor : ColorsList.primary}}/> : null} */}
                                                <View style={styles.categoryCircle}>
                                                    <Text size={10} color="whiteColor">0{(ia + 1)}</Text>
                                                </View>
                                                <View style={{ width: '80%' }}>
                                                    <Text>{step}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                    : null}
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
            <Bottom>
                <Button style={{width :"48%"}} color="white">BATALKAN</Button>
                <Button style={{width :"48%"}}>SELESAI</Button>
            </Bottom>
        </View>
    )
}

export default TopupDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorsList.authBackground
    },
    childContainer: {
        flex: 1,
        margin: 20,
    },
    infoPembayaran: {
        backgroundColor: 'white',
        borderRadius: 5
    },
    detailTagihan: {
        borderTopColor: ColorsList.greyAuthHard,
        borderTopWidth: 1,
    },
    wrapperDetail: {
        borderBottomColor: ColorsList.greyAuthHard,
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 4
    },
    content: {
        ...$Padding(5, 15),
        ...$BorderRadius(5),
        backgroundColor: 'white'
    },
    contentToggled: {
        backgroundColor: ColorsList.primary,
        ...$BorderRadius(5, 5, 0, 0)
    },
    categoryView: {
        marginVertical: 5,
        flexDirection: 'row',
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    categoryCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: ColorsList.primary,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5
    },
})