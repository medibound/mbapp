import React, {Component, useRef} from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, KeyboardAvoidingView, TextInput, View, StatusBar, StyleSheet, Dimensions, Platform } from 'react-native'
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import { Host, Portal } from 'react-native-portalize';

import {Objects} from '../../components/index';
const Colors = Objects.Vars.Colors;


const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

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


class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDeviceID: "",
            hasFocus: false,
            search: "",
        }
    }

    changeText(searchTerm){
        this.setState({search: searchTerm});
    }

    onOpenBottomSheetHandler = (index) => {
        this.refs.BottomSheet.snapTo(index);

      };
    onOpenDeviceOptionsHandler = (index, deviceID) => {
        this.refs.DeviceOptions.snapTo(index);
        if (deviceID != null) {
            this.setState({selectedDeviceID: deviceID})
        }
      }
    
    render() {

        const {selectedDeviceID} =  this.state;

        return(
            <KeyboardAvoidingView  style={{height: "100%", width: "100%", backgroundColor: "white"}}>
                <SafeAreaView style={webStyles.body}>
                    <View style={{padding: 10}}>
                    
                        <Icon style={webStyles.searchIcon} name={"search"} size={20} color={Colors.backgroundColor}></Icon>
                        <TextInput 
                            style={this.state.hasFocus ? webStyles.searchInputFocused : webStyles.searchInput}
                            onFocus={this.setFocus.bind(this, true)}
                            onBlur={this.setFocus.bind(this, false)}
                            onChangeText={(search) => {this.changeText(search)}}
                            placeholder="Search Confirmed Users"
                            placeholderTextColor="#888888"
                        />
                    </View>
                    

                    <Objects.Server.UsersList pass={this.onOpenDeviceOptionsHandler} search={this.state.search}></Objects.Server.UsersList>
                    

                    <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle="dark-content" />
                
                </SafeAreaView>
            </KeyboardAvoidingView>
                        
        )
    }

    setFocus (hasFocus) {
        this.setState({hasFocus});
    }

}

var webStyles = StyleSheet.create({
    body: {
        backgroundColor: Colors.backgroundColor,
        height: "100%",
        width: "100%",
        overflow: "scroll",
        padding: 0,
        zIndex: 10,
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
        "backgroundColor": "#222222",
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
      searchInputFocused: {
        "marginBottom": 10,
        "paddingTop": 2.5,
        "paddingRight": 2.5,
        "paddingBottom": 2.5,
        "paddingLeft": 40,
        "backgroundColor": Colors.backgroundColor,
        borderRadius: 10,
        borderColor: "#888888",
        borderWidth: 1,
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
        "top": 34,
        "marginTop":-15,
        "alignSelf": "flex-start",
        "color": "#888888",
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


export default Users;
