import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import TransactionList from 'src/screens/AuthScreen/Drawer/Transaction'
import TransactionDetail from 'src/screens/AuthScreen/Drawer/Transaction/TransactionDetail'
import TransactionDetailBatalkan from 'src/screens/AuthScreen/Drawer/Transaction/TransactionDetailBatalkan'
import TransactionHutang from 'src/screens/AuthScreen/Drawer/Transaction/TransactionHutang'
import TransactionDetailLunasi from 'src/screens/AuthScreen/Drawer/Transaction/TransactionDetailLunasi'
import TransactionSelesai from 'src/screens/AuthScreen/Drawer/Transaction/TransactionSelesai'

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
  '/drawer/transaction/selesai': {
    screen: TransactionSelesai,
    navigationOptions: {
      header: null
    }
  }
})

export default createAppContainer(TransactionNavigator)