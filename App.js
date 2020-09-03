import "./src/utils/default"
import UserInactivity from "react-native-user-inactivity"
import store from "./src/redux/store"
import React, { useEffect } from "react"
import { navigationStateChange, onInactive, inActiveTimer } from "src/utils/events"
import BackgroundTimer from "react-native-user-inactivity/lib/BackgroundTimer"
import AppNavigator from "./src/routes/AppNavigator"
import { Root } from "native-base"
import { Provider } from "react-redux"
import env from "src/utils/env"
import SplashScreen from "react-native-splash-screen"

const App = () => {
	useEffect(() => {
		SplashScreen.hide()
	}, [])
	return (
		<Root>
			<Provider store={store}>
				<UserInactivity
					timeForInactivity={inActiveTimer}
					timeoutHandler={BackgroundTimer}
					onAction={onInactive}>
					<AppNavigator
						onNavigationStateChange={navigationStateChange}
						uriPrefix={env.prefix}
					/>
				</UserInactivity>
			</Provider>
		</Root>
	)
}

export default App
