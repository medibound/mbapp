import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef, useState, useCallback} from 'react';
import { StyleSheet, Text, TextInput, View, ImageBackground, Dimensions, Easing, SafeAreaView, Keyboard, Animated, TouchableWithoutFeedback, TouchableHighlight, Pressable, RefreshControl,ScrollView} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faMailBulk, faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';

const Device = ({label}) => {
    label = label;
    return (
        <>
            <View style={styles.device}>
                <View style={{flexDirection:"row",color: "#777777"}}><Text style={{fontWeight:"bold", color: "#777777"}}>{"Device ID: "}</Text><Text style={{color: "#777777"}}>{label}</Text></View>
            </View>
        </>
    );
}

var isset = false;
var refreshing = false;

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }


export default class DeviceList extends Component {

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


        if (isset != true && this.__isMounted == true) {
            const observer = db.collection('devices').orderBy('lastUpdated', 'desc').where('linked',"==",firebase.auth().currentUser.uid).onSnapshot(docSnapshot => {
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
                    isset = true;

            });
        }

    }

    componentWillUnmount() {

        const db = firebase.firestore();


        if (isset != true && this.__isMounted == true) {
            const observer = db.collection('devices').orderBy('lastUpdated', 'desc').where('linked',"==",firebase.auth().currentUser.uid).onSnapshot(docSnapshot => {
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
                    isset = true;

            });
        }
        this.__isMounted = false;
    }

    async queryData(category, db, search) {
        let data = null;
        while (data == null) {
            data = await db.collection(category).where('linked',"==",search).orderBy('lastUpdated', 'desc').get();
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

    openDeviceOptions(val, id,) {
        this.props.pass(val, id)
    }

    onRefresh() {
        refreshing = true;
        const db = firebase.firestore();

        db.collection('devices').orderBy('lastUpdated', 'desc').where('linked',"==",firebase.auth().currentUser.uid).onSnapshot(docSnapshot => {
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
        refreshing = false;
    }


    render() {

        
        if (this.state.deviceArray.length != 0) {
            return (
                <>
                <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={()=> {this.onRefresh()}}
                        />
                }>
                    <View style={{marginTop: 20, backgroundColor: "white", borderTopColor: "#dddddd", borderTopWidth: 1}} >
                        {
                            this.state.deviceArray.map(d => {
                                return(<Pressable key={d} android_ripple={{color: '#aaaaaa', borderless: false}} onLongPress={()=>{this.openDeviceOptions(1, d)}}><Device  label={d} ></Device></Pressable>);
                            })
                        }
                    </View>
                </ScrollView>
                </>
            );
        }
        else {
            return (
                <>
                <ScrollView contentContainerStyle={{width: "100%", height: "100%",}} refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={()=> {this.onRefresh()}}
                        />
                }>
                    <View style={{width: "100%", height: "90%", justifyContent: "center", alignItems: "center", }}>
                        <Ionicons name="cloud" size={50} color="#777777" style={{marginBottom: 10}}/>
                        <Text style={{fontWeight: "300", color: "#777777", textTransform: "uppercase"}}>
                            No Devices Connected
                        </Text>

                    </View>
                </ScrollView>
                </>
            );
        }
    }

    
}

var styles = StyleSheet.create({
    device: {
        "backgroundColor": "transparent",
        fontWeight: "700",
        color: "#777777",
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