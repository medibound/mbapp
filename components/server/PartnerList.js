import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef, useState, useCallback} from 'react';
import { StyleSheet, Appearance, Text, Image, TextInput, View, ImageBackground, Dimensions, Easing, SafeAreaView, Keyboard, Animated, TouchableWithoutFeedback, TouchableHighlight, Pressable, RefreshControl,ScrollView} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faMailBulk, faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-elements';


import firebase from 'firebase';
import { Objects } from '..';

var webStyles;
var Colors;




var isset = false;
var refreshing = false;

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }


export default class PartnerList extends Component {

    __isMounted = true;


    constructor(props) {
      super(props)
      this.state = {
        deviceArray: [],
        approved: [],
        colors: Appearance.getColorScheme(),
            colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
      };


      

    }

    componentDidUpdate(prevProps) {
        if (prevProps.search !== this.props.search) {
          this.listPartners();
        }
      }

    async componentDidMount() {
        this.listPartners();

        Appearance.addChangeListener(this.onAppThemeChanged);

        const db = firebase.firestore();

        this.__isMounted = true;


        if (true) {
            const observer = db.collection('users').where('accounttype',"==",1).onSnapshot(docSnapshot => {
                    console.log('reload');                        
                    if (docSnapshot.size != 0 && this.props.search != "") {
                        var idArray = [];
                        docSnapshot.forEach(d => {
                            if ( String(d.data().username).toLowerCase().includes(String(this.props.search).toLowerCase()) ) {
                                let approved = false;
                        
                        if (d.data().approved != null || d.data().approved != undefined) {
                            d.data().approved.forEach( a=> {
                                if (a == firebase.auth().currentUser.uid) {
                                    approved = true;
                                }
                            })
                        }
                        
                        idArray.push([d.id, d.data().username, approved]);
                        console.log(approved);
                            }
                        })
                        console.log(idArray)
                        this.setState({deviceArray: idArray})
                    }
                    else {
                        this.setState({deviceArray: []})
                    }
                    isset = true;

            });

            const observer2 = db.collection('users').where("approved", "array-contains", firebase.auth().currentUser.uid).onSnapshot(docSnapshot => {
                    let array = []
                    docSnapshot.forEach(d => {

                        let approved = false;
                        
                        if (d.data().approved != null || d.data().approved != undefined) {
                            d.data().approved.forEach( a=> {
                                if (a == firebase.auth().currentUser.uid) {
                                    approved = true;
                                }
                            })
                        }

                        array.push([d.id, d.data().username, approved]);
                    })

                    this.setState({approved: array});
                    console.log("New" + array);           
            });

        }

    }

