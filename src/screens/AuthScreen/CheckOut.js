import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { TabView, SceneMap } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { SizeList } from 'src/styles/size';
import { convertRupiah, sendNewTransaction, formatToDate, convertNumber, getUserToken } from 'src/utils/authhelper';
import { FontList } from 'src/styles/typography';
import { ColorsList } from 'src/styles/colors';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { GlobalHeader } from 'src/components/Header/Header';
import CashPayment from './Cashier/Payment/CashPayment';
import NonTunai from './Cashier/Payment/NonTunai';
import Piutang from './Cashier/Payment/Piutang';
import {
	removeAllCart,
	getProduct,
	AddCashPayment,
	AddCustomer,
	AddDiscountName,
	AddDiscountRupiah,
	AddDiscountPersen,
	changeTransactionDiscount,
} from 'src/redux/actions/actionsStoreProduct';
import {
	SetIdMultiCart
} from 'src/redux/actions/actionsPPOB';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import AsyncStorage from '@react-native-community/async-storage'
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Bottom } from 'src/components/View/Bottom';
import { StackActions, NavigationActions } from 'react-navigation';
import Container, { Footer, Body } from 'src/components/View/Container';

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
		const userToken = await getUserToken()
		const userId = await AsyncStorage.getItem('userId')
		const Product = this.props.Product
		let cart = []
		Product.belanja.rMap(item => {
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
			this.props.getProduct(this.props.User.store.id_store, userToken)
			this.props.SetIdMultiCart(0)
			this.props.getTransactionList(this.props.User.store.id_store, userToken)
			this.props.navigation.dispatch(
				StackActions.reset({
					index: 1,
					key: null,
					actions: [
						NavigationActions.navigate({ routeName: '/' }),
						NavigationActions.navigate({ routeName: '/drawer/transaction/detail', params: { transactionId: id_transaction, backState: '/' } })
					]
				})
			)
		} else {
			alert(JSON.stringify(res))
		}
	}

	_handlePayCredit = async () => {
		const userToken = await getUserToken()
		const userId = await AsyncStorage.getItem('userId')
		const Product = this.props.Product
		if (Product.customer) {
			if (Product.due_debt_date) {
				let cart = []
				Product.belanja.rMap(item => {
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
					discount_transaction: Product.discount_transaction,
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
					this.props.SetIdMultiCart(0)
					this.props.AddCashPayment(0)
					this.props.AddCustomer(null)
					this.props.AddDiscountName('')
					this.props.AddDiscountPersen('')
					this.props.AddDiscountRupiah('')
					this.props.getProduct(this.props.User.store.id_store, userToken)
					this.props.getTransactionList(this.props.User.store.id_store, userToken)
					this.props.navigation.dispatch(
						StackActions.reset({
							index: 1,
							key: null,
							actions: [
								NavigationActions.navigate({ routeName: '/' }),
								NavigationActions.navigate({ routeName: '/drawer/transaction/detail', params: { transactionId: id_transaction, backState: '/' } })
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
		return <Wrapper flexContent>
			{
				props.navigationState.routes.rMap((route, i) => {
					return <Button textProps={{ size: 11 }} onPress={() => this.setState({ index: i })} color={this.state.index == i ? 'primary' : 'white'} style={{ borderRadius: 0 }}>{route.title}</Button>
				})
			}
		</Wrapper>
	}
	_renderScene = SceneMap({
		first: this.FirstRoute,
		second: this.SecondRoute,
		third: this.ThirdRoute
	});
	render() {
		return <Container>
			<GlobalHeader title="Pembayaran" onPressBack={() => this.props.navigation.goBack()} />
			<AwanPopup.Loading visible={this.state.loadingVisible} />
			<AwanPopup.Alert
				message={this.state.alertMessage}
				visible={this.state._alert}
				closeAlert={() => this.setState({ _alert: false })}
			/>
			<Body>
				<View style={{
					backgroundColor: ColorsList.white,
					padding: SizeList.padding,
					borderRadius: SizeList.borderRadius
				}}>
					<Text>Total tagihan</Text>
					<Text size={25} color="primary" font="ExtraBold">{convertRupiah(parseInt(this.props.Product.total) - parseInt(this.props.Product.total_diskon))}</Text>
				</View>
				<View style={{
					padding: SizeList.padding,
					backgroundColor: ColorsList.white,
					marginTop: SizeList.padding,
					borderRadius: SizeList.borderRadius
				}}>
					<TabView
						navigationState={this.state}
						renderScene={this._renderScene}
						renderTabBar={this._renderTabBar}
						onIndexChange={this._handleIndexChange}
					/>
				</View>
			</Body>
			<Footer>
				<Button width="100%" onPress={this._handleBayar}>BAYAR</Button>
			</Footer>
		</Container>
	}
}
const mapStateToProps = state => {
	return {
		Product: state.Product,
		User: state.User
	}
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