import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef} from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Text, TextInput, View, ImageBackground, Dimensions, Easing, SafeAreaView, Keyboard, Animated} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faMailBulk, faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';

var buttonEnabled = true;

var i1 = "";
var i2 = "";
var i3 = "";
var i4 = "";
var i5 = "";
var i6 = "";

var i1p = "";
var i2p = "";
var i3p = "";
var i4p = "";
var i5p = "";
var i6p = "";


export default class CodeVerify extends Component {


    constructor(props) {
      super(props)
      this.state = {
        fadeError: new Animated.Value(0),
        inputAll: false,
        input1: false,
        input2: false,
        input3: false,
        input4: false,
        input5: false,
        input6: false,
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

    verifyCode() {
        var code = "";

        code = i1 + i2 + i3 + i4 + i5 + i6;

        this.refs['1'].clear();
        this.refs['2'].clear();
        this.refs['3'].clear();
        this.refs['4'].clear();
        this.refs['5'].clear();
        this.refs['6'].clear();
        this.refs['1'].focus();
        i1 = "";
        i2 = "";
        i3 = "";
        i4 = "";
        i5 = "";
        i6 = "";
        buttonEnabled = true;

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
            <Text style={{ fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", color: "#99a1a8", marginBottom: 10, fontSize: 11}}>Enter Device Code Below:</Text>
            <View style={styles.code}>
                <TextInput 
                    style={this.state.input1 ? styles.codeInputFocus : styles.codeInput}
                    onFocus={this.setFocus1.bind(this, true)}
                    onBlur={this.setFocus1.bind(this, false)}
                    ref="1"
                    maxLength={1}
                    onChangeText={(val) => {
                        i1p = i1;
                        i1 = val;
                        if (val.trim()  == "") {

                        }
                        else {
                            this.refs["2"].focus();
                            if (i1.trim() != "" && i2.trim() != "" && i3.trim() != "" && i4.trim() != "" && (i5.trim() != "" || i6.trim() != "")) {
                                buttonEnabled = false;
                            }
                            Animated.timing(this.state.fadeError, {
                                toValue: 0,
                                duration: 10,
                                useNativeDriver: true,
                            }).start();
                        }
                    }}
                ></TextInput>
                <TextInput 
                    style={this.state.input2 ? styles.codeInputFocus : styles.codeInput}
                    onFocus={this.setFocus2.bind(this, true)}
                    onBlur={this.setFocus2.bind(this, false)}
                    ref="2"
                    maxLength={1}
                    onChangeText={(val) => {
                        i2p = i2;
                        i2 = val;
                        if (val.trim()  == "") {

                        }
                        else {
                            this.refs["3"].focus();
                            if (i1.trim() != "" && i2.trim() != "" && i3.trim() != "" && i4.trim() != "" && (i5.trim() != "" || i6.trim() != "")) {
                                buttonEnabled = false;
                            }
                            Animated.timing(this.state.fadeError, {
                                toValue: 0,
                                duration: 10,
                                useNativeDriver: true,
                            }).start();
                        }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            if (i2p != "") {
                                i2p = "";
                            }
                            else {
                                this.refs["1"].focus();
                            }
                        }
                    }}
                ></TextInput>
                <TextInput 
                    style={this.state.input3 ? styles.codeInputFocus : styles.codeInput}
                    onFocus={this.setFocus3.bind(this, true)}
                    onBlur={this.setFocus3.bind(this, false)}
                    ref="3"
                    maxLength={1}
                    onChangeText={(val) => {
                        i3p = i3;
                        i3 = val;
                        if (val.trim()  == "") {

                        }
                        else {
                            this.refs["4"].focus();
                            if (i1.trim() != "" && i2.trim() != "" && i3.trim() != "" && i4.trim() != "" && (i5.trim() != "" || i6.trim() != "")) {
                                buttonEnabled = false;
                            }
                            Animated.timing(this.state.fadeError, {
                                toValue: 0,
                                duration: 10,
                                useNativeDriver: true,
                            }).start();
                        }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            if (i3p != "") {
                                i3p = ""
                            }
                            else {
                                this.refs["2"].focus();}
                        }
                    }}
                ></TextInput>
                <TextInput 
                    style={this.state.input4 ? styles.codeInputFocus : styles.codeInput}
                    onFocus={this.setFocus4.bind(this, true)}
                    onBlur={this.setFocus4.bind(this, false)}
                    ref="4"
                    maxLength={1}
                    onChangeText={(val) => {
                        i4p = i4;
                        i4 = val;
                        if (val.trim()  == "") {

                        }
                        else {
                            this.refs["5"].focus();
                            if (i1.trim() != "" && i2.trim() != "" && i3.trim() != "" && i4.trim() != "" && (i5.trim() != "" || i6.trim() != "")) {
                                buttonEnabled = false;
                            }
                            Animated.timing(this.state.fadeError, {
                                toValue: 0,
                                duration: 10,
                                useNativeDriver: true,
                            }).start();
                        }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            if (i4p != "") {
                                i4p = ""
                            }
                            else {
                                this.refs["3"].focus();}
                        }
                    }}
                ></TextInput>
                <TextInput 
                    style={this.state.input5 ? styles.codeInputFocus : styles.codeInput}
                    onFocus={this.setFocus5.bind(this, true)}
                    onBlur={this.setFocus5.bind(this, false)}
                    ref="5"
                    maxLength={1}
                    onChangeText={(val) => {
                        i5p = i5;
                        i5 = val;
                        if (val.trim()  == "") {

                        }
                        else {
                            this.refs["6"].focus();
                            if (i1.trim() != "" && i2.trim() != "" && i3.trim() != "" && i4.trim() != "" && (i5.trim() != "" || i6.trim() != "")) {
                                buttonEnabled = false;
                            }
                            Animated.timing(this.state.fadeError, {
                                toValue: 0,
                                duration: 10,
                                useNativeDriver: true,
                            }).start();
                        }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            if (i5p != "") {
                                i5p = ""
                            }
                            else {
                                this.refs["4"].focus();}
                        }
                    }}
                ></TextInput>
                <TextInput 
                    style={this.state.input6 ? styles.codeInputFocus : styles.codeInput} 
                    onFocus={this.setFocus6.bind(this, true)}
                    onBlur={this.setFocus6.bind(this, false)}
                    ref="6"
                    maxLength={1}
                    autoCapitalize="characters"
                    onChangeText={(val) => {
                        i6p = i6;
                        i6 = val;
                        if (val.trim()  == "") {

                        }
                        else {
                            if (i1.trim() != "" && i2.trim() != "" && i3.trim() != "" && i4.trim() != "" && (i5.trim() != "" || i6.trim() != "")) {
                                buttonEnabled = false;
                            }
                            Animated.timing(this.state.fadeError, {
                                toValue: 0,
                                duration: 10,
                                useNativeDriver: true,
                            }).start();
                        }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            if (i6p != "") {
                                i6p = ""
                            }
                            else {
                                this.refs["5"].focus();}
                        }
                    }}
                ></TextInput>
                
