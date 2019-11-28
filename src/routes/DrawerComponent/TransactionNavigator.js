import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import DetailTransaction from '../../screens/AuthScreen/DetailTransaction'
import TransactionList from '../../screens/AuthScreen/TransactionList'

const TransactionNavigator = createStackNavigator({
    TransactionList : {
      screen : TransactionList,
      navigationOptions : {
        header : null
      }
    },
    DetailTransaction : {
      screen : DetailTransaction,
      navigationOptions : {
        header : null
      }
    }
  })

  export default createAppContainer(TransactionNavigator)