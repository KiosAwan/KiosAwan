import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { View, StyleSheet, TextInput, Image, FlatList, TouchableOpacity as TouchableOpacityRN } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { ColorsList } from 'src/styles/colors';
import { Button, Wrapper, Bottom } from 'src/components/Button/ButtonComp';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Text } from 'src/components/Text/CustomText';
import { FloatingInput } from 'src/components/Input/InputComp';
import { Icon } from 'native-base';
import moment from 'moment'
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { convertRupiah } from 'src/utils/authhelper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const initialLayout = { width: 300, height: 300 };

const TransactionList = ({ navigation }) => {

  const dispatch = useDispatch()
  const DataTransaksi = useSelector(state => state.Transaction)
  const User = useSelector(state => state.User)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const iconImage = {
    '3': {
      image: require('src/assets/icons/round-return.png'),
      text: 'DIBATALKAN',
      color: 'danger'
    },
    '2': {
      image: require('src/assets/icons/round-exclamation.png'),
      text: 'HUTANG',
      color: 'warning'
    },
    '1': {
      image: require('src/assets/icons/round-check.png'),
      text: 'LUNAS',
      color: 'success'
    }
  }
  const filterResult = (data) => {
    return data
      .filter(item => filter == 'all' ? item : item.status_payment.includes(filter))
      .filter(item => JSON.stringify(item).toLowerCase().includes(search))
  }
  useEffect(() => {
    dispatch(getTransactionList(User.store.id_store))
  }, [])

  const DaftarTransaksi = props => {
    const [filterPopup, setFilterPopup] = useState(false)
    const selectFilter = (val)=>{
      setFilterPopup(false)
      setFilter(val)
    }
    return (
      <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
        <AwanPopup.Menu visible={filterPopup} title="FILTER" backdropDismiss={() => setFilterPopup(false)}>
          <TouchableOpacityRN onPress={() => selectFilter('all')}>
            <Text>Semua</Text>
          </TouchableOpacityRN>
          <TouchableOpacityRN onPress={() => selectFilter('1')}>
            <Text>Lunas</Text>
          </TouchableOpacityRN>
          <TouchableOpacityRN onPress={() => selectFilter('2')}>
            <Text>Hutang</Text>
          </TouchableOpacityRN>
          <TouchableOpacityRN onPress={() => selectFilter('3')}>
            <Text>Dibatalkan</Text>
          </TouchableOpacityRN>
        </AwanPopup.Menu>
        <View style={{ padding: 15, backgroundColor: ColorsList.whiteColor }}>
          <Wrapper justify="space-between">
            <FloatingInput labelStyle={{ paddingLeft: 30 }} style={{ width: "80%" }} label="Cari produk">
              <Icon style={{ color: ColorsList.primary }} name="search" />
              <TextInput ref={ref => console.debug(ref)} style={{ width: '90%' }} value={search} onChangeText={text => {
                setSearch(text)
                console.log()
              }} />
            </FloatingInput>
            <Button onPress={() => setFilterPopup(true)}>
              <Image style={{ width: 25, height: 25 }} source={require('src/assets/icons/filter.png')} />
            </Button>
          </Wrapper>
        </View>
        {
          eval(DataTransaksi.data.map(item => filterResult(item.data).length).join('+')) > 0 ?
            <FlatList
              data={DataTransaksi.data}
              renderItem={({ item }) => [
                filterResult(item.data).length > 0 ?
                  <View style={{ padding: 15, backgroundColor: ColorsList.greyAuthHard }}>
                    <Wrapper justify="space-between">
                      <Text>{moment(item.date).format('ddd, DD MMM YYYY')}</Text>
                      <Text>{convertRupiah(item.total)}</Text>
                    </Wrapper>
                  </View> : null,
                <View style={{ padding: 15 }}>
                  {
                    filterResult(item.data).map(trx => {
                      return <TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/detail', { transactionId: trx.id_transaction })}>
                        <Wrapper style={{ marginBottom: 10, backgroundColor: ColorsList.whiteColor }} justify="space-between">
                          <View style={{ padding: 15 }}>
                            <Wrapper>
                              <View style={{ justifyContent: 'center' }}>
                                <Image style={{ width: 80, height: 80 }}
                                  source={iconImage[trx.status_payment].image}
                                />
                              </View>
                              <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
                                <Text color="primary" size={15}>{convertRupiah(trx.total_transaction)}</Text>
                                <Text font={trx.name_customer ? 'SemiBold' : 'SemiBoldItalic'}>{trx.name_customer ? trx.name_customer : 'Tidak ada Pelanggan'}</Text>
                                <Text>{trx.payment_code}</Text>
                              </View>
                            </Wrapper>
                          </View>
                          <View style={{ width: '30%', justifyContent: 'center', backgroundColor: ColorsList.greyBg }}>
                            <View style={{ padding: 15 }}>
                              <Text color={iconImage[trx.status_payment].color} style={{ textAlign: 'center' }} font="ExtraBold" size={18}>{iconImage[trx.status_payment].text}</Text>
                            </View>
                          </View>
                        </Wrapper>
                      </TouchableOpacity>
                    })
                  }
                </View>
              ]}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
            :
            <View style={{ alignItems: 'center' }}>
              <Image style={{ width: 350, height: 350 }} source={require('src/assets/images/no-transaction.png')} />
              <View style={{ alignItems: 'center' }}>
                <Text font="ExtraBold" size={17}>Anda belum memiliki transaksi</Text>
                <Text>Silahkan melalukan transaksi baru untuk mengisi laporan</Text>
              </View>
            </View>
        }
      </View>
    )
  }

  const RingkasanHutang = props => {
    const styles = StyleSheet.create({
      wrapper: { padding: 15, backgroundColor: ColorsList.whiteColor, marginBottom: 5 }
    })
    return (
      <View style={{ padding: 15, flex: 1, backgroundColor: ColorsList.authBackground }}>
        <Wrapper style={styles.wrapper} justify="space-between">
          <Text>Jumlah Transaksi Hutang</Text>
          <Text font="ExtraBold" color="primary">Rp. 700.000</Text>
        </Wrapper>
        <Wrapper style={styles.wrapper} justify="space-between">
          <Text>Jumlah Pelanggan</Text>
          <Text font="ExtraBold" color="primary">50</Text>
        </Wrapper>
        <Wrapper style={styles.wrapper} justify="space-between">
          <Text>Transaksi Jatuh Tempo</Text>
          <Text font="ExtraBold" color="primary">50</Text>
        </Wrapper>
        <Wrapper style={styles.wrapper} justify="space-between">
          <Text>Transaksi Belum Lunas</Text>
          <Text font="ExtraBold" color="primary">50</Text>
        </Wrapper>
        <Bottom>
          <Button onPress={() => navigation.navigate('/drawer/transaction/detail/lunasi')} width='100%'>LIHAT DAFTAR HUTANG</Button>
          {/* <Button onPress={() => navigation.navigate('/drawer/transaction/hutang')} width='100%'>LIHAT DAFTAR HUTANG</Button> */}
        </Bottom>
      </View>
    )
  }

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
      <GlobalHeader onPressBack={() => navigation.navigate('/drawer')} title="Transaksi" />
      <View style={{ flex: 1 }}>
        <TabView
          renderTabBar={props => {
            const width = 100 / props.navigationState.routes.length
            return (
              <Wrapper style={{ padding: 15 }}>
                {
                  props.navigationState.routes.map((route, i) => {
                    return <Button disabled={index == i} onPress={() => setIndex(i)} color={index == i ? 'primary' : 'white'} width={`${width}%`} style={{ borderRadius: 0 }}>{route.title}</Button>
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
    </View>
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