            </View>

            <Animated.View style={[styles.error, {opacity: this.state.fadeError}, {display: this.state.displayError}]} >
                <FontAwesomeIcon style={styles.errorIcon} icon={ faExclamationCircle } />
                <Text style={{color: "white", fontWeight: "400",padding: 5}}>{"This Code is Invalid. Ensure Your Code is Correct."}</Text>
            </Animated.View>
            
            <Button titleStyle={{fontWeight: "600", color: "#121212", fontSize:16,justifyContent:"center",alignContent:"center"}} containerStyle={styles.codeButtonContainer} buttonStyle={styles.codeButton} 
                  title="ADD DEVICE"
                  onPress={() => this.verifyCode()}
                  color="transparent"
                  disabledStyle={{
                      backgroundColor: "#121212",
                      borderColor: "#444444",
                      borderWidth: 1,
                    }}
                  disabledTitleStyle={{
                      color: "#444444",
                  }}
                  disabled={buttonEnabled}
                  />

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
    code: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        
    },
    codeInput: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        textAlign: 'center',
        fontSize: 40,
        fontWeight: "700",
        "borderColor": "#dae0df",
        "borderWidth": 1,
        "borderStyle": "solid",
        borderRadius: 5,
        width: 55,
        height: 60,
        color: "#00ff79",
    },
    codeInputFocus: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        textAlign: 'center',
        fontSize: 40,
        fontWeight: "700",
        "borderColor": "#00ff79",
        "borderWidth": 1,
        "borderStyle": "solid",
        borderRadius: 5,
        width: 55,
        height: 60,
        color: "#00ff79",
    },
    codeButton: {
        "paddingTop": 2.5,
        "paddingRight": 2.5,
        "paddingBottom": 2.5,
        "paddingLeft": 2.5,
        "backgroundColor": "#00ff79",
        "borderWidth": 0,
        "borderColor": "black",
        "borderStyle": "solid",
        "color": "#121212",
        "fontFamily": "sfd",
        "fontSize": 13,
        "fontWeight": "400",
        borderRadius: 5,
        marginTop: 10,
        "width": "100%",
        "height": 45
        
    },
    codeButtonContainer: {
        width: "100%"
    },
    error: {
        display: "none",
        "justifyContent" : "center",
        "paddingLeft": 35,
        "backgroundColor": "#d36e6e",
        "textAlign": "left",
        "lineHeight": 25,
        "borderWidth": 0,
        "borderColor": "black",
        "borderStyle": "solid",
        marginTop: 10,
        borderRadius: 5,
        "width": "100%",
        "height": "auto",
        "color": "white",
        "overflow": "hidden",
        "fontFamily": "sfd-light",
        "fontWeight": "400"
      },
  
      errorIcon: {
        "width": 13,
        "zIndex": 2,
        "position": "absolute",
        "top" : 6,
        "left" : 10,
        "color": "white"
      },
});