import React, {Component, useRef} from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image, StatusBar, StyleSheet, Dimensions, Platform } from 'react-native'
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import { Host, Portal } from 'react-native-portalize';

import {Objects} from '../../components/index';
const Colors = Objects.Vars.Colors;

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


class Devices extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDeviceID: ""
        }
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
            <View style={{height: "100%", width: "100%", backgroundColor: "white"}}>
                <SafeAreaView style={webStyles.body}>
                    <View style={{padding: 15, flexDirection: "row", width: screen.width, borderBottomWidth: 1, borderBottomColor: Colors.backgroundLightColor}}>
                        <Image
                            style={{width: 40, height: 40,  backgroundColor: "#004030", borderRadius: 5}}
                        />
                        <Button title="Tap To Add Device" buttonStyle={webStyles.addDataButton} titleStyle={{color: "#ddd"}} icon={<Icon name={"radio-outline"} size={20} style={{marginRight: 10}} color="#ddd"/>}></Button>
                    </View>
                    
                    <Objects.Server.DeviceList pass={this.onOpenDeviceOptionsHandler}></Objects.Server.DeviceList>
                    

                    <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle={Colors.darkMode ? "light-content" : "dark-content"} />
                
                </SafeAreaView>
            </View>
                        
        )
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
    addDataButton: {
        height: 39,
        width: screen.width - 76,
        marginLeft: 10,
        backgroundColor: Colors.backgroundLightColor,
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: Colors.backgroundLightColor
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


export default Devices;
