import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef, useState, useCallback} from 'react';
import { StyleSheet, Text, Image, TextInput, View, ImageBackground, Dimensions, Easing, SafeAreaView, Keyboard, Animated, TouchableWithoutFeedback, TouchableHighlight, Pressable, RefreshControl,ScrollView} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faMailBulk, faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-elements';


import firebase from 'firebase';



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
      };


      

    }

    componentDidUpdate(prevProps) {
        if (prevProps.search !== this.props.search) {
          this.listPartners();
        }
      }

    async componentDidMount() {
        this.listPartners();

        const db = firebase.firestore();

        this.__isMounted = true;


        if (isset != true && this.__isMounted == true) {
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

        const db = firebase.firestore();


        if (isset != true && this.__isMounted == true) {
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

    

        
        if (this.state.deviceArray.length != 0 && this.props.search != "") {
            return (
                <>
                <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={()=> {this.onRefresh()}}
                        />
                }>
                    <View style={{marginTop: 10, padding: 10}} >
                        <Text style={{color: "#888888", textAlign: "center",fontSize: 12, paddingBottom: 10, borderBottomColor: "#222222", borderBottomWidth: 1, marginBottom: 10}}>SEARCH RESULTS FOR: "{this.props.search}"</Text>
                        {
                            this.state.deviceArray.map(d => {
                                return(<>
                                    <View style={{borderRadius: 10, overflow: "hidden", marginBottom: 5,}}><Pressable android_ripple={{color: '#aaaaaa', borderless: false}}  style={{ borderRadius: 10,"backgroundColor": "#121212", borderColor: "#222222", borderWidth: 1.5,}} >
                                        <View style={styles.device}>
                                        <View style={{flexDirection:"row",color: "#777777", alignItems: "center"}}>
                                                <Image
                                                    style={{width: 45, height: 45,  backgroundColor: "#004030", borderRadius: 30}}
                                                />
                                                <Text style={{fontWeight:"bold", color: "#fff", marginLeft: 10}}></Text><Text style={{color: "#ddd", fontSize: 14}}>{d[1]}</Text><Ionicons name={"checkmark-circle"} size={16} color={"#00d6a1"} style={{marginLeft: 5}}/></View>
                                        </View>
                                        <Button title={d[2] ? "Approved" : "Approve"} onPress={() => {d[2] ? this.disapprovePartner(d[0]) : this.approvePartner(d[0])}} containerStyle={{position: "absolute",top: 10, right: 10,}}  buttonStyle={d[2] ? styles.disapproveButton : styles.approveButton} titleStyle={d[2] ? {color: "#ddd"} : {color: "#ddd"}} icon={d[2]  ? <Ionicons name={"checkmark-outline"} size={20} style={{marginRight: 5}} color="#ddd"/> : null}></Button>
                
                                    </Pressable></View>
                
                                    </>);
                            })
                        }
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
                            onRefresh={()=> {this.onRefresh()}}
                        />
                }>
                    <View style={{marginTop: 10, padding: 10}} >
                        <Text style={{color: "#888888", textAlign: "center",fontSize: 12, paddingBottom: 10, borderBottomColor: "#222222", borderBottomWidth: 1, marginBottom: 10}}>APPROVED PARTNERS ({this.state.approved.length})</Text>
                        {
                            this.state.approved.map(d => {
                                return(<>
                                    <View style={{borderRadius: 10, overflow: "hidden", marginBottom: 5,}}><Pressable android_ripple={{color: '#aaaaaa', borderless: false}}  style={{ borderRadius: 10,"backgroundColor": "#121212", borderColor: "#222222", borderWidth: 1.5,}} >
                                        <View style={styles.device}>
                                            <View style={{flexDirection:"row",color: "#777777", alignItems: "center"}}>
                                                <Image
                                                    style={{width: 45, height: 45,  backgroundColor: "#004030", borderRadius: 30}}
                                                />
                                                <Text style={{fontWeight:"bold", color: "#fff", marginLeft: 10}}></Text><Text style={{color: "#ddd", fontSize: 14}}>{d[1]}</Text><Ionicons name={"checkmark-circle"} size={16} color={"#00d6a1"} style={{marginLeft: 5}}/></View>
                                        </View>
                                        <Button title={d[2] ? "Approved" : "Approve"} onPress={() => {d[2] ? this.disapprovePartner(d[0]) : this.approvePartner(d[0])}} containerStyle={{position: "absolute",top: 10, right: 10,}}  buttonStyle={d[2] ? styles.disapproveButton : styles.approveButton} titleStyle={d[2] ? {color: "#ddd"} : {color: "#ddd"}} icon={d[2]  ? <Ionicons name={"checkmark-outline"} size={20} style={{marginRight: 5}} color="#ddd"/> : null}></Button>
                
                                    </Pressable></View>
                
                                    </>);
                            })
                        }
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
                            onRefresh={()=> {this.onRefresh()}}
                        />
                }>
                <View style={{marginTop: 10, padding: 10}} >
                    <Text style={{color: "#888888", textAlign: "center",fontSize: 12, paddingBottom: 10, borderBottomColor: "#222222", borderBottomWidth: 1, marginBottom: 10}}>NO RESULTS FOR: "{this.props.search}"</Text>
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

var styles = StyleSheet.create({
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
    },
    approveButton: {
        backgroundColor: "#121212",
        color: "#222222",
        width: 100,
        borderRadius: 10,
        zIndex: 100,
        height: 40,
        borderColor: "#222222",
        borderWidth: 2,
    },
    disapproveButton: {
        backgroundColor: "#222222",
        color: "#00d6a1",
        width: 115,
        height: 40,
        borderRadius: 10,
        zIndex: 100,
        borderColor: "#222222",
        borderWidth: 2,
    }
});