import { Item, Input, Icon, Label, Card, CardItem, Button, Left, Thumbnail, Body, Grid, Col } from 'native-base';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { FloatingInputLabel } from '../Input/InputComp';
import { ColorsList } from '../../styles/colors';
import { RowChild } from '../Helper/RowChild';
import { convertRupiah } from '../../utils/authhelper';
import { useDispatch } from 'react-redux'
import { AddCashPayment } from '../../redux/actions/actionsStoreProduct';


export const WrapperItem = (props) => {
	return (
		<View style={[{ flexDirection: 'row' }, props.style]}>
			<Grid>
				<Col>{props.left}</Col>
				<Col style={{ alignItems: 'flex-end' }}>{props.right}</Col>
			</Grid>
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
								{ fontFamily: 'Nunito-Bold', color: activeIndex == i ? 'white' : ColorsList.primaryColor }
							}>{i == 0 ? "UANG PAS" : convertRupiah(btn).toUpperCase()}</Text>
						</Button>
					)
				})
			}
		</Item>
	)
}

export const PopupDetailPesanan = (props) => {
	const width = Dimensions.get('window').width
	return (
		<MyModal onRequestClose={props.onRequestClose} visible={props.visible}
			body={
				<View>
					<CardItem style={{ height: 100 }}>
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
							<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>Nama Produk</Text>,
							<Text style={{ color: ColorsList.greyFont }}>Rp. 25.000 x 2</Text>
						]} right={[
							<Text style={{ height: '100%', textAlignVertical: 'center', color: ColorsList.greyFont }}>Rp. 50.000</Text>
						]} />
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
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={
							<View style={{ width: width - 100 - 150 }}>
								<FloatingInputLabel label="Diskon" value={props.value} />
							</View>
						} right={
							<View style={{ width: 100 }}>
								<ToggleButton buttons={["Rp", "%"]} />
							</View>
						} />
					</CardItem>
					<CardItem>
						<Grid>
							<Col size={2} style={{ alignItems: 'flex-end' }}>
								<TouchableOpacity style={{}}>
									<Icon style={{ width: 85, fontSize: 100, color: ColorsList.primaryColor }} name="remove-circle-outline" />
								</TouchableOpacity>
							</Col>
							<Col size={1} style={{ alignItems: 'center' }}>
								<Input label="Barcode Number" value="1" />
							</Col>
							<Col size={2} style={{ alignItems: 'flex-start' }}>
								<TouchableOpacity>
									<Icon style={{ width: 85, fontSize: 100, color: ColorsList.primaryColor }} name="add-circle" />
								</TouchableOpacity>
							</Col>
						</Grid>
					</CardItem>
					<CardItem footer>
						<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={
							<Icon style={{ width: 85, fontSize: 50, color: ColorsList.primaryColor }} name="trash" />
						} right={
							<View style={{ flexDirection: 'row' }}>
								<Button style={styles.buttonBatal} onPress={props.dismiss}>
									<Text>Batal</Text>
								</Button>
								<Button style={styles.buttonSimpan}>
									<Text style={{ color: 'white' }}>Simpan</Text>
								</Button>
							</View>
						} />
					</CardItem>
				</View >
			}
			backdropDismiss={false}
		/>
	)
}

export const PilihPelanggan = (props) => {
	const [action, setAction] = useState()
	const [search, setSearch] = useState('')
	const [pelanggan, setPelanggan] = useState()
	const [pelangganVisible, setPelangganVisible] = useState(false)
	return (
		<MyModal onRequestClose={props.onRequestClose} visible={props.visible}
			body={
				<View>
					{/* Modal AddEditPelanggan */}
					<MyModal visible={pelangganVisible} backdropDismiss={false} body={
						<View>
							<CardItem header style={{ justifyContent: 'center' }}>
					<Text style={{ color: ColorsList.greyFont, fontSize: 20, fontWeight: '900' }}>{action == 'add' ? 'Tambah Pelanggan': 'Edit Pelanggan'}</Text>
							</CardItem>
							<CardItem>
								<Item style={{ width: '100%', borderBottomColor: ColorsList.primaryColor, borderBottomWidth: 1 }}>
									<Icon name="search" />
									<Input
										value={pelanggan ? pelanggan.nama : ''}
										placeholder="Nama pelanggan"
										keyboardType={props.keyboardType || "default"}
										onChangeText={(nama) => setPelanggan({ ...pelanggan, nama })} />
								</Item>
							</CardItem>
							<CardItem>
								<Item style={{ width: '100%', borderBottomColor: ColorsList.primaryColor, borderBottomWidth: 1 }}>
									<Icon name="search" />
									<Input
										value={pelanggan ? pelanggan.notelp : ''}
										placeholder="No. Telepon"
										keyboardType={props.keyboardType || "default"}
										onChangeText={(notelp) => setPelanggan({ ...pelanggan, notelp })} />
								</Item>
							</CardItem>
							<CardItem footer style={styles.viewButtonPopup}>
								<Button onPress={() => {
									setPelangganVisible(false)
									props.action(action, pelanggan)
								}} style={styles.buttonSimpan}>
									<Text style={{ color: 'white' }}>Simpan</Text>
								</Button>
								<Button onPress={() => setPelangganVisible(false)} style={styles.buttonBatal}>
									<Text>Batal</Text>
								</Button>
							</CardItem>
						</View>
					} />
					<CardItem header style={{ justifyContent: 'center' }}>
						<Text style={{ color: ColorsList.greyFont, fontSize: 20, fontWeight: '900' }}>Pilih Pelanggan</Text>
					</CardItem>
					<CardItem>
						<Item style={{ width: '100%', borderBottomColor: ColorsList.primaryColor, borderBottomWidth: 1 }}>
							<Icon name="search" />
							<Input
								disabled={props.disabled || false}
								value={search}
								placeholder="Cari nama atau no hp"
								keyboardType={props.keyboardType || "default"}
								onChangeText={text => setSearch(text)} />
						</Item>
					</CardItem>
					<CardItem>
						<FlatList

							data={props.data.filter(item => item.nama.toLowerCase().includes(search))}
							renderItem={({ item }) => (
								<WrapperItem left={[
									<Text style={{ color: ColorsList.primaryColor }}>{item.nama}</Text>,
									<Text style={{ color: ColorsList.greyFont }} note>{item.notelp}</Text>
								]} right={
									<View style={{ flexDirection: 'row-reverse', width: 75, alignItems: 'center', flex: 1 }}>
										<WrapperItem left={
											<Icon style={{ color: ColorsList.primaryColor }} name="trash" />
										} right={
											<Icon onPress={() => {
												setAction('edit')
												setPelanggan(item)
												setPelangganVisible(true)
											}} style={{ color: ColorsList.primaryColor }} name="create" />
										} />
									</View>
								} />
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</CardItem>
					<CardItem footer style={styles.viewButtonPopup}>
						<Button onPress={() => {
							setAction('add')
							setPelanggan({ nama: '', notelp: '' })
							setPelangganVisible(true)
						}} style={styles.buttonSimpan}>
							<Text style={{ color: 'white' }}>Tambah</Text>
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
			onShow={props.onShow}
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
			<MyModal visible={modalVisible} backdropDismiss={() => setModalVisible(false)} body={[
				props.header ? <CardItem header>
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
			]} />
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