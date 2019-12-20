import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { View, StyleSheet, Dimensions, TextInput } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { ColorsList } from 'src/styles/colors';
import { Bottom, Button, Wrapper } from 'src/components/Button/ButtonComp';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Text } from 'src/components/Text/CustomText';
import { FloatingInput } from 'src/components/Input/InputComp';
import { Icon } from 'native-base';

const initialLayout = { width: 300, height: 300 };

const TransactionList = ({ navigation }) => {
  const DaftarTransaksi = () => (
    <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
      <View style={{ padding: 15, backgroundColor: ColorsList.whiteColor }}>
        <Wrapper justify="space-between">
          <FloatingInput labelStyle={{ paddingLeft: 30 }} style={{ width: "80%" }} label="Cari produk">
            <Icon style={{ color: ColorsList.primary }} name="search" />
            <TextInput style={{ width: '90%' }} value="" />
          </FloatingInput>
          <Text>Filter</Text>
        </Wrapper>
      </View>
      <View style={{ padding: 15, backgroundColor: ColorsList.greyAuthHard }}>
        <Wrapper justify="space-between">
          <Text>jasd</Text>
          <Text>sajhdj</Text>
        </Wrapper>
      </View>
      <View style={{ padding: 15 }}>
        <Wrapper style={{ paddingVertical: 15, backgroundColor: ColorsList.whiteColor }} justify="space-between">
          <View>
            <Text>jhajskdh</Text>
          </View>
          <View>
            <Text>jhajskdh</Text>
          </View>
        </Wrapper>
      </View>
    </View>
  );

  const RingkasanHutang = () => (
    <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
      <Text>Hutang</Text>
    </View>
  );

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Daftar Transaksi' },
    { key: 'second', title: 'Ringkasan Hutang' }
  ]);

  const renderScene = SceneMap({
    first: DaftarTransaksi,
    second: RingkasanHutang,
  });
  return (
    <View style={{ flex: 1 }}>
      <GlobalHeader onPressBack={() => navigation.goBack()} title="Transaksi" />
      <View style={{ flex: 1 }}>
        <TabView
          renderTabBar={props => {
            console.log(props)
            const width = 100 / props.navigationState.routes.length
            return (
              <Wrapper style={{ padding: 15 }}>
                {
                  props.navigationState.routes.map((route, i) => {
                    return <Button disabled={index == i} onPress={() => setIndex(i)} color={index == i ? 'white' : null} width={`${width}%`} style={{ borderRadius: 0 }}>{route.title}</Button>
                  })
                }
              </Wrapper>
            )
          }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        />
      </View>
    </View >
  );
}

const TransactionListss = ({ navigation }) => {
  const dispatch = useDispatch()
  const User = useSelector(state => state.User)
  const Transaction = useSelector(state => state.Transaction)

  useEffect(() => {
    if (User.store != null) {
      _getTransaction()
    }
  }, [])

  const _getTransaction = async () => {
    dispatch(getTransactionList(User.store.id_store))
  }

  return (
    <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
      <GlobalHeader onPressBack={() => navigation.goBack()} title="Transaksi" />
      <View style={{ padding: 20 }}>
        <Wrapper>
          <Button color="white" width="50%" style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}>Test</Button>
          <Button width="50%" style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}>Test</Button>
        </Wrapper>
      </View>
    </View>
    //   User.store ? 
    //   Transaction.isLoading ? 
    //   <View>
    //     <TransactionPlaceholder/>
    //     <TransactionPlaceholder/>
    //     <TransactionPlaceholder/>
    //     <TransactionPlaceholder/>
    //   </View>
    //   :
    //     Transaction.data.length > 0 ?
    //     <View style={styles.containerWithData}>
    //       <Text>Ini transaction list</Text>
    //       <FlatList
    //         data={Transaction.data}
    //         renderItem={({ item }) => (
    //           <View>
    //             <Text>{formatToDays(item.date)}</Text>
    //             <Text>{item.total}</Text>
    //             {item.data.map(child => (
    //               <View key={child.id_transaction}>
    //                 <TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/detail-transaction', { transactionId: child.id_transaction })}>
    //                   <TransactionCard
    //                     total_transaction={child.total_transaction}
    //                     payment_code={child.payment_code}
    //                     status_payment={child.status_payment}
    //                     payment_type={child.id_payment_type == 1 ? "Cash" : "Piutang"}
    //                     transactiontime={child.created_at.slice(11, 16)}
    //                   />
    //                 </TouchableOpacity>
    //               </View>
    //             ))}
    //           </View>
    //         )}
    //         keyExtractor={(item, index) => index.toString()}
    //       />
    //     </View> :
    //     <View style={styles.containerEmptyData}>
    //       <Text>Anda belum memiliki daftar transaksi. Silahkan lakukan transaksi terlebih dahulu.</Text>
    //     </View>

    //     :
    //     <View>
    //       <Text>Lengkapi Profil Anda Terlebih Dahulu</Text>
    //     </View>
  )
}


export default TransactionList

const styles = StyleSheet.create({
  containerEmptyData: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  containerWithData: {
    flex: 1
  }
})