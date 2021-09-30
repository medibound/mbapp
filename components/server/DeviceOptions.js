import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef} from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Text, TextInput, View, ImageBackground, Dimensions, Easing, SafeAreaView, Keyboard, Animated} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faMailBulk, faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';


export default class DeviceOptions extends Component {


    constructor(props) {
      super(props)
      this.state = {
      };
    }

    removeDevice(){
        const db = firebase.firestore();
        db.collection("devices").doc(this.props.deviceID).update({
            linked: null,
        }).then(d => {
            this.props.pass(0);
        })
    }


    render() {

        return(
            <>
            <View style={styles.option}>
                <Text style={styles.optionHeader}><Text style={{fontWeight: "700"}}>Device ID: </Text>{this.props.deviceID}</Text>
                <Button buttonStyle={styles.optionButton} titleStyle={{color: "#777777",justifyContent: "flex-start",}} title="Access Device Information"></Button>
                <Button buttonStyle={styles.optionButton} titleStyle={{color: "#d36e6e",justifyContent: "flex-start",}} onPress={() => {this.removeDevice()}} title="Remove Device"></Button>
            </View>
            </>

        );
    }

    
}

var styles = StyleSheet.create({
    option: {
        justifyContent: "center",
    },
    optionHeader: {
        backgroundColor: "transparent",
        color: "#777777",
        marginLeft: 10,
        marginRight: 10,
        padding: 20,
        justifyContent: "flex-start",
        height: 60,
        borderBottomColor: "#dddddd",
        borderBottomWidth: 1,
    },
    optionButton: {
        backgroundColor: "transparent",
        color: "#d36e6e",
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: "flex-start",
        height: 45,
    }
});