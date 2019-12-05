import { Item, Input, Icon, Label, Card, CardItem, Button, Left, Thumbnail, Body, Grid, Row, Col } from 'native-base';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { FloatingInputLabel } from '../Input/InputComp';
import { ColorsList } from '../../styles/colors';
import { RowChild } from '../Helper/RowChild';
import { convertRupiah } from '../../utils/authhelper';
import {useDispatch } from 'react-redux'
import { AddCashPayment } from '../../redux/actions/actionsStoreProduct';


export const WrapperItem = (props) => {
	return (
		<View style={[{ flex: 1, ...RowChild, justifyContent: "space-between" }, props.style]}>
			<View>{props.left}</View>
			<View style={{ alignItems: 'flex-end' }}>{props.right}</View>
		</View>
	)
}

export const ToggleButton = (props) => {
	const [activeIndex, setActiveIndex] = useState(0)
	return (
		<Item style={{ width: '100%' }}>
			{
				props.buttons.map((btn, i) => {
					return (
						<Button onPress={() => setActiveIndex(i)} style={[props.style,
							{ padding: 5, flex: 1, justifyContent: 'center' },
							{ backgroundColor: activeIndex == i ? ColorsList.primaryColor : ColorsList.greyFont },
							props.style
						]}>
							<Text style={
								{ color: activeIndex == i ? 'white' : 'black' }
							}>{btn}</Text>
						</Button>
					)
				})
			}
		</Item>
	)
}

export const ToggleButtonMoney = (props) => {
	const [activeIndex, setActiveIndex] = useState()
	const dispatch = useDispatch()
	return (
		<Item style={{ width: '100%' }}>
			{
				props.buttons.map((btn, i) => {
					return (
						<Button onPress={() => {
							setActiveIndex(i)
							dispatch(AddCashPayment(btn))
						}} style={[props.style,
							{ padding: 5, flex: 1, justifyContent: 'center' },
							{ backgroundColor: activeIndex == i ? ColorsList.primaryColor : 'white' },
							props.style
						]}>
							<Text style={
								{fontFamily : 'Nunito-Bold', color: activeIndex == i ? 'white' : ColorsList.primaryColor }
							}>{i == 0 ? "UANG PAS" : convertRupiah(btn).toUpperCase()}</Text>
						</Button>
					)
				})
			}
		</Item>
	)
}

export const PopupDetailPesanan = (props) => {
	return (
		<MyModal onRequestClose={props.onRequestClose} visible={props.visible}
			body={
				<View>
					<CardItem style={{ height: 100 }}>
						<Grid>
							<Col style={{ paddingRight: 10 }}>
								<Body>
									<Text style={{ color: ColorsList.primaryColor, fontWeight: 'bold' }}>Nama Produk</Text>
									<Text note>Rp. 25.000 x 2</Text>
								</Body>
							</Col>
							<Col size={.5}>
								<Text>Rp. 50.000</Text>
							</Col>
						</Grid>
					</CardItem>
					<CardItem>
						<Grid>
							<Col style={{ paddingRight: 10 }}>
								<FloatingInputLabel label="Barcode Number" disabled value={props.value} />
							</Col>
							<Col size={.2}>
								<ToggleButton buttons={["Rp", "%"]} />
							</Col>
						</Grid>
					</CardItem>
					<CardItem>
						<Grid>
							<Col size={2} style={{ alignItems: 'flex-end' }}>
								<TouchableOpacity style={{}}>
									<Icon style={{ width: 85, fontSize: 100, }} name="remove-circle-outline" />
								</TouchableOpacity>
							</Col>
							<Col size={1} style={{ alignItems: 'center' }}>
								<Input label="Barcode Number" value="1" />
							</Col>
							<Col size={2} style={{ alignItems: 'flex-start' }}>
								<TouchableOpacity>
									<Icon style={{ width: 85, fontSize: 100 }} name="add-circle" />
								</TouchableOpacity>
							</Col>
						</Grid>
					</CardItem>
					<CardItem footer>
						<Grid>
							<Col size={.8}>
								<Icon style={{ fontSize: 40 }} name="trash" onPress={() => alert(2)} />
							</Col>
							<Col />
							<Col size={1}>
								<Button style={styles.buttonBatal} onPress={props.dismiss}>
									<Text>Batal</Text>
								</Button>
							</Col>
							<Col size={1}>
								<Button style={styles.buttonSimpan}>
									<Text style={{ color: 'white' }}>Simpan</Text>
								</Button>
							</Col>
						</Grid>
					</CardItem>
				</View >
			}
			backdropDismiss={false}
		/>
	)
}

