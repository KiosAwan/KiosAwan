import React from 'react';
import { View , StyleSheet, Text} from 'react-native';
import {useDispatch , useSelector} from 'react-redux'
import { FloatingInputLabel } from '../../../../components/Input/InputComp';
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
        let a = validNumber(text)
        if (a) {
            dispatch(AddCashPayment(text))
        }
    }
    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10 }}>
                <FloatingInputLabel
                    label="Uang yang diterima"
                    value={Product.cash_payment.toString()}
                    handleChangeText={_handleChangePayment}
                />
                {Product.cash_payment - Product.total >= 0 ?
                    <Text style={styles.firstRouteKembalian}>Kembalian {convertRupiah(Product.cash_payment - Product.total)}</Text>
                    : null
                }
                <View style={{ ...RowChild, marginTop: 20 }}>
                    <ToggleButtonMoney
                        style={{ marginRight: 10, }}
                        buttons={[Product.total,getNearestFifty(Product.total, 1)]}
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
        flex : 1
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