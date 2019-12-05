import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch, connect } from 'react-redux'
import { TabView, SceneMap } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { SizeList } from '../../styles/size';
import { FloatingInputLabel } from '../../components/Input/InputComp';
import { convertRupiah, validNumber, getNearestFifty } from '../../utils/authhelper';
import { FontList } from '../../styles/typography';
import { ColorsList } from '../../styles/colors';
import { AddCashPayment } from '../../redux/actions/actionsStoreProduct';
import { BottomButton, ButtonWithIcon } from '../../components/Button/ButtonComp';
import { RowChild } from '../../components/Helper/RowChild';
import { GlobalHeader } from '../../components/Header/Header';
import { ToggleButton } from '../../components/Picker/SelectBoxModal';
import CashPayment from './Cashier/Payment/CashPayment';

const FirstRoute = () => {
    const Product = useSelector(state => state.Product)
    const dispatch = useDispatch()
    return (
        <CashPayment/>
        // <View style={styles.container}>
        //     <View style={{ marginTop: 10 }}>
        //         <FloatingInputLabel
        //             label="Uang yang diterima"
        //             handleChangeText={(text) => {
        //                 if (validNumber(text)) {
        //                     dispatch(AddCashPayment(text))
        //                 }
        //             }}
        //         />
        //         {Product.cash_payment - Product.total >= 0 ?
        //             <Text style={styles.firstRouteKembalian}>Kembalian {convertRupiah(Product.cash_payment - Product.total)}</Text>
        //             : null
        //         }
        //         <View style={{ ...RowChild, marginTop: 20 }}>
        //             <ToggleButton
        //                 style={{ marginRight: 10, }}
        //                 buttons={[convertRupiah(Product.total), convertRupiah(getNearestFifty(Product.total, 1))]}
        //             />
        //             {/* {convertRupiah(getNearestFifty(Product.total,1))} */}
        //             {/* {convertRupiah(getNearestFifty(Product.total,2))} */}
        //         </View>
        //     </View>
        // </View>
    )
}

const SecondRoute = () => (
    <View style={styles.container}>
        <Text>Non Tunai </Text>
    </View>
)
const ThirdRoute = () => (
    <View style={styles.container}>
        <Text>Piutang </Text>
    </View>
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
                            <Animated.Text style={{ color: this.state.index == i ? 'white' : '#cd0196', fontWeight: '700' }}>{route.title}</Animated.Text>
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
                            <Text style={styles.infoTotal}>{convertRupiah(this.props.Product.total - this.props.Product.total_diskon)}</Text>
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
                    {/* <CheckOutTabBar /> */}

                    {/* <RegisterButton
                disabled={isDisabled}
                buttonTitle="Bayar Cash"
                onPressBtn={_handleCashPay}
            />
            <RegisterButton
                buttonTitle="Ngutang"
                onPressBtn={_handleNgutang}
            /> */}
                </View>
            </View>

        );
    }
}
function mapStateToProps(state) {
    return {
        Product: state.Product,
    };
}
export default connect(
    mapStateToProps,
    {}
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
        height: 300,
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