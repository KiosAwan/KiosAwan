import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { FloatingInputLabel, FloatingInputLabelCurrency } from '../../../../components/Input/InputComp';
import { ToggleButtonMoney } from '../../../../components/Picker/SelectBoxModal';
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import { convertRupiah, getNearestFifty, validNumber } from '../../../../utils/authhelper';
import { RowChild } from '../../../../components/Helper/RowChild';
import { AddCashPayment } from '../../../../redux/actions/actionsStoreProduct';

const CashPayment = () => {
    const Product = useSelector(state => state.Product)
    const dispatch = useDispatch()

    const _handleChangePayment = (text) => {
        let x = text.extractNumber()
        dispatch(AddCashPayment(parseInt(x)))
    }
    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10 }}>
                <FloatingInputLabelCurrency style={{ margin: 0 }}
                    value={Product.cash_payment.toString()}
                    handleChangeText={_handleChangePayment}
                    label="Uang yang diterima"
                />
                {Product.cash_payment - (parseInt(Product.total) - parseInt(Product.total_diskon)) >= 0 ?
                    <Text style={styles.firstRouteKembalian}>Kembalian {convertRupiah(Product.cash_payment - (parseInt(Product.total) - parseInt(Product.total_diskon)))}</Text>
                    : null
                }
                <View style={{ ...RowChild, marginTop: 20 }}>
                    <ToggleButtonMoney
                        style={{ marginRight: 10, }}
                        buttons={[Product.total - Product.total_diskon, getNearestFifty(Product.total - Product.total_diskon, 1)]}
                    />
                </View>
            </View>
        </View>
    )
}

export default CashPayment;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1
    },
    tabBar: {
        flexDirection: 'row',
        borderColor: '#cd0196',
        alignItems: 'center',
        height: 30,
        borderWidth: 1,
        borderRadius: 4
    },
    firstRouteKembalian: {
        ...FontList.subtitleFont,
        color: ColorsList.primaryColor,
        marginVertical: 15
    },
});