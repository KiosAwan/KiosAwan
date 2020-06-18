import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { View, StyleSheet, TextInput, Image, FlatList, TouchableOpacity as TouchableOpacityRN, RefreshControl } from 'react-native';
import { GlobalHeader, IconHeader } from 'src/components/Header/Header';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { ColorsList } from 'src/styles/colors';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Text } from 'src/components/Text/CustomText';
import { } from 'src/components/Input/InputComp';
import { Icon } from 'native-base';
import moment from 'moment'
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { convertRupiah, getUserToken } from 'src/utils/authhelper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import { TransactionPlaceholder } from 'src/components/LoadingPlaceholder';
import SearchInput, { SearchInputV2 } from 'src/components/Input/SearchInput';
import Container, { Body } from 'src/components/View/Container';
import Menu from 'src/components/ModalContent/Menu';
import { SizeList } from 'src/styles/size';
import BottomSheetSelect, { BottomSheet } from 'src/components/Picker/BottomSheetSelect';
import { Input } from 'src/components/Input/MDInput';
import Gallery from 'src/components/View/Gallery';

const initialLayout = { width: 300, height: 300 };

const TransactionList = ({ navigation }) => {

  const dispatch = useDispatch()
  const User = useSelector(state => state.User)
  const DataTransaksi = useSelector(state => state.Transaction)
  const { data: trxData, isLoading } = DataTransaksi
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const iconImage = {
    '3': {
      image: require('src/assets/icons/round-return.png'),
      text: 'BATAL',
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
      .filter(({ status }) => filter == 'all' ? true : status.includes(filter))
      .filter(({ payment_code }) => payment_code.toLowerCase().includes(search.toLowerCase()))
  }
  useEffect(() => {
    _effect()
  }, [])

  const _effect = async () => {
    const userToken = await getUserToken()
    dispatch(getTransactionList(
      User.store ? User.store.id_store : 0,
      userToken
    ))
  }

  const selectFilter = (val) => {
    setFilter(val)
  }
  return <Container header={{
    title: "DAFTAR TRANSAKSI",
    renderLeftAccessory: () => <View style={{ width: 60, alignItems: "flex-start" }}>
      <BottomSheetSelect
        data={[
          { title: "Semua", onPress: () => selectFilter('all') },
          { title: "Lunas", onPress: () => selectFilter('1') },
          { title: "Hutang", onPress: () => selectFilter('2') },
          { title: "Dibatalkan", onPress: () => selectFilter('3') },
        ]}
        renderItem={(item) => <Text font="SemiBold">{item.title.toUpperCase()}</Text>}
        handleChangePicker={(item) => item.onPress()}
        closeOnSelect
        buttonOverride={<IconHeader name="sliders-h" color={ColorsList.greyFont} />}
      />
    </View>,
    renderRightAccessory: () => <View style={{ width: 60, alignItems: "flex-end" }}>
      <TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/ringkasan_hutang')}>
        <IconHeader name="credit-card" color={ColorsList.greyFont} />
      </TouchableOpacity>
    </View>
  }}>
    <Input
      style={{ marginHorizontal: SizeList.bodyPadding }}
      noLabel
      value={search}
      label="Cari transaksi"
      onChangeText={text => setSearch(text)}
      renderRightAccessory={() => <Icon name="search" style={{ color: ColorsList.primary }} />}
    />
    <Body style={{ paddingTop: 0, marginTop: SizeList.base }} persistentScrollbar>
      <View style={{ flex: 1, backgroundColor: isLoading ? ColorsList.white : ColorsList.authBackground }}>
        {
          isLoading ?
            <View>
              <TransactionPlaceholder />
              <TransactionPlaceholder />
              <TransactionPlaceholder />
            </View>
            :
            <View>
              {
                eval(trxData.map(({ data }) => filterResult(data).length).join('+')) > 0 ? <Gallery
                  data={trxData}
                  renderItem={({ item: { data, date, total } }) => {
                    const dataTrx = filterResult(data)
                    return <View>
                      <Wrapper style={{
                        marginVertical: SizeList.base,
                        ...dataTrx.length == 0 && { display: "none" }
                      }} justify="space-between">
                        <Text>{moment(date).format('ddd, DD MMM YYYY')}</Text>
                        <Text font="SemiBold">{convertRupiah(total)}</Text>
                      </Wrapper>
                      <Gallery
                        data={dataTrx}
                        renderItem={({ item: trx, i }) => {
                          return <Button
                            spaceBetween
                            style={{ marginVertical: SizeList.secondary }}
                            radius={SizeList.borderRadius}
                            padding={SizeList.padding}
                            color={["white"]}
                            onPress={() => navigation.navigate('/drawer/transaction/detail', { transactionId: trx.id_transaction })}
                          >
                            <Wrapper justify="flex-start">
                              <View style={{ justifyContent: 'center', padding: 10, paddingLeft: 5 }}>
                                <Image style={{ width: 20, height: 20, }} source={iconImage[trx.status].image} />
                              </View>
                              <View style={{ justifyContent: 'center' }}>
                                <Text font="SemiBold">{trx.payment_code}</Text>
                                <Text font={trx.name_customer ? 'SemiBold' : 'SemiBoldItalic'}>{trx.name_customer ? trx.name_customer : 'Tidak ada Pelanggan'}</Text>
                              </View>
                            </Wrapper>
                            <View>
                              <Text font="SemiBold" align="right" color={iconImage[trx.status].color} font="SemiBold" size={15}>{iconImage[trx.status].text}</Text>
                              <Text align="right">{convertRupiah(trx.total_transaction)}</Text>
                            </View>
                          </Button>
                        }}
                      />
                    </View>
                  }}
                />
                  :
                  <View style={{ alignItems: 'center' }}>
                    <Image style={{ width: 250, height: 250 }} source={require('src/assets/images/no-transaction.png')} />
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text font="ExtraBold" size={17}>Anda belum memiliki transaksi</Text>
                      <Text align="center">Silahkan melalukan transaksi baru untuk mengisi laporan</Text>
                    </View>
                  </View>
              }
            </View>
        }
      </View>
    </Body>
  </Container>
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