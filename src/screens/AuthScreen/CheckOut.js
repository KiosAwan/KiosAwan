import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { TabView, SceneMap } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { SizeList } from '../../styles/size';
import { convertRupiah, sendNewTransaction, formatToDate, convertNumber } from '../../utils/authhelper';
import { FontList } from '../../styles/typography';
import { ColorsList } from '../../styles/colors';
import { BottomButton } from '../../components/Button/ButtonComp';
import { GlobalHeader } from '../../components/Header/Header';
import CashPayment from './Cashier/Payment/CashPayment';
import NonTunai from './Cashier/Payment/NonTunai';
import Piutang from './Cashier/Payment/Piutang';
import {
	removeAllCart, getProduct, AddCashPayment, AddCustomer, AddDiscountName,
	AddDiscountRupiah,
	AddDiscountPersen,
	changeTransactionDiscount,

} from '../../redux/actions/actionsStoreProduct';
import {
	SetIdMultiCart
} from '../../redux/actions/actionsPPOB';
import { getTransactionList } from '../../redux/actions/actionsTransactionList';
import AsyncStorage from '@react-native-community/async-storage'
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Bottom } from 'src/components/View/Bottom';
import { StackActions, NavigationActions } from 'react-navigation';

class CheckOut extends React.Component {
	state = {
		loadingVisible: false,
		index: 0,
		routes: [
			{ key: 'first', title: 'TUNAI' },
			{ key: 'second', title: 'NON TUNAI' },
			{ key: 'third', title: 'PIUTANG' }
		],
		nonTunai: '',
		_alert: false,
		alertMessage: ''
	};

	FirstRoute = () => <CashPayment />
	SecondRoute = () => <NonTunai nonTunai={this.state.nonTunai} pressImage={(id) => {
		this.setState({ nonTunai: id })
		if (id > 2) {
			this.props.navigation.navigate("/cashier/check-out/payewallet", { amount: parseInt(this.props.Product.total) - parseInt(this.props.Product.total_diskon) })
		}
	}} />
	ThirdRoute = () => <Piutang />
	_handleBayar = () => {
		this.setState({ loadingVisible: true })
		if (this.state.index == 0) {
			this._handlePayCash()
		} else if (this.state.index == 1) {
			this._handlePayCash()
		} else if (this.state.index == 2) {
			this._handlePayCredit()
		}
	}
	_handlePayCash = async () => {
		const userId = await AsyncStorage.getItem('userId')
		const Product = this.props.Product
		let cart = []
		Product.belanja.map(item => {
			if (item.id_product > 0) {
				let a = {
					id: item.id_product,
					qty: item.quantity,
					discount: item.discount_total
				}
				cart.push(a)
			} else {
				let a = {
					name_product: item.name_product,
					qty: item.quantity,
					priceIn: item.price_in_product,
					priceOut: item.price_out_product,
					discount: item.discount_total
				}
				cart.push(a)
			}
		})
		const data = {
			cashier: userId,
			amount_payment: this.state.index == 1 ? Product.total - Product.total_diskon : convertNumber(Product.cash_payment),
			id_payment_type: this.state.index + 1,
			payment_method: this.state.nonTunai,
			product_cart: cart,
			customer: Product.customer ? Product.customer.id_customer : null,
			id_store: this.props.User.store.id_store,
			discount_name: '',
			discount_transaction: Product.discount_transaction,
			note: Product.note,
			id_multi: Product.id_multi
		}
		const res = await sendNewTransaction(data)
		const { id_transaction } = res.data
		this.setState({ loadingVisible: false })
		if (res.status == 400) {
			this.setState({ alertMessage: res.data.errors.msg })
			this.setState({ _alert: true })
		} else if (res.status == 200) {
			this.props.removeAllCart()
			this.props.AddCashPayment(0)
			this.props.AddCustomer(null)
			this.props.AddDiscountName('')
			this.props.AddDiscountPersen('')
			this.props.AddDiscountRupiah('')
			this.props.getProduct(this.props.User.store.id_store)
			this.props.SetIdMultiCart(0)
			this.props.getTransactionList(this.props.User.store.id_store)
			this.props.navigation.dispatch(
				StackActions.reset({
					index: 1,
					key: null,
					actions: [
						NavigationActions.navigate({ routeName: '/' }),
						NavigationActions.navigate({ routeName: '/drawer/transaction/detail', params: { transactionId: id_transaction, backState: '/cashier' } })
					]
				})
			)
			// this.props.navigation.navigate('/drawer/transaction/detail', { transactionId: id_transaction, backState: '/cashier' })
		} else {
			alert(JSON.stringify(res))
		}
	}

