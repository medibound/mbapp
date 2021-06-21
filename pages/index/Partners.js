import React, {Component} from 'react'
import { Text, View, Button, StatusBar, Platform, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Partners extends Component {
    render() {
        return(
            <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
                <View style={{height: "100%", width: "100%", backgroundColor: "white", paddingBottom: 5}}>
                    <SafeAreaView style={webStyles.body}>
                        <Ionicons name="search" size={20} style={webStyles.searchIcon}/>
                        <TextInput style={webStyles.searchInput} placeholder="Search Partners..."></TextInput>
                        <Text>Bruh</Text>
                        <StatusBar style="auto" backgroundColor="rgb(68, 199, 188)" barStyle="dark-content" />
                    </SafeAreaView>
                </View>
            </TouchableWithoutFeedback>
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
        paddingHorizontal: 15, 
        paddingTop: 10,
    },
    searchInput: {
        "marginBottom": 10,
        "paddingTop": 2.5,
        "paddingRight": 2.5,
        "paddingBottom": 2.5,
        "paddingLeft": 40,
        "backgroundColor": "white",
        "borderWidth": 0,
        "borderColor": "#b0b4b3",
        "borderWidth": 1,
        "borderStyle": "solid",
        borderRadius: 7,
        "width": "100%",
        "height": 50,
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
        "top": 36,
        "marginTop":-15,
        "alignSelf": "flex-start",
        "color": "#b0b4b3",
        elevation:6,
      },
});


export default Partners;
