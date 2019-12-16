import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import DetailTransaction from '../../screens/AuthScreen/DetailTransaction'
import TransactionList from '../../screens/AuthScreen/TransactionList'
import CancelTransaction from '../../screens/AuthScreen/CancelTransaction'

const TransactionNavigator = createStackNavigator({
  '/drawer/transaction': {
    screen: TransactionList,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/detail-transaction': {
    screen: DetailTransaction,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/cancel-transaction': {
    screen: CancelTransaction,
    navigationOptions: {
      header: null
    }
  }
})

export default createAppContainer(TransactionNavigator)