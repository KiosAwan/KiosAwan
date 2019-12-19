import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { View, Text, StyleSheet } from 'react-native';
import { getTransactionList } from '../../../../redux/actions/actionsTransactionList';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { TransactionCard } from '../../../../components/Card/CardComp';
import { TransactionPlaceholder } from '../../../../components/LoadingPlaceholder';
import { formatToDays } from '../../../../utils/authhelper';

const TransactionList = ({ navigation }) => {
  const dispatch = useDispatch()
  const User = useSelector(state => state.User)
  const Transaction = useSelector(state => state.Transaction)

  useEffect(() => {
    if(User.store != null){
      _getTransaction()
    }
  }, [])

  const _getTransaction = async () => {
    dispatch(getTransactionList(User.store.id_store))
  }

  return (
    User.store ? 
    Transaction.isLoading ? 
    <View>
      <TransactionPlaceholder/>
      <TransactionPlaceholder/>
      <TransactionPlaceholder/>
      <TransactionPlaceholder/>
    </View>
    :
      Transaction.data.length > 0 ?
      <View style={styles.containerWithData}>
        <Text>Ini transaction list</Text>
        <FlatList
          data={Transaction.data}
          renderItem={({ item }) => (
            <View>
              <Text>{formatToDays(item.date)}</Text>
              <Text>{item.total}</Text>
              {item.data.map(child => (
                <View key={child.id_transaction}>
                  <TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/detail-transaction', { transactionId: child.id_transaction })}>
                    <TransactionCard
                      total_transaction={child.total_transaction}
                      payment_code={child.payment_code}
                      status_payment={child.status_payment}
                      payment_type={child.id_payment_type == 1 ? "Cash" : "Piutang"}
                      transactiontime={child.created_at.slice(11, 16)}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View> :
      <View style={styles.containerEmptyData}>
        <Text>Anda belum memiliki daftar transaksi. Silahkan lakukan transaksi terlebih dahulu.</Text>
      </View>

      :
      <View>
        <Text>Lengkapi Profil Anda Terlebih Dahulu</Text>
      </View>
  )
}


export default TransactionList

const styles = StyleSheet.create({
  containerEmptyData : {
    flex : 1,
    alignItems : "center",
    justifyContent : "center"
  },
  containerWithData : {
    flex : 1
  }
})