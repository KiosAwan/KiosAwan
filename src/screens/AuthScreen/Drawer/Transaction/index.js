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
import { convertRupiah, getReportHutang } from 'src/utils/authhelper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const initialLayout = { width: 300, height: 300 };

const TransactionList = ({ navigation }) => {

  const dispatch = useDispatch()
  const DataTransaksi = useSelector(state => state.Transaction)
  const User = useSelector(state => state.User)
  const [reportHutang, setReportHutang] = useState({})
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const _reportHutang = async () => {
    const res = await getReportHutang(User.store.id_store)
    setReportHutang(res.data)
  }
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
      .filter(item => filter == 'all' ? item : item.status.includes(filter))
      .filter(item => JSON.stringify(item).toLowerCase().includes(search))
  }
  useEffect(() => {
    dispatch(getTransactionList(User.store.id_store))
    _reportHutang()
  }, [])

  const [filterPopup, setFilterPopup] = useState(false)
  const selectFilter = (val) => {
    setFilterPopup(false)
    setFilter(val)
  }
  const DaftarTransaksi = ({ route }) => {
    return (
      <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
        {
          route.key == 'first' ?
            <View>
              <AwanPopup.Menu visible={filterPopup} title="FILTER" backdropDismiss={() => setFilterPopup(false)}>
                <Button onPress={() => selectFilter('all')} color="link" style={{ padding: 0 }} textProps={{ font: 'Regular' }} align="flex-start">Semua</Button>
                <Button onPress={() => selectFilter('1')} color="link" style={{ padding: 0 }} textProps={{ font: 'Regular' }} align="flex-start">Lunas</Button>
                <Button onPress={() => selectFilter('2')} color="link" style={{ padding: 0 }} textProps={{ font: 'Regular' }} align="flex-start">Hutang</Button>
                <Button onPress={() => selectFilter('3')} color="link" style={{ padding: 0 }} textProps={{ font: 'Regular' }} align="flex-start">Dibatalkan</Button>
              </AwanPopup.Menu>
              <View style={{ padding: 15, paddingTop: 0, backgroundColor: ColorsList.whiteColor }}>
                <Wrapper justify="space-between">
                  <FloatingInput labelStyle={{ paddingLeft: 30 }} style={{ width: "80%" }} label="Cari transaksi">
                    <Icon style={{ color: ColorsList.primary }} name="search" />
                    <TextInput style={{ width: '90%' }} value={search} onChangeText={text => setSearch(text)} />
                  </FloatingInput>
                  <Button style={{ margin: 15 }} onPress={() => setFilterPopup(true)}>
                    <Image style={{ width: 20, height: 20 }} source={require('src/assets/icons/filter.png')} />
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
                                      <Image style={{ width: 50, height: 50 }} source={iconImage[trx.status].image} />
                                    </View>
                                    <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
                                      <Text color="primary">{convertRupiah(trx.total_transaction)}</Text>
                                      <Text font={trx.name_customer ? 'SemiBold' : 'SemiBoldItalic'}>{trx.name_customer ? trx.name_customer : 'Tidak ada Pelanggan'}</Text>
                                      <Text>{trx.payment_code}</Text>
                                    </View>
                                  </Wrapper>
                                </View>
                                <View style={{ width: '35%', justifyContent: 'center', backgroundColor: ColorsList.greyBg }}>
                                  <View style={{ padding: 10 }}>
                                    <Text color={iconImage[trx.status].color} style={{ textAlign: 'center' }} font="ExtraBold" size={15}>{iconImage[trx.status].text}</Text>
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
            :
            <RingkasanHutang />
        }
      </View>
    )
  }

  const RingkasanHutang = ({ route }) => {
    return (
      !reportHutang ? <View style={{ alignItems: 'center' }}>
        <Image style={{ width: 350, height: 350 }} source={require('src/assets/images/no-transaction.png')} />
        <View style={{ alignItems: 'center' }}>
          <Text font="ExtraBold" size={17}>Anda belum memiliki piutang</Text>
          <Text>Silahkan melalukan transaksi baru untuk mengisi laporan</Text>
        </View>
      </View>
        :
        <View style={{ flex: 1, padding: 15 }}>
          <Wrapper style={styles.wrapper} justify="space-between">
            <Text>Jumlah Transaksi Hutang</Text>
            <Text font="ExtraBold" color="primary">{convertRupiah(reportHutang.jumlah_hutang)}</Text>
          </Wrapper>
          <Wrapper style={styles.wrapper} justify="space-between">
            <Text>Jumlah Pelanggan</Text>
            <Text font="ExtraBold" color="primary">{reportHutang.jumlah_pelanggan}</Text>
          </Wrapper>
          <Wrapper style={styles.wrapper} justify="space-between">
            <Text>Transaksi Jatuh Tempo</Text>
            <Text font="ExtraBold" color="primary">{reportHutang.trx_jatuh_tempo}</Text>
          </Wrapper>
          <Wrapper style={styles.wrapper} justify="space-between">
            <Text>Transaksi Belum Lunas</Text>
            <Text font="ExtraBold" color="primary">{reportHutang.trx_belum_lunas}</Text>
          </Wrapper>
          <Bottom>
            <Button onPress={() => navigation.navigate('/drawer/transaction/hutang')} width='100%'>LIHAT DAFTAR HUTANG</Button>
          </Bottom>
        </View>
    )
  }

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Daftar Transaksi' },
    { key: 'second', title: 'Ringkasan Hutang' }
  ]);

  return (<View style={{ flex: 1 }}>
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
        renderScene={DaftarTransaksi}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </View>
  </View>
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
  },
  wrapper: { padding: 15, backgroundColor: ColorsList.whiteColor, marginBottom: 5 }
})