import React, { Component } from "react";
import {
    PermissionsAndroid,
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    FlatList,
    TouchableOpacity
} from "react-native";
import Contacts from "react-native-contacts";
import SearchInput from '../Input/SearchInput'
import { GlobalHeader } from "../Header/Header";
import Divider from "../Row/Divider";
import { Text } from "../Text/CustomText";
export default class ContactsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            search: ''
        };

        // if you want to read/write the contact note field on iOS, this method has to be called
        // WARNING: by enabling notes on iOS, a valid entitlement file containing the note entitlement as well as a separate
        //          permission has to be granted in order to release your app to the AppStore. Please check the README.md
        //          for further information.
        // Contacts.iosEnableNotesUsage(true);
    }

    async componentDidMount() {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: "Contacts",
            message: "This app would like to view your contacts."
        }).then(() => {
            this.loadContacts();
        });
    }

    loadContacts() {
        Contacts.getAll((err, contacts) => {
            if (err === "denied") {
                console.warn("Permission to access contacts was denied");
            } else {
                // console.debug(contacts)
                this.setState({ contacts });
            }
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <GlobalHeader onPressBack={this.props.closeModal} title="Contacts" />
                <View style={{ flex: 1, padding: 10, }}>
                    <SearchInput clear={() => this.setSearch({ search: text })}>
                        <TextInput disabled={false}
                            value={this.state.search}
                            placeholder="Cari nama kontak"
                            keyboardType={"default"}
                            onChangeText={text => this.setState({ search: text })} />
                    </SearchInput>
                    <FlatList
                        data={this.state.contacts.filter(item => item.givenName.toLowerCase().includes(this.state.search.toLowerCase()))}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                let phone = ""
                                let selectedNum = item.phoneNumbers[0]
                                if (selectedNum) {
                                    let formattedNum = selectedNum.number.replace(/\D/g, '')
                                    phone = formattedNum
                                    if (formattedNum) {
                                        if (formattedNum.slice(0, 2) == "62") {
                                            phone = `0${formattedNum.slice(2, formattedNum.length)}`
                                        }
                                    }
                                    this.props.chooseContact(item.phoneNumbers[0] ? phone : '')
                                    this.props.closeModal()
                                } else {
                                    this.props.closeModal()
                                }
                            }}>
                                <View style={{ padding: 5, }}>
                                    <Text size={16}>{item.givenName ? item.givenName : ""}</Text>
                                    <Text size={12} color="primary">{item.phoneNumbers[0] ? item.phoneNumbers[0].number : null}</Text>
                                </View>
                                <Divider />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, i) => i.toString()}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});