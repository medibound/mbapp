import React, {Component, useState} from 'react'
import { Text, View, Appearance, StatusBar, Linking, StyleSheet, TextInput, Platform, Image } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import IconA from 'react-native-vector-icons/FontAwesome';

import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

import { Objects } from '../../components';
import { BlurView } from '@react-native-community/blur';
var webStyles;
var Colors;




class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountType: 0,
            loaded: false,
            settingsButtonStyle: null,
            settingsButtonTopStyle: null,
            colors: Appearance.getColorScheme(),
            colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
        }
        this.onSignOut = this.signOut.bind(this);
        this.data = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
            this.setState({
              accountType: doc.data().accounttype,
              loaded: true,
            })
          });
          
    }

    componentDidMount () {
        Appearance.addChangeListener(this.onAppThemeChanged);

    }

    componentWillUnmount() {
        Appearance.addChangeListener(this.onAppThemeChanged);
      };
    
      onAppThemeChanged = (theme) => {
        const currentTheme = Appearance.getColorScheme();
        this.setState({colors: currentTheme});
        this.setState({colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)})
      };


    signOut() {
        firebase.auth().signOut()
          .catch((error) => {
            console.log(error);
          })
    }

    SettingOption = ({label, icon, color, onPress}) => {
        label = label;
        var display = 0;
        if (color == null) {
            color = Colors.lighterText
            display = 1;
        }
        const [isFocused, setIsFocused] = useState(false)
        return (
            <>
            <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                
                <Button onPressOut={() => setIsFocused(false)} onPressIn={() => setIsFocused(true)}  onPress={onPress} titleStyle={{color: color,flexDirection: "row", marginLeft: 10, fontSize: 17, fontWeight: "normal", width: "100%", textAlign: "left"}} buttonStyle={[webStyles.settingsButton, isFocused && {backgroundColor: Colors.dividerColor}]} icon={<Icon name={icon} size={25} color={color}/>} title={label}/> 
                <Icon style={{ position: "absolute", top: 15, right: 25, opacity: display}} name="chevron-forward-outline" size={20} color={Colors.lightText}/>
            </View>
            </>
        );
    }
    
    SettingOptionTop = ({label, icon, color, onPress}) => {
        label = label;
        var display = 0;
        if (color == null) {
            color = Colors.lighterText
            display = 1;
        }
        const [isFocused, setIsFocused] = useState(false)
        return (
            <>
            <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                
                <Button onPressOut={() => setIsFocused(false)} onPressIn={() => setIsFocused(true)}  onPress={onPress}  titleStyle={{color: color,flexDirection: "row", marginLeft: 10,  fontSize: 17, fontWeight: "normal", width: "100%", textAlign: "left"}} buttonStyle={[webStyles.settingsButtonTop, isFocused && {backgroundColor: Colors.dividerColor}]} icon={<Icon name={icon} size={25} color={color}/>} title={label}/> 
                <Icon style={{ position: "absolute", top: 15, right: 25, opacity: display}} name="chevron-forward-outline" size={20} color={Colors.lightText}/>
            </View>
            </>
        );
    }

    AccountTag = () => {
        if (this.state.accountType == 0) {
            return(
                <View style={{borderRadius: 10,marginTop: 6, backgroundColor: "transparent", width: 80,  overflow: "hidden"}}><Text style={{padding: 2, color: Colors.primaryColor, height: 20, backgroundColor: Colors.secondaryColor, textAlign: "center",  borderRadius: 50, fontSize: 12,  fontWeight: "bold"}}>PERSONAL</Text></View>
            );
        }
        return(
            <View style={{borderRadius: 10,marginTop: 4, backgroundColor: "transparent", width: 80, overflow: "hidden"}}><Text style={{padding: 2, color: Colors.primaryColor, backgroundColor: Colors.secondaryColor, textAlign: "center",  borderRadius: 50, fontSize: 12,  fontWeight: "bold"}}>PARTNER</Text></View>
            );
    }

    goToURL(url) {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }



    render() {

        const user = firebase.auth().currentUser;
        var displayName;
        var email;
        var photoUrl;
        var emailVerified;
        var uid;

        var showApple = "none";

        if (Platform.OS == "ios") {
            showApple = "flex";
        }

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

        Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
        webStyles = setStyle(Colors);

        /*
        
        <SettingOption label="Personal Information" icon="person-circle"/>
        <SettingOption label="Email Settings" icon="mail"/>
        <SettingOption label="Privacy and Security" icon="lock-closed"/>
        <SettingOption label="Connected Services" icon="globe"/>
        
        */

        if (this.state.loaded == true) {
            return(
                <SafeAreaView style={{height: "100%", width: "100%", backgroundColor: Colors.backgroundColor}}>
                    <ScrollView shouldRasterizeIOS={true} alwaysBounceVertical={true} style={webStyles.body}>
                        <View style={{backgroundColor: "#f5f5f5", }}>
                            <View  style={{padding: 0, backgroundColor: Colors.backgroundColor}} >
                                <Text style={{fontSize: 30, fontWeight: "bold", paddingTop: 30, paddingBottom: 15, color: Colors.lighterText}}>My Account</Text>
                                <View >
                                    <View style={{padding: 10, paddingHorizontal: 15, flexDirection: "row", borderWidth: 1, borderColor: Colors.backgroundLightColor, borderTopRightRadius: 10, borderTopLeftRadius: 10, backgroundColor: Colors.backgroundLightColor}}>
                                        <Image source={{uri: "https://medibound.com/wp-content/uploads/2022/04/headshot-nick-300x300.png"}}
                                            style={{width: 50, height: 50,  backgroundColor: Colors.secondaryColor, borderRadius: 100}}
                                        />
                                        <View style={{flexDirection: "column", marginLeft: 10,}}>
                                            <Text style={{ color: Colors.lighterText, fontSize: 18, fontWeight: "700"}}>{displayName}</Text>
                                            <this.AccountTag/>
                                        </View>
                                        
                                    </View>
                                    <View style= {[webStyles.card, {marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0}]}>
                                        <this.SettingOption label="Change Profile Picture" icon="person-circle" onPress={()=> this.goToURL('https://medibound.com')}/>
                                    </View>
                                </View>
                                <View style={[webStyles.card, {marginTop: 20, display: showApple}]}>
                                    <this.SettingOptionTop onPress={() => this.signOut()} label="Connect With Apple Health" color={Colors.mainColor} icon="logo-apple"/>
                                </View>
                                <View style= {[webStyles.card, {marginTop: 20}]}>
                                    <this.SettingOptionTop label="Help & Support" icon="logo-twitter" onPress={()=> this.goToURL('https://twitter.com/medibound')}/>
                                    <this.SettingOption label="Web Portal" icon="globe" onPress={()=> this.goToURL('https://medibound.com')}/>
                                    <this.SettingOption label="About" icon="information-circle" />
                                </View>
                                <View style={[webStyles.card, {marginTop: 20}]}>
                                    <this.SettingOptionTop onPress={() => this.signOut()} label="Log Out" color={Colors.errColor} icon="log-out"/>
                                </View>
                                <Text style={{color: "#777777", alignSelf: "center"}}>Version v{DeviceInfo.getVersion()}</Text>
                                <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle={Colors.darkMode ? "light-content" : "dark-content"} />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )
        }
        else {
            return(
                <View></View>
            );
        }
    }

}

function setStyle(Colors) {

    return StyleSheet.create({
        body: {
            backgroundColor: Colors.backgroundColor,
            height: "100%",
            width: "100%",
            overflow: "scroll",
            padding: 15,
            borderBottomLeftRadius: 30, 
            borderBottomRightRadius: 30,
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

        },
        card: {
            width: "100%",
            backgroundColor: Colors.backgroundLightColor,
            marginTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: Colors.backgroundLightColor,
            borderRadius: 10,
            overflow: "hidden",
        },
        settingsButton: {
            "backgroundColor": Colors.backgroundLightColor,
            fontWeight: "700",
            height: 50,
            padding: 0,
            paddingLeft: 40,
            paddingRight: 30,
            justifyContent: "flex-start",
            overflow: "visible",
            borderTopWidth: 0.5,
            borderTopColor: Colors.dividerColor
        },
        settingsButtonTop: {
            "backgroundColor": Colors.backgroundLightColor,
            fontWeight: "700",
            height: 50,
            padding: 0,
            paddingLeft: 40,
            paddingRight: 30,
            justifyContent: "flex-start",
            overflow: "visible",
        },
        signOutLayout: {
            "backgroundColor": Colors.backgroundColor,
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
}

export default Account;
