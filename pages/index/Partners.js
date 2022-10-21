import React, {Component, useRef} from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, Appearance, KeyboardAvoidingView, TextInput, View, StatusBar, StyleSheet, Dimensions, Platform } from 'react-native'
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import { Host, Portal } from 'react-native-portalize';

import {Objects} from '../../components/index';

var webStyles;
var Colors;

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

var buttonDiff;
var sheetDiff = "0";

if (Platform.OS == "ios") {
    sheetDiff = "-70"
}
else if (Platform.OS == "android") {
    sheetDiff = "20"
}

if (Platform.OS == "web") {
    buttonDiff = {
        greenButton: 1, 
        whiteButton: 0,
    };
}
else {
    buttonDiff = {
        greenButton: 0.48, 
        whiteButton: 0.48,
    };
}


class Partners extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDeviceID: "",
            hasFocus: false,
            search: "",
            colors: Appearance.getColorScheme(),
            colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
        }
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

    changeText(searchTerm){
        this.setState({search: searchTerm});
    }

    
    render() {

        Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
        webStyles = setStyle(Colors);

        const {selectedDeviceID} =  this.state;

        return(
            <KeyboardAvoidingView  style={{height: 1000, width: "100%", backgroundColor: "white",}}>
                <SafeAreaView style={webStyles.body}>
                    <View style={{padding: 15,}}>
                    
                        <Icon style={webStyles.searchIcon} name={"search"} size={20} color={Colors.lightText}></Icon>
                        <TextInput 
                            style={webStyles.searchInput}
                            onChangeText={(search) => {this.changeText(search)}}
                            onFocus={() => {this.setState({hasFocus: true})}}
                            onBlur ={() => {this.setState({hasFocus: false})}}
                            placeholder="Search Medical Partners"
                            placeholderTextColor="#888888"
                        />
                    </View>
                    
                    <View style={{ height: window.height, marginBottom: 100}}>
                        <Objects.Server.PartnerList pass={this.onOpenDeviceOptionsHandler} search={this.state.search}></Objects.Server.PartnerList>
                    </View>
                    

                    <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle={Colors.darkMode ? "light-content" : "dark-content"} />
                
                </SafeAreaView>
            </KeyboardAvoidingView>
                        
        )
    }

    setFocus (hasFocus) {
        this.setState({hasFocus});
    }

}

function setStyle(Colors) {

    return StyleSheet.create({
        body: {
            backgroundColor: Colors.backgroundColor,
            height: "100%",
            width: "100%",
            overflow: "visible",
            padding: 0,
            marginBottom: -30,
            zIndex: 0,
        },
        topBarButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 15,
            width: "100%",
        },
        searchInput: {
            "marginBottom": 10,
            "paddingTop": 2.5,
            "paddingRight": 2.5,
            "paddingBottom": 2.5,
            "paddingLeft": 40,
            "backgroundColor": Colors.backgroundLightColor,
            borderRadius: 10,
            color: Colors.lightText,
            "width": "100%",
            "height": 35,
        },
        searchInputFocused: {
            "marginBottom": 10,
            "paddingTop": 2.5,
            "paddingRight": 2.5,
            "paddingBottom": 2.5,
            "paddingLeft": 40,
            "backgroundColor": Colors.backgroundLightColor,
            borderRadius: 10,
            color: "#888888",
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
            "top": 28,
            "marginTop":-15,
            "alignSelf": "flex-start",
            elevation:6,
        },
        greenButton: {
            "paddingTop": 2.5,
        "paddingRight": 2.5,
        "paddingBottom": 2.5,
        "paddingLeft": 2.5,
        "backgroundColor": "rgb(68, 199, 188)",
        "borderStyle": "solid",
        "color": "white",
        "fontFamily": "sfd",
        "fontSize": 13,
        "fontWeight": "400",
        borderRadius: 5,
        "height": 40

        },
        grayButton: {
            "paddingTop": 2.5,
            "paddingRight": 2.5,
            "paddingBottom": 2.5,
            "paddingLeft": 2.5,
            "backgroundColor": "#fbfbfb",
            "borderWidth": 1,
            "borderColor": "#dae0df",
            "borderStyle": "solid",
            "color": "black",
            "fontFamily": "sfd",
            "fontSize": 13,
            "fontWeight": "400",
            borderRadius: 5,
            "height": 40
        }
    });

}


export default Partners;
