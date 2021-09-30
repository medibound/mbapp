import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef} from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Text, TextInput, View, ImageBackground, Dimensions, Easing, SafeAreaView, Keyboard, Animated} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faMailBulk, faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';




export default class CodeTap extends Component {


    constructor(props) {
      super(props)
      this.state = {
        fadeError: new Animated.Value(0),
      };
    }


    setFocus1 (input1) {
        this.setState({input1});
      }
    
    setFocus2 (input2) {
        this.setState({input2});
    }
    
    setFocus3 (input3) {
        this.setState({input3});
    }
    
    setFocus4 (input4) {
        this.setState({input4});
    }
      
    setFocus5 (input5) {
        this.setState({input5});
    }
    
    setFocus6 (input6) {
        this.setState({input6});
    }

    async queryData(category, db, search) {
        let data = null;
        while (data == null) {
            data = await db.collection(category).where('code',"==",search).get();
        }
        var result = parseInt(data.size);
        console.log(result);
    
        return data;
    
    }

    async queryAcc(category, db, search) {
        let data = null;
        while (data == null) {
            data = await db.collection(category).where('linked',"==",search).get();
        }
        var result = parseInt(data.size);
        console.log(result);
    
        return data;
    
    }

    verifyCode(code) {

        const db = firebase.firestore();

        this.queryData("devices", db, code).then((doc) => {
            if (doc.size != 0) {
                var docID= "";

                doc.forEach(res => {
                    docID = res.id;
                })

                this.queryAcc("devices", db, firebase.auth().currentUser.uid).then((doc) => {
                    doc.forEach(res => {
                        docID = res.id;

                        db.collection("devices").doc(docID).update({
                            code: null,
                            linked: null,
                        });
                    })
                });

                db.collection("devices").doc(docID).update({
                    code: null,
                    linked: firebase.auth().currentUser.uid,
                    lastUpdated: firebase.firestore.Timestamp.now(),
                });
                this.props.pass(0);
            }
            else {
                Animated.timing(this.state.fadeError, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
            }
        });

           
    }


    render() {


    
      return (
        <>
        <View style={styles.body}>
        
        </View>
        </>
      );
    }

    
}

var styles = StyleSheet.create({
    body: {
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        alignContent: "center",
        padding: 20,
    },
    
});