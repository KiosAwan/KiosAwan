import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { FloatingInputLabel, FloatingInputLabelCurrency } from 'src/components/Input/InputComp';
import { ToggleButtonMoney } from 'src/components/Picker/SelectBoxModal';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { convertRupiah, getNearestFifty, validNumber } from 'src/utils/authhelper';
import { RowChild } from 'src/components/Helper/RowChild';
import { AddCashPayment } from 'src/redux/actions/actionsStoreProduct';
import { SizeList } from 'src/styles/size';

const CashPayment = props => {
    const Product = useSelector(state => state.Product)
    const dispatch = useDispatch()

    const _handleChangePayment = (text) => {
        let x = text.extractNumber()
        dispatch(AddCashPayment(parseInt(x)))
    }
    return (
        <View style={[styles.container,props.style]}>
            <FloatingInputLabelCurrency style={{ margin: 0 }}
                value={Product.cash_payment.toString()}
                handleChangeText={_handleChangePayment}
                label="Uang yang diterima"
                keyboardType="number-pad"
            />
            {Product.cash_payment - (parseInt(Product.total) - parseInt(Product.total_diskon)) >= 0 ?
                <Text style={styles.firstRouteKembalian}>Kembalian {convertRupiah(Product.cash_payment - (parseInt(Product.total) - parseInt(Product.total_diskon)))}</Text>
                : null
            }
            <View style={{ ...RowChild, marginTop: SizeList.base }}>
                <ToggleButtonMoney
                    style={{ marginRight: 10, }}
                    buttons={[Product.total - Product.total_diskon, getNearestFifty(Product.total - Product.total_diskon, 1)]}
                />
            </View>
        </View>
    )
}

export default CashPayment;

const styles = StyleSheet.create({
    container: {
        marginTop: SizeList.base,
        padding: SizeList.base,
        backgroundColor: ColorsList.white,
        elevation: 2,
        borderRadius: SizeList.borderRadius
    },
    tabBar: {
        flexDirection: 'row',
        borderColor: ColorsList.primary,
        alignItems: 'center',
        height: 30,
        borderWidth: 1,
        borderRadius: 4
    },
    firstRouteKembalian: {
        ...FontList.subtitleFont,
        color: ColorsList.primaryColor,
        // marginVertical: 5
    },
});