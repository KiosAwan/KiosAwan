import React, { Component, Fragment } from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    View,
    ScrollView,
    DeviceEventEmitter,
    Switch,
    TouchableOpacity,
    Dimensions,
    ToastAndroid
} from 'react-native';
import { BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter } from "react-native-bluetooth-escpos-printer";
import AsyncStorage from '@react-native-community/async-storage';
import { GlobalHeader } from 'src/components/Header/Header';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { ImageAuto } from 'src/components/CustomImage';
import { ColorsList } from 'src/styles/colors';
import { connect } from 'react-redux';
import { addPrinter } from 'src/redux/actions/actionsPrinter';
import { convertRupiah } from 'src/utils/authhelper';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { SizeList } from 'src/styles/size';
import { stylesglobe } from 'src/styles/globalStyle';
import Divider from 'src/components/Row/Divider';
var { height, width } = Dimensions.get('window');

class PengaturanPerangkat extends Component {
    _listeners = [];

    constructor() {
        super();
        this.state = {
            devices: null,
            bleOpend: false,
            loading: true,
            printEnable: null,
            printData: null,
            multi: true,
            singlePrintData: null
        }
    }

    async componentDidMount() {//alert(BluetoothManager)
        const connectedPrinter = await AsyncStorage.getItem('@connected_printer')
        if (connectedPrinter) {
            this.props.addPrinter(JSON.parse(connectedPrinter))
        }
        BluetoothManager.isBluetoothEnabled().then((enabled) => {
            this.setState({
                bleOpend: Boolean(enabled),
                loading: false
            })
        }, (err) => {
            err
        });
        if (Platform.OS === 'android') {
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_CONNECTION_LOST, () => {
                    this.setState({
                        name: '',
                        boundAddress: ''
                    });
                }
            ));
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
                    ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG);
                }
            ))
        }
    }
    _renderRow(rows) {
        let items = [];
        for (let i in rows) {
            let row = rows[i];
            if (row.address) {
                items.push(
                    <TouchableOpacity key={new Date().getTime() + i} stlye={styles.wtf} onPress={() => {
                        this.setState({
                            loading: true
                        });
                        BluetoothManager.connect(row.address)
                            .then(async (s) => {
                                const temp_con_printer = await AsyncStorage.getItem('@connected_printer')
                                if (temp_con_printer) {
                                    console.debug("SET PRINTER ARR")
                                    const parseTemp = JSON.parse(temp_con_printer)
                                    const a = parseTemp.find(item => item.boundAddress == row.address)
                                    if (!a) {
                                        await AsyncStorage.setItem('@connected_printer', JSON.stringify([...parseTemp, { name: row.name, boundAddress: row.address }]))
                                    }
                                } else {
                                    console.debug("SET PRINTER")
                                    await AsyncStorage.setItem('@connected_printer', JSON.stringify([{ name: row.name, boundAddress: row.address }]))
                                }
                                this.setState({
                                    connectedPrinter: [...this.state.connectedPrinter, { name: row.name, boundAddress: row.address }],
                                    loading: false,
                                    boundAddress: row.address,
                                    name: row.name || "UNKNOWN"
                                })
                                console.debug("A", this.state.connectedPrinter)
                            }, (e) => {
                                this.setState({
                                    loading: false
                                })
                                alert(e);
                            })

                    }}><Text style={styles.name}>{row.name || "UNKNOWN"}</Text><Text
                        style={styles.address}>{row.address}</Text></TouchableOpacity>
                );
            }
        }
        return items;
    }

    _connectedBluetoothPrint = async (printer) => {
        BluetoothManager.connect(printer.boundAddress)
            .then(() => {
                this.setState({ printEnable: printer })
                console.debug("PRINT SUCCESS", printer.name)
            }, (e) => {
                alert(e);
            })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
                <GlobalHeader onPressBack={() => this.props.navigation.goBack()} title="PERANGKAT" />
                <View style={styles.switchView}>
                    <Text>Pairing perangkat melalui bluetooth</Text>
                    <Switch
                        thumbColor={this.state.bleOpend ? "#cd0192" : 'grey'}
                        trackColor={{ true: ColorsList.primaryColor, false: 'grey' }}
                        value={this.state.bleOpend} onValueChange={(v) => {
                            this.setState({
                                loading: true
                            })
                            if (!v) {
                                BluetoothManager.disableBluetooth().then(() => {
                                    this.setState({
                                        bleOpend: false,
                                        loading: false,
                                        foundDs: [],
                                        pairedDs: []
                                    });
                                }, (err) => { alert(err) });
                            } else {
                                BluetoothManager.enableBluetooth().then((r) => {
                                    var paired = [];
                                    if (r && r.length > 0) {
                                        for (var i = 0; i < r.length; i++) {
                                            try {
                                                paired.push(JSON.parse(r[i]));
                                            } catch (e) {
                                                //ignore
                                            }
                                        }
                                    }
                                    this.setState({
                                        bleOpend: true,
                                        loading: false,
                                        pairedDs: paired
                                    })
                                }, (err) => {
                                    this.setState({
                                        loading: false
                                    })
                                    alert(err)
                                });
                            }
                        }} />
                </View>
                {!this.state.loading ?
                    <ScrollView style={{ paddingHorizontal: SizeList.bodyPadding }}>
                        {
                            this.state.printEnable ?
                                <TouchableOpacity onPress={this.state.bleOpend ? () => { } : () => alert("Hidupkan bluetooth")}>
                                    <Wrapper justify="space-between" shadow style={{ backgroundColor: ColorsList.white, padding: SizeList.padding }}>
                                        <View style={{ alignItems: "center", flexDirection: "row", }}>
                                            <Icon size={20} name="print" color={ColorsList.greyFont} />
                                            <View style={{ justifyContent: "flex-start", marginLeft: SizeList.base }}>
                                                <Text font="SemiBold" >{this.state.printEnable.name || "UNKNOWN"}</Text>
                                                <Text>{this.state.printEnable.boundAddress}</Text>
                                            </View>
                                        </View>
                                        <Text color="success">TERHUBUNG</Text>
                                    </Wrapper>
                                </TouchableOpacity>
                                : null}
                        {
                            (this.props.Printer.data.length > 0 && this.props.Printer.data[0].boundAddress != (this.state.printEnable ? this.state.printEnable.boundAddress : 0)) &&
                            this.props.Printer.data.length > 0 && <View style={[stylesglobe.shadowView, { padding: SizeList.padding }]}>
                                {this.props.Printer.data.rMap((a, i) =>
                                    a.boundAddress != (this.state.printEnable ? this.state.printEnable.boundAddress : 0) ?
                                        <Fragment>
                                            <TouchableOpacity onPress={this.state.bleOpend ? () => this._connectedBluetoothPrint(a) : () => alert("Mohon hidupkan bluetooth terlebih dahulu")}>
                                                <Wrapper justify="space-between" style={{}}>
                                                    <View style={{ alignItems: "center", flexDirection: "row", }}>
                                                        <Icon size={20} name="print" color={ColorsList.greyFont} />
                                                        <View style={{ justifyContent: "flex-start", marginLeft: SizeList.base }}>
                                                            <Text font="SemiBold" >{a.name || "UNKNOWN"}</Text>
                                                            <Text>{a.boundAddress}</Text>
                                                        </View>
                                                    </View>
                                                    <Text color="danger">BELUM TERHUBUNG</Text>
                                                </Wrapper>
                                            </TouchableOpacity>
                                            {i != this.props.Printer.data.length - 1 && <Divider style={{ marginVertical: SizeList.base }} />}
                                        </Fragment>
                                        : null
                                )}
                            </View>
                        }
                    </ScrollView> : <ActivityIndicator color={ColorsList.primary} />}
                <Bottom>
                    <Button onPress={() => this.props.navigation.navigate('/drawer/settings/perangkat/tambah')} width="100%">TAMBAH PERANGKAT</Button>
                </Bottom>
            </View>
        );
    }


}

function mapStateToProps(state) {
    return {
        Printer: state.Printer
    };
}

export default connect(mapStateToProps, { addPrinter })(PengaturanPerangkat)

const styles = StyleSheet.create({
    wtf: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    name: {
        flex: 1,
        textAlign: "left"
    },
    address: {
        flex: 1,
        textAlign: "right"
    },
    connectedPrinter: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
    },
    switchView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SizeList.bodyPadding
    }
});