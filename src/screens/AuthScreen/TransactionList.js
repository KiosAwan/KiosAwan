import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'

import { View, Text } from 'react-native';
import { getTransactionList } from '../../redux/actions/actionsTransactionList';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { TransactionCard } from '../../components/Card/CardComp';
import { Spinner } from 'native-base';

const TransactionList = ({navigation}) => {
    const dispatch = useDispatch()
    const User = useSelector(state => state.User)
    const Transaction = useSelector(state => state.Transaction)
    useEffect(() => { 
        _getTransaction()
    }, [])

    const _getTransaction = () => {
        dispatch(getTransactionList(User.store.id_store))
    }

    return (
        Transaction.isLoading ? <Spinner color="#cd0192"/> :
        <View>
            <Text>Ini transaction list</Text>
            <FlatList
                data={Transaction.data}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('DetailTransaction', {transactionId : item.id_transaction})}>
                    <TransactionCard
                    total_transaction={item.total_transaction}
                    payment_code={item.payment_code}
                    status_payment={item.status_payment}
                    payment_type={item.id_payment_type == 1 ? "Cash" : "Piutang"}
                    transactiontime={item.created_at.slice(11,16)}
                    />
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                />
        </View>
    )
}


export default TransactionList