export const PilihPelanggan = (props) => {
	const [search, setSearch] = useState()
	return (
		<MyModal onRequestClose={props.onRequestClose} visible={props.visible}
			body={
				<View>
					<CardItem header style={{ justifyContent: 'center' }}>
						<Text>Pilih Pelanggan</Text>
					</CardItem>
					<CardItem>
						<Input
							disabled={props.disabled || false}
							value={props.value}
							placeholder="Cari nama atau no hp"
							keyboardType={props.keyboardType || "default"}
							onChangeText={props.handleChangeText} />
					</CardItem>
					<CardItem>
						<FlatList
							data={[{ id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba', title: 'First Item', }, { id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63', title: 'Second Item' }]}
							renderItem={({ item }) => (
								<Left style={{ margin: 5 }}>
									<Thumbnail source={require('../../assets/icons/apk-logo.png')} />
									<Body>
										<Text>NativeBase</Text>
										<Text note>GeekyAnts</Text>
									</Body>
								</Left>
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</CardItem>
					<CardItem footer style={styles.viewButtonPopup}>
						<Button onPress={props.save} style={styles.buttonSimpan}>
							<Text style={{ color: 'white' }}>Simpan</Text>
						</Button>
						<Button onPress={props.dismiss} style={styles.buttonBatal}>
							<Text>Batal</Text>
						</Button>
					</CardItem>
				</View>
			}
			backdropDismiss={false}
		/>
	)
}

export const MyModal = (props) => {
	return (
		<Modal
			style={[{}, props.style]}
			animationType="slide"
			transparent={true}
			visible={props.visible}
			onRequestClose={props.onClose}>
			<TouchableOpacity style={styles.modalBackDrop} disabled={!props.backdropDismiss ? true : false} onPress={!props.backdropDismiss ? null : props.backdropDismiss}>
				<View style={styles.modalView}>
					<Card styles={styles.modalCard}>
						{props.body}
					</Card>
				</View>
			</TouchableOpacity>
		</Modal>
	)
}

export const SelectBoxModal = (props) => {
	const [activeColor, setActiveColor] = useState('grey');
	const [modalVisible, setModalVisible] = useState(false);
	return (
		<View>
			<MyModal visible={modalVisible} backdropDismiss={() => setModalVisible(false)} body={
				[props.header ? <CardItem header>
					{props.header}
				</CardItem> : null,
				<ScrollView style={{ height: 300 }}>{
					props.data.map((item) => {
						return (
							<CardItem style={styles.modalCardItem} button onPress={() => {
								props.handleChangePicker(item)
								props.closeOnSelect ? setModalVisible(false) : null
							}}>
								{props.renderItem(item)}
							</CardItem>
						)
					})
				}
				</ScrollView>,
				props.footer ?
					<CardItem footer>
						{props.footer}
					</CardItem> : null
				]
			} />
			<Item onPress={() => setModalVisible(true)} success floatingLabel style={[styles.selectBox, { borderColor: activeColor }, props.style]}>
				<Label style={styles.selectBoxLabel}>{props.label}</Label>
				<Input
					onFocus={() => setActiveColor('#cd0192')}
					onBlur={() => setActiveColor('grey')}
					disabled={true}
					value={props.value}
					style={[styles.selectBoxInput, { color: activeColor }]}
				/>
				<Icon name='arrow-dropdown' style={styles.selectBoxIconDown} />
			</Item>
		</View >
	);
}

const styles = StyleSheet.create({
	modalBackDrop: { backgroundColor: 'rgba(0,0,0,.5)', width: '100%', height: '100%' },
	modalView: { flex: 1, justifyContent: "center", padding: 20 },
	modalCard: { paddingVertical: 40, paddingHorizontal: 20 },
	modalCardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	selectBox: { width: '100%' },
	selectBoxLabel: { padding: 0, margin: 0 },
	selectBoxInput: { margin: 0, padding: 0 },
	selectBoxIconDown: { color: 'black' },



	viewButtonPopup: { marginTop: 15, borderColor: 'transparent', flexDirection: 'row-reverse', alignItems: 'flex-start' },
	buttonSimpan: { margin: 5, paddingHorizontal: 30, backgroundColor: ColorsList.primaryColor },
	buttonBatal: { elevation: 0, backgroundColor: 'transparent', margin: 5, paddingHorizontal: 30 },
})