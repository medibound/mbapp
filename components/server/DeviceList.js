import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef} from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Text, TextInput, View, ImageBackground, Dimensions, Easing, SafeAreaView, Keyboard, Animated} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faMailBulk, faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';

const Device = ({label}) => {
    label = label;
    return (
        <>
        <View style={styles.device}>
            <View style={{flexDirection:"row"}}><Text style={{fontWeight:"bold"}}>{"Device ID: "}</Text><Text>{label}</Text></View>
        </View>
        </>
    );
}

var isset = false;


export default class BottomTab extends Component {

    __isMounted = true;


    constructor(props) {
      super(props)
      this.state = {
        deviceArray: [],
      };
    }

    async componentDidMount() {
        this.listDevices();

        const db = firebase.firestore();

        this.__isMounted = true;


        if (isset != true) {
            const observer = db.collection('devices').where('linked',"==",firebase.auth().currentUser.uid).onSnapshot(docSnapshot => {
                    console.log('reload');                        
                    if (docSnapshot.size != 0) {
                        var idArray = [];
                        docSnapshot.forEach(d => {
                            idArray.push(d.id);
                        })
                        console.log(idArray)
                        this.setState({deviceArray: idArray})
                    }
                    else {
                        this.setState({deviceArray: []})
                    }
            });
            isset = true;
        }

    }

    componentWillUnmount() {
        this.__isMounted = false;
    }

    async queryData(category, db, search) {
        let data = null;
        while (data == null) {
            data = await db.collection(category).where('linked',"==",search).get();
        }
        var result = parseInt(data.size);
        console.log(result);
    
        return data;
    
    }

    listDevices() {

        const db = firebase.firestore();

        this.queryData("devices", db, firebase.auth().currentUser.uid).then((doc) => {
            if (doc.size != 0) {
                var idArray = [];
                doc.forEach(d => {
                    idArray.push(d.id);
                })
                console.log(idArray)
                this.setState({deviceArray: idArray})
            }
            else {
                this.setState({deviceArray: []})
            }
        });

        

    }


    render() {


        
        if (this.state.deviceArray.length != 0) {
            return (
                <>
                <View style={{marginTop: 20, backgroundColor: "white", borderTopColor: "#dddddd", borderTopWidth: 1}}>
                    {
                        this.state.deviceArray.map(d => {
                            return(<Device key={d} label={d}></Device>);
                        })
                    }
                </View>
                </>
            );
        }
        else {
            return (
                <>
                <Text>No Devices Connected</Text>
                </>
            );
        }
    }

    
}

var styles = StyleSheet.create({
    device: {
        "backgroundColor": "transparent",
        fontWeight: "700",
        width: "100%",
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
        height: 80,
        padding: 0,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: "center",
        overflow: "visible",
    }
});