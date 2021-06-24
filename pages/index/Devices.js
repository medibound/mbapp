import React, {Component, useRef} from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StatusBar, StyleSheet, Dimensions, Platform } from 'react-native'
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import { Host, Portal } from 'react-native-portalize';

import {Objects} from '../../components/index';

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


class Devices extends Component {

    constructor(props) {
        super(props);
    
    }

    onOpenBottomSheetHandler = (index) => {
        this.refs.BottomSheet.snapTo(index);
      };
    
    render() {

        return(
            <View style={{height: "100%", width: "100%", backgroundColor: "white", paddingBottom: 5}}>
                <SafeAreaView style={webStyles.body}>
                    <View style={[webStyles.topBarButtons,{"borderBottomColor": "#dddddd","borderBottomWidth": 1,}]}>
                        <Button onPress={()=> this.onOpenBottomSheetHandler(1)}  titleStyle={{fontWeight: "600", fontSize:16,justifyContent:"center",alignContent:"center",marginLeft: 5,}} buttonStyle={webStyles.greenButton} containerStyle={{flex: buttonDiff.greenButton}} icon={<Icon name="keypad" size={15} color="white" />} title="ENTER CODE"></Button>
                        <Button titleStyle={{fontWeight: "600", color: "#777777", fontSize:16,justifyContent:"center",alignContent:"center",marginLeft: 5,}} buttonStyle={webStyles.grayButton} containerStyle={{flex: buttonDiff.whiteButton}} icon={<Icon name="radio" size={15} color="#777777"/>} title="TAP TO ADD"></Button>
                    </View>
                    
                    <Objects.Server.DeviceList></Objects.Server.DeviceList>

                    <StatusBar style="auto" backgroundColor="rgb(68, 199, 188)" barStyle="dark-content" />
                    <Portal>
                    <BottomSheet 
                        keyboardAware={true}
                        keyboardAwareExtraSnapHeight={sheetDiff}
                        bottomSheerColor="#FFFFFF"
                        ref="BottomSheet"
                        dragEnabled={false}
                        initialPosition={'0%'} //200, 300
                        snapPoints={['0%','40%']}
                        isBackDrop={true}
                        isBackDropDismissByPress={true}
                        isRoundBorderWithTipHeader={true}
                        containerStyle={{backgroundColor: "white"}}
                        body={<Objects.Server.CodeVerify pass={this.onOpenBottomSheetHandler}/>}
                    />
                    </Portal>
                
                </SafeAreaView>
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
    topBarButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        width: "100%",
    },
    greenButton: {
        "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 2.5,
      "backgroundColor": "rgb(68, 199, 188)",
      "shadowOffset": {
        "width": 0,
        "height": 0
      },
      "shadowRadius": 30,
      "shadowColor": "rgba(150, 255, 246, 0.7)",
      "shadowOpacity": 1,
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
        "shadowOffset": {
          "width": 0,
          "height": 0
        },
        "shadowRadius": 30,
        "shadowColor": "rgba(255, 255, 255, 0.7)",
        "shadowOpacity": 1,
        "borderWidth": 1,
        "borderColor": "#777777",
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
