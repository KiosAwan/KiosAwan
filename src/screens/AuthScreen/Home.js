import React from 'react'
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import SliderImage from '../../components/SliderImage'
import LinearGradient from 'react-native-linear-gradient'
//Styles
import { ColorsList } from '../../styles/colors'
import { FontList } from '../../styles/typography'

//redux
import { useSelector } from 'react-redux'

//CustomComponent
import { CardComp, LinearCardComp, CardTextImage } from '../../components/Card/CardComp'
import { CategoryText } from '../../components/Text/CategoryText'
import { RowChild } from '../../components/Helper/RowChild'
import BarStatus from '../../components/BarStatus'

const height = Dimensions.get('window').height
const Home = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const _onPressCashier = () => {        
        navigation.navigate('Cashier')
    }

    const _onPressPayment = () => {
        // navigation.navigate("Payment")
        Alert.alert(
            'FITUR PAYMENT POINT',
            'Masih dalam tahap pengembangan',
            [
                { text: 'OK', style: 'cancel' }
            ]
        );
    }

    const _onPressStock = () => {
        // navigation.navigate("Stock")
        Alert.alert(
            'FITUR BELANJA STOK',
            'Masih dalam tahap pengembangan',
            [
                { text: 'OK', style: 'cancel' }
            ]
        );
    }

    const _handlePressDrawer = () => {
        navigation.navigate('AkunNavigator')
    }
    return (
        <View style={styles.container}>
            <BarStatus />
            <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.firstChildView}>
                <View style={{ justifyContent: 'space-around', paddingTop: 10, ...RowChild }}>
                    <TouchableOpacity onPress={_handlePressDrawer}>
                        <View style={{ width: 25, height: 25, alignItems: "center", justifyContent: "center" }}>
                            <Icon color="white" size={20} name="bars" />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.nameAndLoc}>
                        {/* <Text style={{ color: 'white', ...FontList.titleFont }}>{User.store ? User.store.name_store : "Kios Saya"}</Text>
                        <View style={styles.wrapChildRow}>
                            <Icon color="white" size={9} name="map-marker-alt" />
                            <Text style={styles.locationInfo}>Kuningan, Jakarta Selatan</Text>
                        </View> */}
                        <Image style={{width : 150, height : 80}} source={require('../../assets/images/logo.png')}/>
                    </View>
                    <View style={styles.wrapChildRow}>
                        <Icon color="white" size={20} name="bell" />
                    </View>
                </View>
                {/* <View style={{ padding: 11 }}>
                    <LinearCardComp />
                </View> */}
            </LinearGradient>
            <ScrollView style={styles.childContainer} showsVerticalScrollIndicator={false}>
                {/* {User.store ? null :
                    <TouchableOpacity onPress={() => navigation.navigate('AddProfile')}>
                        <View style={{ borderRadius: 5, backgroundColor: 'white', justifyContent: "center", alignItems: "center" }}>
                            <Text>Silahkan lengkapi profil untuk dapat menggunakan fitur di aplikasi ini</Text>
                            <Text>Lengkapi profil</Text>
                        </View>
                    </TouchableOpacity>} */}
                <View style={{ paddingVertical: 10 }}>
                    <CardComp info="KASIR"
                        disabled={User.store ? false : true}
                        subInfo="Masuk kedalam mode kasir dan atur penjualan kios atau warung"
                        cardStyle={{ backgroundColor: 'white' }}
                        icon={require("../../assets/icons/icon-cashier.png")}
                        onPressCard={_onPressCashier}
                    />
                    <CardComp info="PAYMENT POINT"
                        disabled={User.store ? false : true}
                        subInfo="Lakukan pembayaran tagihan listrik, PDAM, pulsa, paket data, dll"
                        icon={require("../../assets/icons/icon-payment.png")}
                        cardStyle={{ backgroundColor: 'white' }}
                        onPressCard={_onPressPayment}
                    />
                    <CardComp info="BELANJA STOK"
                        disabled={User.store ? false : true}
                        subInfo="Dapatkan berbagai macam produk dan barang untuk kebutuhan kios atau warung"
                        cardStyle={{ backgroundColor: 'white' }}
                        icon={require("../../assets/icons/icon-restock.png")}
                        onPressCard={_onPressStock}
                    />
                </View>
                <SliderImage />
                <View style={styles.infoCategoryStyle}>
                    <CategoryText title="TAHUKAH KAMU??" />
                </View>
                <ScrollView
                    horizontal={true}
                    style={{ paddingBottom: 15, height: height / 3 }}
                    showsHorizontalScrollIndicator={false}>
                    <CardTextImage
                        onPressCard={() => navigation.navigate('NewsScreen', { weburl: 'https://kiosawan.com/peta-persaingan-50-e-commerce-di-indonesia/' })}
                        image="https://kiosawan.com/wp-content/uploads/2019/11/blog-02a-780x390.jpg"
                        info="Peta Persaingan 50 E-Commerce di Indonesia Versi IPRICE 2019"
                    />
                    <CardTextImage
                        onPressCard={() => navigation.navigate('NewsScreen', { weburl: 'https://kiosawan.com/potensi-fintech-dukung-umkm/' })}
                        image="https://kiosawan.com/wp-content/uploads/2019/11/blog-01-780x390.jpg"
                        info="Mengulik Potensi Fintech untuk Mendukung UMKM"
                    />
                </ScrollView>
            </ScrollView>
        </View>

    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        backgroundColor: ColorsList.authBackground,
        flex: 1
    },
    childContainer: {
        marginHorizontal: 10,
    },
    firstChildView: {
        height: 80,
    },
    thirdChildView: {
        height: height / 3,
        borderWidth: 1
    },
    fourthChildView: {
        height: height / 3,
        borderWidth: 1
    },
    wrapChildRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    locationInfo: {
        paddingLeft: 5,
        color: 'white',
        ...FontList.subtitleFont
    },
    nameAndLoc: {
        justifyContent: "center",
        alignItems: "center"
    },
    infoCategoryStyle: {
        paddingVertical: 10
    }


})