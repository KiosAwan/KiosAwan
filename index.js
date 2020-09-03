import "src/utils/default"
import { AppRegistry } from "react-native"
import { name as appName } from "./app.json"
import App from "./App"
import initApp from "src/utils/initApp"

AppRegistry.registerComponent(appName, () => {
	initApp()
	return App
})
