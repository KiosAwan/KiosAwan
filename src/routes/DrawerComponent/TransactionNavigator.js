import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import TransactionList from 'src/screens/AuthScreen/Drawer/Transaction'
import TransactionDetail from 'src/screens/AuthScreen/Drawer/Transaction/TransactionDetail'
import TransactionDetailBatalkan from 'src/screens/AuthScreen/Drawer/Transaction/TransactionDetailBatalkan'
import TransactionHutang from 'src/screens/AuthScreen/Drawer/Transaction/TransactionHutang'
import TransactionDetailLunasi from 'src/screens/AuthScreen/Drawer/Transaction/TransactionDetailLunasi'
import CetakStruk from 'src/screens/AuthScreen/Drawer/Transaction/TransactionCetakStruk'
import TambahPrinter from 'src/screens/AuthScreen/Drawer/Transaction/TambahPrinter'

const TransactionNavigator = createStackNavigator({
  '/drawer/transaction': {
    screen: TransactionList,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/detail': {
    screen: TransactionDetail,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/detail/batalkan': {
    screen: TransactionDetailBatalkan,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/detail/lunasi': {
    screen: TransactionDetailLunasi,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/hutang': {
    screen: TransactionHutang,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/cetakstruk': {
    screen: CetakStruk,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/tambahprinter': {
    screen: TambahPrinter,
    navigationOptions: {
      header: null
    }
  }
})

export default createAppContainer(TransactionNavigator)