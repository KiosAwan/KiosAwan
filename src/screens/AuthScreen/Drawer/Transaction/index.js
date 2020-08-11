import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { View, StyleSheet, Image, TouchableOpacity as TouchableOpacityRN, RefreshControl } from 'react-native';
import { IconHeader } from 'src/components/Header/Header';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { convertRupiah, getUserToken } from 'src/utils/authhelper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import { TransactionPlaceholder } from 'src/components/LoadingPlaceholder';
import SearchInput, { SearchInputV2 } from 'src/components/Input/SearchInput';
import Container, { Body } from 'src/components/View/Container';
import { SizeList } from 'src/styles/size';
import BottomSheetSelect, { BottomSheet } from 'src/components/Picker/BottomSheetSelect';
import { Input } from 'src/components/Input/MDInput';
import Gallery from 'src/components/View/Gallery';
import Divider from 'src/components/Row/Divider';
import { stateObject } from 'src/utils/state';
import DateRangePicker from 'src/components/Picker/DateRangePicker/DateRangePicker';

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
      .filter(({ date }) => dateRange.length > 0 ? dateRange.includes(date) : true)
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
  const rla = () => !searchState.open && <View style={{ width: 60, alignItems: "flex-start" }}>
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
  </View>
  const [dateRange, setDateRange] = useState([])
  const initRange = date => {
    const format = 'YYYY-MM-DD'
    const [startDate, endDate] = date ? date.map(a => moment(a)) : [moment().startOf('month'), moment().endOf('month')]
    return [startDate.format(format), endDate.format(format)]
  }
  const renderLeftAccessory = () => !searchState.open && <View style={{ width: 60, alignItems: "flex-start" }}>
    <IconHeader onPress={() => setSearchState({ open: true })} name="search" />
  </View>
  const renderRightAccessory = () => <View style={{ width: 60, alignItems: "flex-end" }}>
    <BottomSheet
      height={425}
      renderButton={<IconHeader disabled name="calendar" />}
      content={close => <DateRangePicker
        initialRange={dateRange.length > 0 ? initRange(dateRange) : [new Date(), new Date()]}
        onSuccess={(from, to) => {
          setDateRange([from, to])
          close()
        }}
      />}
    />
  </View>

  const [searchState, setSearchState] = stateObject({
    value: '',
    open: false
  })
  const ButtonTab = ({ style, active, children, ...props }) =>
    <TouchableOpacity {...props} style={{
      borderBottomColor: active ? ColorsList.primary : ColorsList.greySoft,
      paddingTop: SizeList.secondary,
      paddingBottom: SizeList.base,
      ...active && { borderBottomWidth: 2 },
      ...style
    }}>
      <Text align="center" color={active && 'primary'}>{children}</Text>
    </TouchableOpacity>
  return <Container header={{
    // onlyTitle: true,
    title: searchState.open ? '' : 'DAFTAR TRANSAKSI',
    renderLeftAccessory: renderLeftAccessory,
    renderRightAccessory: !searchState.open && renderRightAccessory,
    children: searchState.open && <Input
      noLabel
      autoFocus
      onBlur={() => {
        setSearch(searchState.value)
        setSearchState({ open: false })
      }}
      returnKeyType="search"
      value={searchState.value}
      label="Cari transaksi"
      onChangeText={value => setSearchState({ value })}
      renderRightAccessory={() => <Icon name="search" style={{ color: ColorsList.primary }} />}
    />
  }}>
    <Wrapper style={{ borderBottomColor: ColorsList.greySoft, borderBottomWidth: .5, paddingHorizontal: SizeList.bodyPadding }} flexContent>
      <ButtonTab active={filter === 'all'} onPress={() => setFilter('all')}>Semua</ButtonTab>
      <ButtonTab active={filter === '1'} onPress={() => setFilter('1')}>Lunas</ButtonTab>
      <ButtonTab active={filter === '3'} onPress={() => setFilter('3')}>Batal</ButtonTab>
      <ButtonTab active={filter === '2'} onPress={() => setFilter('2')}>Hutang</ButtonTab>
    </Wrapper>
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
                            onPress={() => {
                              navigation.push('/drawer/transaction/detail', { transactionId: trx.id_transaction })
                            }}
                          >
                            <View style={{ width: "100%" }}>
                              <Wrapper justify="space-between">
                                <Wrapper _width="65%" justify="flex-start">
                                  <View style={{ justifyContent: 'center', padding: 10, paddingLeft: 5 }}>
                                    <Image style={{ width: 20, height: 20, }} source={iconImage[trx.status_payment].image} />
                                  </View>
                                  <View style={{ justifyContent: 'center' }}>
                                    <Text font="SemiBold">{trx.payment_code}</Text>
                                    <Text font={trx.name_customer ? 'SemiBold' : 'Regular'}>{trx.name_customer ? trx.name_customer : 'N/A'}</Text>
                                  </View>
                                </Wrapper>
                                <View _width="33%">
                                  <Text font="SemiBold" align="right" color={iconImage[trx.status_payment].color} font="SemiBold" size={15}>{iconImage[trx.status_payment].text}</Text>
                                  <Text align="right">{convertRupiah(trx.total_transaction)}</Text>
                                </View>
                              </Wrapper>
                              {trx.status == 2 && trx.status_payment != 3 &&
                                <View>
                                  <Divider style={{ marginVertical: 5 }} />
                                  <Wrapper justify="space-between">
                                    <Text color="danger">Nominal yang dibatalkan</Text>
                                    <Text color="danger">{convertRupiah(trx.total_return)}</Text>
                                  </Wrapper>
                                </View>
                              }
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
                      <Text font="SemiBold" size={17}>Anda belum memiliki transaksi</Text>
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