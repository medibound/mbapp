import React, {Component} from 'react'
import { Text, View, StatusBar, StyleSheet, TextInput } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import IconA from 'react-native-vector-icons/FontAwesome';

import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';

const SettingOption = ({label, icon, onPress}) => {
    label = label;
    return (
        <>
        <View style={{flexDirection: "column", justifyContent: "center"}}>
            <Button onPress={onPress} titleStyle={{color: "#777777",flexDirection: "row", marginLeft: 10, marginBottom: 2, fontSize: 17, fontWeight: "normal", width: "100%", textAlign: "left"}} buttonStyle={webStyles.settingsButton} icon={<Icon name={icon} size={25} color="#777777"/>} title={label}/> 
            <Icon style={{ position: "absolute", top: 11, right: 25}} name="chevron-forward-outline" size={25} color="#777777"/>
        </View>
        </>
    );
}


class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "",
        }
        this.onSignOut = this.signOut.bind(this);
        this.accountype = ""
        this.data = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
            this.setState({
                account: doc.data().accounttype,
            })
        });
    }


    signOut() {
        firebase.auth().signOut()
          .catch((error) => {
            console.log(error);
          })
    }



    render() {

        const user = firebase.auth().currentUser;
        var displayName;
        var accountTypeName;
        var accountTypeIcon;
        var email;
        var photoUrl;
        var emailVerified;
        var uid;
        var accounttype = this.state.account;
        if (user) {
        // User is signed in.
            if (user != null) {
                displayName = user.displayName;
                email = user.email;
                photoUrl = user.photoURL;
                emailVerified = user.emailVerified;
                uid = user.uid;  
                // The user's ID, unique to the Firebase project. Do NOT use
                // this value to authenticate with your backend server, if
                // you have one. Use User.getToken() instead.
            }
        } else {
        }

        if (accounttype == 1) {
            accountTypeName = "BUSINESS";
            accountTypeIcon = "business";
            console.log("success");
        }
        else {
            accountTypeName = "CLIENT";
            accountTypeIcon = "person";
        }

        return(
            <View style={{height: "100%", width: "100%", backgroundColor: "white", paddingBottom: 5}}>
                <ScrollView style={webStyles.body}>
                    <View style={{backgroundColor: "#f5f5f5", }}>
                        <SafeAreaView style={{padding: 0}} >
                            <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                                <View style={[webStyles.accountCard,{flexDirection: "row", alignItems: "center"}]}>
                                    <Icon style={{marginTop: 4, marginRight:10}} name={accountTypeIcon} size={15} color="rgb(68, 199, 188)"/>
                                    <Text style={{fontSize: 17, fontWeight: "600", color: "rgb(68, 199, 188)"}}>{displayName}</Text>
                                    <View style={{backgroundColor: "rgb(68, 199, 188)", color: "white", padding: 3, fontSize: 12, fontWeight: "700", borderRadius: 5, flex: 1, position: "absolute", right: 15, top: 15}}><Text style={{color: "white", fontSize: 12,}}>{accountTypeName}</Text></View>
                                </View>
                            </View>
                            <View style={webStyles.card}>
                                <SettingOption label="Personal Information" icon="person-circle"/>
                                <SettingOption label="Email Settings" icon="mail"/>
                                <SettingOption label="Privacy and Security" icon="lock-closed"/>
                                <SettingOption label="Connected Services" icon="globe"/>
                                <SettingOption label="Help" icon="help-buoy"/>
                                <SettingOption label="About" icon="information-circle"/>
                            </View>
                            <Button onPress={() => this.signOut()} containerStyle={webStyles.signOutContainer} titleStyle={{color: "rgb(68, 199, 188)", fontSize: 17, fontWeight: "700",marginLeft: 10, marginBottom: 2, width: "100%", textAlign: "left"}} buttonStyle={[webStyles.settingsButton]} icon={<Icon name="log-out" size={25} color="rgb(68, 199, 188)"/>} title="Log Out"/>
                            <StatusBar style="auto" backgroundColor="rgb(68, 199, 188)" barStyle="dark-content" />
                        </SafeAreaView>
                    </View>
                </ScrollView>
            </View>
        )
    }

}

var webStyles = StyleSheet.create({
    body: {
        backgroundColor: "#f5f5f5",
        height: "100%",
        width: "100%",
        overflow: "scroll",
        padding: 0,
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30,
        borderColor: "#dddddd", 
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        zIndex: 10,
    },
    accountCard: {
        borderRadius: 10,
        padding: 15,
        paddingLeft: 20,
        paddingRight: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 7,
        elevation:6,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flex: 1,
        width: "100%",
        backgroundColor: "rgb(227, 255, 253)",
        "borderColor": "rgb(68, 199, 188)",
        "borderWidth": 1,
        "borderStyle": "solid",
    },
    card: {
        width: "100%",
        backgroundColor: "white",
        "borderColor": "#dae0df",
        "borderTopWidth": 1,
        "borderStyle": "solid",
        
    },
    settingsButton: {
        "backgroundColor": "transparent",
        fontWeight: "700",
        width: "100%",
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
        height: 50,
        padding: 0,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: "flex-start",
        overflow: "visible",
    },
    signOutButton: {
        "backgroundColor": "rgb(227, 255, 253)",
        borderWidth: 1,
        borderColor: "rgb(68, 199, 188)", 
        justifyContent: "flex-start",
        height: 50,
    },
    searchInput: {
        "marginBottom": 10,
        "paddingTop": 2.5,
        "paddingRight": 2.5,
        "paddingBottom": 2.5,
        "paddingLeft": 40,
        "backgroundColor": "#f4f8f7",
        "borderWidth": 0,
        "borderColor": "#b0b4b3",
        "borderWidth": 0,
        "borderStyle": "solid",
        "borderTopLeftRadius": 5,
        "borderTopRightRadius": 5,
        "borderBottomRightRadius": 5,
        "borderBottomLeftRadius": 5,
        "width": "100%",
        "height": 45,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4.65,
        elevation:6,
      },
      searchIcon: {
        "width": 20,
        "zIndex": 10,
        "left" : 15,
        "position" : "relative",
        "top": 34,
        "marginTop":-15,
        "alignSelf": "flex-start",
        "color": "#b0b4b3",
        elevation:6,
      },
    signOutContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#dddddd",
        backgroundColor: "white",
    },  
});

export default Account;
