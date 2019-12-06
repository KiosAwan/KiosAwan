import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux'
import { TabView, SceneMap } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { SizeList } from '../../styles/size';
import { convertRupiah, sendNewTransaction } from '../../utils/authhelper';
import { FontList } from '../../styles/typography';
import { ColorsList } from '../../styles/colors';
import { BottomButton, ButtonWithIcon } from '../../components/Button/ButtonComp';
import { GlobalHeader } from '../../components/Header/Header';
import CashPayment from './Cashier/Payment/CashPayment';
import NonTunai from './Cashier/Payment/NonTunai';
import Piutang from './Cashier/Payment/Piutang';
import { removeAllCart, getProduct, AddCashPayment } from '../../redux/actions/actionsStoreProduct';
import { getTransactionList } from '../../redux/actions/actionsTransactionList';
import AsyncStorage from '@react-native-community/async-storage'

const FirstRoute = () => (
    <CashPayment />
)
const SecondRoute = () => (
    <NonTunai />
)
const ThirdRoute = () => (
    <Piutang />
);

class CheckOut extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'TUNAI' },
            { key: 'second', title: 'NON TUNAI' },
            { key: 'third', title: 'PIUTANG' }
        ],
    };

    _handleBayar = () => {
        if (this.state.index == 0) {
            this._handlePayCash()
        } else if (this.state.index == 2) {
            this.handlePayCredit()
        }
    }
    _handlePayCash = async () => {
        const userId = await AsyncStorage.getItem('userId')
        const Product = this.props.Product
        let cart = []
        Product.belanja.map(item => {
            if (item.id_product > 0) {
                let a = {
                    id: item.id_product,
                    qty: item.quantity,
                }
                cart.push(a)
            } else {
                let a = {
                    name_product: item.name_product,
                    qty: item.quantity,
                    priceIn: item.price_in_product,
                    priceOut: item.price_out_product
                }
                cart.push(a)
            }
        })
        const data = {
            cashier: userId,
            amount_payment: Product.cash_payment,
            id_payment_type: 1,
            product_cart: cart,
            customer: Product.customer,
            id_store: this.props.User.store.id_store,
        }
        const res = await sendNewTransaction(data)
        if (res.status == 400) {
            alert(res.data.errors.msg)
        } else {
            this.props.removeAllCart()
            this.props.AddCashPayment(0)
            this.props.getProduct(this.props.User.store.id_store)
            this.props.getTransactionList(this.props.User.store.id_store)
            this.props.navigation.navigate('Cashier')
        }

    }
    _handleIndexChange = index => this.setState({ index });
    _renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        return (
            <View style={styles.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    return (
                        <TouchableOpacity
                            style={[styles.tabItem, (i + 1) % 2 == 0 ? { borderRightWidth: 1, borderLeftWidth: 1, borderColor: '#cd0196' } : null,
                            this.state.index == i ? { backgroundColor: '#cd0196' } : null,
                            this.state.index == 0 ? { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 } : null,
                            this.state.index == 2 ? { borderTopRightRadius: 4, borderBottomRightRadius: 4 } : null,
                            ]}
                            onPress={() => this.setState({ index: i })}>
                            <Animated.Text style={{ fontSize:12, color: this.state.index == i ? 'white' : '#cd0196', fontWeight: '700' }}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
    _renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute
    });
    render() {
        return (
            <View style={{ flex: 1 }}>
                <GlobalHeader title="Pembayaran" onPressBack={() => this.props.navigation.goBack()} />
                <View style={styles.childContainer}>
                    <View style={styles.infoTotalContainer}>
                        <View style={{ margin: 20 }}>
                            <Text style={{ fontFamily: 'Nunito-SemiBold', color: ColorsList.greyFont }}>Total tagihan</Text>
                            <Text style={styles.infoTotal}>{convertRupiah(parseInt(this.props.Product.total) - parseInt(this.props.Product.total_diskon))}</Text>
                        </View>
                    </View>
                    <View style={styles.tabContainer}>
                        <View style={{ flex: 1, margin: 15 }}>
                            <TabView
                                navigationState={this.state}
                                renderScene={this._renderScene}
                                renderTabBar={this._renderTabBar}
                                onIndexChange={this._handleIndexChange}
                            />
                        </View>
                    </View>
                    <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                        <BottomButton
                            onPressBtn={this._handleBayar}
                            style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                            buttonTitle="BAYAR"
                        />
                    </View>
                </View>
            </View>

        );
    }
}
function mapStateToProps(state) {
    return {
        Product: state.Product,
        User: state.User
    };
}
export default connect(
    mapStateToProps,
    { removeAllCart, getProduct, getTransactionList, AddCashPayment }
)(CheckOut)

const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    tabBar: {
        flexDirection: 'row',
        borderColor: '#cd0196',
        alignItems: 'center',
        height: 30,
        borderWidth: 1,
        borderRadius: 4
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        height: '100%',
        justifyContent: "center"
    },
    tabContainer: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        height: SizeList.height / 2,
        borderRadius: SizeList.border_radius
    },
    firstRouteKembalian: {
        ...FontList.subtitleFont,
        color: ColorsList.primaryColor,
        marginVertical: 15
    },
    childContainer: {
        backgroundColor: ColorsList.authBackground,
        flex: 1
    },
    infoTotal: {
        fontSize: 24,
        color: ColorsList.primaryColor,
        fontFamily: 'Nunito-Bold'
    },
    infoTotalContainer: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: SizeList.border_radius
    }
});