    componentWillUnmount() {

        Appearance.addChangeListener(this.onAppThemeChanged);


        const db = firebase.firestore();


        if (isset != true) {
            const observer = db.collection('users').where('accounttype',"==",1).onSnapshot(docSnapshot => {
                console.log('reload');                        
                if (docSnapshot.size != 0 && this.props.search != "") {
                    var idArray = [];
                    docSnapshot.forEach(d => {
                        if ( String(d.data().username).toLowerCase().includes(String(this.props.search).toLowerCase()) ) {
                            let approved = false;
                        
                        if (d.data().approved != null || d.data().approved != undefined) {
                            d.data().approved.forEach( a=> {
                                if (a == firebase.auth().currentUser.uid) {
                                    approved = true;
                                }
                            })
                        }
                        
                        idArray.push([d.id, d.data().username, approved]);
                        console.log(approved);
                        }
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

    onAppThemeChanged = (theme) => {
        const currentTheme = Appearance.getColorScheme();
        this.setState({colors: currentTheme});
        this.setState({colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)})
      };

    async queryData(category, db, search) {
        let data = null;
        while (data == null) {
            data = await db.collection(category).where('accounttype',"==",1).get();
        }
        var result = parseInt(data.size);
        console.log(result);
    
        return data;
    
    }

    listPartners() {

        const db = firebase.firestore();
        
        this.queryData("users", db, 1).then((doc) => {
            if (doc.size != 0) {
                var idArray = [];
                doc.forEach(d => {
                    if ( String(d.data().username).toLowerCase().includes(String(this.props.search).toLowerCase()) && this.props.search != "") {
                        let approved = false;
                        
                        if (d.data().approved != null || d.data().approved != undefined) {
                            d.data().approved.forEach( a=> {
                                if (a == firebase.auth().currentUser.uid) {
                                    approved = true;
                                }
                            })
                        }
                        
                        idArray.push([d.id, d.data().username, approved]);
                        console.log(d.data().approved + " " + approved);
                    }
                    
                })
                console.log(idArray)
                this.setState({deviceArray: idArray})
            }
            else {
                this.setState({deviceArray: []})
            }
        });

        

    }

    async approvePartner(uid) {
        const db = firebase.firestore();
        const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
        const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
        console.log("hello")
        db.collection('users').doc(uid).update({
            approved: arrayUnion(firebase.auth().currentUser.uid)
        })
        db.collection('users').doc(firebase.auth().currentUser.uid).update({
            approved: arrayUnion(uid)
        })
        /*await db.collection('users').doc(uid).get((d)=> {
            let approvedBool = false;
            if (d.data().approved != null || d.data().approved != undefined) {
                d.data().approved.forEach( a=> {
                    if (a == firebase.auth().currentUser.uid) {
                        approvedBool = true;
                    }
                })
            }

            if (approvedBool == true ) {
                db.collection('users').doc(uid).update({
                    approved: arrayRemove(firebase.auth().currentUser.uid)
                })
                console.log("true")

            }
            else {
                
                console.log("false")

            }
        })*/

        
    }
    async disapprovePartner(uid) {
        const db = firebase.firestore();
        const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
        const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
        console.log("hello")
        db.collection('users').doc(uid).update({
            approved: arrayRemove(firebase.auth().currentUser.uid)
        })
        db.collection('users').doc(firebase.auth().currentUser.uid).update({
            approved: arrayRemove(uid)
        })
        
    }

    openDeviceOptions(val, id,) {
        this.props.pass(val, id)
    }

    onRefresh() {
        refreshing = true;
        const db = firebase.firestore();

        db.collection('users').where('accounttype',"==",1).get(docSnapshot => {
            console.log('reload');                        
            if (docSnapshot.size != 0 && this.props.search != "") {
                var idArray = [];
                docSnapshot.forEach(d => {
                    if ( String(d.data().username).toLowerCase().includes(String(this.props.search).toLowerCase()) ) {
                        let approved = false;
                        
                        if (d.data().approved != null || d.data().approved != undefined) {
                            d.data().approved.forEach( a=> {
                                if (a == firebase.auth().currentUser.uid) {
                                    approved = true;
                                }
                            })
                        }
                        
                        idArray.push([d.id, d.data().username, approved]);
                        console.log(approved);
                    }
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

        Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
        styles = setStyle(Colors);

        
        if (this.state.deviceArray.length != 0 && this.props.search != "") {
            return (
                <>
                <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            tintColor={Colors.lighterText}
                            onRefresh={()=> {this.onRefresh()}}
                        />
                }>
                    <View style={{marginTop: 10, padding: 15, paddingBottom: 0,}} >
                        <Text style={{color: "#888888", textAlign: "center",fontSize: 12, paddingBottom: 10, borderBottomColor: Colors.backgroundLightColor, borderBottomWidth: 1, marginBottom: 10}}>SEARCH RESULTS FOR: "{this.props.search}"</Text>
                        {
                            this.state.deviceArray.map(d => {
                                return(<>
                                    <View style={{borderRadius: 10, overflow: "hidden", marginBottom: 7.5,}}><Pressable android_ripple={{color: '#aaaaaa', borderless: false}}  style={{ borderRadius: 10,"backgroundColor": Colors.backgroundColor, borderColor: Colors.backgroundLightColor, borderWidth: 1.5,}} >
                                        <View style={styles.device}>
                                        <View style={{flexDirection:"row",color: "#777777", alignItems: "center"}}>
                                                <Image
                                                    style={{width: 45, height: 45,  backgroundColor: Colors.secondaryColor, borderRadius: 30}}
                                                />
                                                <Text style={{fontWeight:"bold", color: "#fff", marginLeft: 10}}></Text><Text style={{color: Colors.lighterText, fontSize: 14, maxWidth: 150,}}>{d[1]}</Text><Ionicons name={"checkmark-circle"} size={16} color={Colors.barColor} style={{marginLeft: 5}}/></View>
                                        </View>
                                        <Button title={d[2] ? "Approved" : "Approve"} onPress={() => {d[2] ? this.disapprovePartner(d[0]) : this.approvePartner(d[0])}} containerStyle={{position: "absolute",top: 10, right: 10,}}  buttonStyle={d[2] ? styles.disapproveButton : styles.approveButton} titleStyle={d[2] ? {color: Colors.lighterText} : {color: Colors.lighterText}} icon={d[2]  ? <Ionicons name={"checkmark-outline"} size={20} style={{marginRight: 5}} color={Colors.lightText}/> : null}></Button>
                
                                    </Pressable></View>
                
                                    </>);
                            })
                        }
                        <View style={{height: 180, width: "100%"}}></View>

                    </View>
                </ScrollView>
                </>
            );
        }
        else if (this.state.approved.length != 0 && this.props.search == "") {
            return (
                <>
                <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            tintColor={Colors.lighterText}
                            onRefresh={()=> {this.onRefresh()}}
                        />
                }>
                    <View style={{marginTop: 10, padding: 15, paddingBottom: 0,}} >
                        <Text style={{color: "#888888", textAlign: "center",fontSize: 12, paddingBottom: 10, borderBottomColor: Colors.backgroundLightColor, borderBottomWidth: 1, marginBottom: 10}}>APPROVED PARTNERS ({this.state.approved.length})</Text>
                        {
                            this.state.approved.map(d => {
                                return(<>
                                    <View style={{borderRadius: 10, overflow: "hidden", marginBottom: 7.5,}}><Pressable android_ripple={{color: '#aaaaaa', borderless: false}}  style={{ borderRadius: 10,"backgroundColor": Colors.backgroundColor, borderColor: Colors.backgroundLightColor, borderWidth: 1.5,}} >
                                        <View style={styles.device}>
                                            <View style={{flexDirection:"row",color: "#777777", alignItems: "center"}}>
                                                <Image
                                                    style={{width: 45, height: 45,  backgroundColor: Colors.secondaryColor, borderRadius: 30}}
                                                />
                                                <Text style={{fontWeight:"bold", color: "#fff", marginLeft: 10,}}></Text><Text style={{color: Colors.lighterText, fontSize: 14,  maxWidth: 150,}}>{d[1]}</Text><Ionicons name={"checkmark-circle"} size={16} color={Colors.barColor} style={{marginLeft: 5}}/></View>
                                        </View>
                                        <Button title={d[2] ? "Approved" : "Approve"} onPress={() => {d[2] ? this.disapprovePartner(d[0]) : this.approvePartner(d[0])}} containerStyle={{position: "absolute",top: 10, right: 10,}}  buttonStyle={d[2] ? styles.disapproveButton : styles.approveButton} titleStyle={d[2] ? {color: Colors.lighterText} : {color: Colors.lighterText}} icon={d[2]  ? <Ionicons name={"checkmark-outline"} size={20} style={{marginRight: 5}} color={Colors.lightText}/> : null}></Button>
                
                                    </Pressable></View>
                
                                    </>);
                            })
                        }
                        <View style={{height: 180, width: "100%"}}></View>
                    </View>
                </ScrollView>
                </>
            );
        }
        else if (this.props.search != "") {
            return (
                <>
                <ScrollView contentContainerStyle={{width: "100%", height: "100%",}} refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            tintColor={Colors.lighterText}
                            onRefresh={()=> {this.onRefresh()}}
                        />
                }>
                <View style={{marginTop: 10, padding: 15}} >
                    <Text style={{color: "#888888", textAlign: "center",fontSize: 12, paddingBottom: 10, borderBottomColor: Colors.backgroundLightColor, borderBottomWidth: 1, marginBottom: 10}}>NO RESULTS FOR: "{this.props.search}"</Text>
                    </View>
                    <View style={{width: "100%", height: "68%", justifyContent: "center", alignItems: "center", }}>
                        <Ionicons name="search-circle" size={70} color="#777777" style={{marginBottom: 10}}/>
                        <Text style={{fontWeight: "300", color: "#777777", textTransform: "uppercase"}}>
                            No Medical Partners
                        </Text>

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
                            tintColor={Colors.lighterText}
                            onRefresh={()=> {this.onRefresh()}}
                        />
                }>
                    <View style={{width: "100%", height: "90%", justifyContent: "center", alignItems: "center", }}>
                        <Ionicons name="search-circle" size={70} color="#777777" style={{marginBottom: 10}}/>
                        <Text style={{fontWeight: "300", color: "#777777", textTransform: "uppercase"}}>
                            Search Medical Partners
                        </Text>

                    </View>
                </ScrollView>
                </>
            );
        }
    }

    
}
function setStyle(Colors) {

    return StyleSheet.create({
        device: {
            fontWeight: "700",
            fontSize: 12,
            color: "#888888",
            width: "100%",
            height: 60,
            padding: 0,
            paddingLeft: 10,
            paddingRight: 10,
            justifyContent: "center",
            overflow: "visible",
            backgroundColor: Colors.backgroundLightColor
        },
        approveButton: {
            backgroundColor: Colors.backgroundColor,
            color: Colors.backgroundLightColor,
            width: 100,
            borderRadius: 10,
            zIndex: 100,
            height: 40,
            fontSize: 11,
            overflow: "visible"
        },
        disapproveButton: {
            backgroundColor: Colors.backgroundColor,
            color: Colors.lightColor,
            width: 130,
            height: 40,
            borderRadius: 10,
            zIndex: 100,
            fontSize: 11,
            overflow: "visible"
        }
    });

}