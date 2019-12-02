import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import DetailTransaction from '../../screens/AuthScreen/DetailTransaction'
import TransactionList from '../../screens/AuthScreen/TransactionList'
import CancelTransaction from '../../screens/AuthScreen/CancelTransaction'

const TransactionNavigator = createStackNavigator({
  TransactionList: {
    screen: TransactionList,
    navigationOptions: {
      header: null
    }
  },
  DetailTransaction: {
    screen: DetailTransaction,
    navigationOptions: {
      header: null
    }
  },
  CancelTransaction: {
    screen: CancelTransaction,
    navigationOptions: {
      header: null
    }
  }
})

export default createAppContainer(TransactionNavigator)