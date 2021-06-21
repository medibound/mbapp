import React, {Component} from 'react'
import { Text, View, Button, StatusBar, StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';



class Users extends Component {
    render() {
        return(
            <View style={{height: "100%", width: "100%", backgroundColor: "white", paddingBottom: 5}}>
                <SafeAreaView style={webStyles.body}>
                    <Text>Bruh</Text>
                    <StatusBar style="auto" backgroundColor="rgb(68, 199, 188)" barStyle="dark-content" />
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
});


export default Users;
