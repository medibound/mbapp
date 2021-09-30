import React, {Component} from 'react'
import { Text, View, StatusBar, StyleSheet, TextInput, Platform, Image } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import IconA from 'react-native-vector-icons/FontAwesome';

import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';


const SettingOption = ({label, icon, color, onPress}) => {
    label = label;
    var display = 0;
    if (color == null) {
        color = "#ddd"
        display = 1;
    }
    return (
        <>
        <View style={{flexDirection: "column", justifyContent: "center"}}>
            
            <Button onPress={onPress} titleStyle={{color: color,flexDirection: "row", marginLeft: 10, marginBottom: 2, fontSize: 17, fontWeight: "normal", width: "100%", textAlign: "left"}} buttonStyle={webStyles.settingsButton} icon={<Icon name={icon} size={25} color={color}/>} title={label}/> 
            <Icon style={{ position: "absolute", top: 11, right: 25, opacity: display}} name="chevron-forward-outline" size={25} color="#ddd"/>
        </View>
        </>
    );
}


class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountType: 0,
            loaded: false,
        }
        this.onSignOut = this.signOut.bind(this);
        this.data = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
            this.setState({
              accountType: doc.data().accounttype,
              loaded: true,
            })
          });
    }


    signOut() {
        firebase.auth().signOut()
          .catch((error) => {
            console.log(error);
          })
    }

    AccountTag = () => {
        if (this.state.accountType == 0) {
            return(
                <Text style={{padding: 1, color: "#00d6a1", backgroundColor: "#004030", textAlign: "center", marginTop: 4, borderRadius: 5, fontSize: 12, width: 70, fontWeight: "bold"}}>PERSONAL</Text>
            );
        }
        return(
            <Text style={{padding: 1, color: "#00d6a1", backgroundColor: "#004030", textAlign: "center", marginTop: 4, borderRadius: 5, fontSize: 12, width: 70, fontWeight: "bold"}}>PARTNER</Text>
        );
    }



    render() {

        const user = firebase.auth().currentUser;
        var displayName;
        var email;
        var photoUrl;
        var emailVerified;
        var uid;
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
        if (this.state.loaded == true) {
            return(
                <View style={{height: "100%", width: "100%", backgroundColor: "#121212"}}>
                    <ScrollView shouldRasterizeIOS={false} alwaysBounceVertical={false} style={webStyles.body}>
                        <View style={{backgroundColor: "#f5f5f5", }}>
                            <SafeAreaView  style={{padding: 0, backgroundColor: "#121212"}} >
                                <View style={{padding: 10}}>
                                    <View style={{padding: 10, paddingHorizontal: 15, flexDirection: "row", borderWidth: 1, borderColor: "#222222", borderRadius: 10, backgroundColor: "#222222"}}>
                                        <Image
                                            style={{width: 50, height: 50,  backgroundColor: "#004030", borderRadius: 5}}
                                        />
                                        <View style={{flexDirection: "column", marginLeft: 10,}}>
                                            <Text style={{ color: "#ddd", fontSize: 18, fontWeight: "700"}}>{displayName}</Text>
                                            <this.AccountTag/>
                                        </View>
                                    </View>
                                </View>
                                <View style= {[webStyles.card, {marginTop: 20}]}>
                                    <SettingOption label="Personal Information" icon="person-circle"/>
                                    <SettingOption label="Email Settings" icon="mail"/>
                                    <SettingOption label="Privacy and Security" icon="lock-closed"/>
                                    <SettingOption label="Connected Services" icon="globe"/>
                                    <SettingOption label="Help" icon="help-buoy"/>
                                    <SettingOption label="About" icon="information-circle"/>
                                </View>
                                <View style={[webStyles.card, {marginTop: 20}]}>
                                    <SettingOption onPress={() => this.signOut()} label="Log Out" color="#d36e6e" icon="log-out"/>
                                </View>
                                <Text style={{color: "#777777", alignSelf: "center"}}>Version v{DeviceInfo.getVersion()}</Text>
                                <StatusBar style="auto" backgroundColor="#00d6a1" barStyle={Platform.OS == 'android' ? "dark-content" : "light-content"} />
                            </SafeAreaView>
                        </View>
                    </ScrollView>
                </View>
            )
        }
        else {
            return(
                <View></View>
            );
        }
    }

}

var webStyles = StyleSheet.create({
    body: {
        backgroundColor: "#121212",
        height: "100%",
        width: "100%",
        overflow: "scroll",
        paddingTop: 10,
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30,
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
        "borderColor": "#00ff79",
        "borderWidth": 1,
        "borderStyle": "solid",
    },
    card: {
        width: "100%",
        backgroundColor: "#121212",
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#222222",
        
    },
    settingsButton: {
        "backgroundColor": "transparent",
        fontWeight: "700",
        width: "100%",
        borderWidth: 0,
        borderTopWidth: 1,
        borderTopColor: "#222222",
        height: 50,
        padding: 0,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: "flex-start",
        overflow: "visible",
    },
    signOutLayout: {
        "backgroundColor": "#121212",
        fontWeight: "700",
        width: "100%",
        borderWidth: 0,
        height: 50,
        padding: 0,
        margin: 0,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: "flex-start",
        overflow: "visible",
    },
    signOutButton: {
        justifyContent: "flex-start",
        borderRadius: 10,
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
        borderRadius: 10,
    },  
});

export default Account;
