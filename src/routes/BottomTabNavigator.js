import React from "react"
import { createAppContainer } from "react-navigation"
import { createBottomTabNavigator } from "react-navigation-tabs"
import Home from "src/screens/AuthScreen/Home"
import Report from "src/screens/AuthScreen/Drawer/Report"
import Akun from "src/screens/AuthScreen/Drawer"
import Manajemen from "src/screens/AuthScreen/Drawer/Manajemen"
import Icon from "react-native-vector-icons/FontAwesome5"
import { ColorsList } from "src/styles/colors"
import TransactionList from "src/screens/AuthScreen/Drawer/Transaction"
const BottomTab = createBottomTabNavigator(
	{
		Home: {
			screen: Home,
			navigationOptions: {
				tabBarLabel: "Home",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="home" color={tintColor} size={18} />
				),
			},
		},
		Transaksi: {
			screen: TransactionList,
			navigationOptions: {
				tabBarLabel: "Transaksi",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="list-ul" color={tintColor} size={18} solid />
				),
			},
		},
		Laporan: {
			screen: Report,
			navigationOptions: {
				tabBarLabel: "Laporan",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="file-invoice" color={tintColor} size={18} />
				),
			},
		},
		Manajemen: {
			screen: Manajemen,
			navigationOptions: {
				tabBarLabel: "Manajemen",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="edit" solid color={tintColor} size={18} />
				),
			},
		},
		Akun: {
			screen: Akun,
			navigationOptions: {
				tabBarLabel: "Akun",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="user" color={tintColor} size={18} solid />
				),
			},
		},
	},
	{
		tabBarOptions: {
			activeTintColor: ColorsList.primary,
			inactiveTintColor: "#6C7B95",
			style: {
				backgroundColor: "white",
				borderTopWidth: 0,
				shadowOffset: { width: 5, height: 3 },
				shadowColor: "black",
				shadowOpacity: 0.5,
				elevation: 5,
			},
		},
	},
)

export default createAppContainer(BottomTab)