	_handlePayCredit = async () => {
		const userId = await AsyncStorage.getItem('userId')
		const Product = this.props.Product
		if (Product.customer) {
			console.debug(Product.customer.id_customer)
			if (Product.due_debt_date) {
				let cart = []
				Product.belanja.map(item => {
					if (item.id_product > 0) {
						let a = {
							id: item.id_product,
							qty: item.quantity,
							discount: item.discount_total
						}
						cart.push(a)
					} else {
						let a = {
							name_product: item.name_product,
							qty: item.quantity,
							priceIn: item.price_in_product,
							priceOut: item.price_out_product,
							discount: item.discount_total
						}
						cart.push(a)
					}
				})
				const data = {
					cashier: userId,
					note: Product.note,
					amount_payment: convertNumber(Product.cash_payment),
					id_payment_type: 3,
					product_cart: cart,
					customer: Product.customer.id_customer,
					id_store: this.props.User.store.id_store,
					due_debt_date: formatToDate(Product.due_debt_date),
					discount_name: '',
					discount_transaction: Product.discount_transaction
				}
				const res = await sendNewTransaction(data)
				const { id_transaction } = res.data
				this.setState({ loadingVisible: false })
				if (res.status == 400) {
					this.setState({ alertMessage: res.data.errors.msg })
					this.setState({ _alert: true })
				} else if (res.status == 200) {
					this.props.removeAllCart()
					this.props.getProduct(this.props.User.store.id_store)
					this.props.getTransactionList(this.props.User.store.id_store)
					// this.props.navigation.navigate('/drawer/transaction/detail', { transactionId: id_transaction, backState: '/cashier' })
					this.props.navigation.dispatch(
						StackActions.reset({
							index: 1,
							key: null,
							actions: [
								NavigationActions.navigate({ routeName: '/' }),
								NavigationActions.navigate({ routeName: '/drawer/transaction/detail', params: { transactionId: id_transaction, backState: '/cashier' } })
							]
						}))
				}
				else {
					alert(JSON.stringify(res))
				}
			} else {
				this.setState({ loadingVisible: false })
				this.setState({ alertMessage: "Tanggal tidak boleh kosong" })
				this.setState({ _alert: true })
			}
		} else {
			this.setState({ loadingVisible: false })
			this.setState({ alertMessage: "Pelanggan tidak boleh kosong" })
			this.setState({ _alert: true })
		}
	}

	_handleIndexChange = index => this.setState({ index });
	_renderTabBar = props => {
		const width = 100 / props.navigationState.routes.length
		return (
			<Wrapper>
				{
					props.navigationState.routes.map((route, i) => {
						return <Button textProps={{ size: 11 }} onPress={() => this.setState({ index: i })} color={this.state.index == i ? 'primary' : 'white'} _width={`${width}%`} style={{ borderRadius: 0 }}>{route.title}</Button>
					})
				}
			</Wrapper>
		)
	}
	_renderScene = SceneMap({
		first: this.FirstRoute,
		second: this.SecondRoute,
		third: this.ThirdRoute
	});
	render() {
		return (
			<View style={{ flex: 1 }}>
				<GlobalHeader title="Pembayaran" onPressBack={() => this.props.navigation.goBack()} />
				<AwanPopup.Loading visible={this.state.loadingVisible} />
				<AwanPopup.Alert
					message={this.state.alertMessage}
					visible={this.state._alert}
					closeAlert={() => this.setState({ _alert: false })}
				/>
				<View style={styles.childContainer}>
					<View style={styles.infoTotalContainer}>
						<View style={{ margin: 20 }}>
							<Text>Total tagihan</Text>
							<Text size={25} color="primary" font="ExtraBold">{convertRupiah(parseInt(this.props.Product.total) - parseInt(this.props.Product.total_diskon))}</Text>
						</View>
					</View>
					<View style={styles.tabContainer}>
						<View style={{ flex: 1, margin: 10 }}>
							<TabView
								navigationState={this.state}
								renderScene={this._renderScene}
								renderTabBar={this._renderTabBar}
								onIndexChange={this._handleIndexChange}
							/>
						</View>
					</View>
				</View>
				<Bottom>
					<Button width="100%" onPress={this._handleBayar} >BAYAR</Button>
				</Bottom>
			</View>
		);
	}
}
function mapStateToProps(state) {
	return {
		Product: state.Product,
		User: state.User
	};
}
export default connect(
	mapStateToProps,
	{
		removeAllCart,
		getProduct,
		getTransactionList,
		AddCashPayment,
		AddCustomer,
		AddDiscountName,
		AddDiscountRupiah,
		AddDiscountPersen,
		changeTransactionDiscount,
		SetIdMultiCart
	}
)(CheckOut)

const styles = StyleSheet.create({
	container: {
		marginTop: 20
	},
	tabBar: {
		flexDirection: 'row',
		borderColor: '#cd0196',
		alignItems: 'center',
		height: 30,
		borderWidth: 1,
		borderRadius: 4
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
		padding: 16,
		height: '100%',
		justifyContent: "center"
	},
	tabContainer: {
		marginHorizontal: 20,
		backgroundColor: 'white',
		height: SizeList.height / 2,
		borderRadius: SizeList.border_radius
	},
	firstRouteKembalian: {
		...FontList.subtitleFont,
		color: ColorsList.primaryColor,
		marginVertical: 15
	},
	childContainer: {
		backgroundColor: ColorsList.authBackground,
		flex: 1
	},
	infoTotal: {
		fontSize: 24,
		color: ColorsList.primaryColor,
		fontFamily: 'Nunito-Bold'
	},
	infoTotalContainer: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: SizeList.border_radius
	}
});