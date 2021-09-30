import React, {Component, useState} from 'react'
import { Text, View, Animated, Image, ActivityIndicator, StatusBar, Platform, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView,{PROVIDER_GOOGLE, OverlayComponent} from 'react-native-maps';
import { Host, Portal } from 'react-native-portalize';
import RBSheet from "react-native-raw-bottom-sheet";
import NavigationBar from 'react-native-navbar-color'
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import { Buffer } from 'buffer';
import { read } from 'react-native-ble-manager';
import { set } from 'react-native-reanimated';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

NavigationBar.setColor('#121212')


// Pre-step, call this before any NFC operations
async function initNfc() {
  await NfcManager.start();
}




class Reports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDeviceID: "",
            hasFocus: false,
            search: false,
            addDataHeight: 220,
        }

        
        
    }

    componentDidMount = async() => {
        initNfc();
    }

    readNdef() {
        const cleanUp = () => {
          NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
          NfcManager.setEventListener(NfcEvents.SessionClosed, null);
        };
      
        return new Promise((resolve) => {
          let tagFound = null;
      
          NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
            tagFound = tag;
            resolve(tagFound);
            var buf = Buffer.from(tag.ndefMessage[0].payload);
            this.setState({addDataHeight: 275});
            setTimeout(()=> {
                this.setState({search: true})
                this.RBSheet.open();
            }, 200)
            
            console.log(buf.toString());
            NfcManager.unregisterTagEvent().catch(() => 0);
          });
      
          NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
            cleanUp();
            if (!tagFound) {
              resolve();
            }
          });
      
          NfcManager.registerTagEvent();
        });
      }
      
      closeNdef() {
          const cleanUp = () => {
              NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
              NfcManager.setEventListener(NfcEvents.SessionClosed, null);
            };
      }

      NfcPage = ({searching}) => {
        if (searching == false) {
            return (
                <>
                    <View style={{flexDirection: "row", marginBottom: 25}}>
                        <View style={webStyles.connectContainer}>
                                <ActivityIndicator size="large" color="#ddd" />
                        </View>
                        <View style={webStyles.connectText}>
                            <Text style={{color: "#ddd", fontSize: 12, textAlign: "center", fontWeight: "bold"}}>HOVER OVER A MEDIBOUND BEACON</Text>
                            <Text style={{color: "#ddd", textAlign: "center", fontSize: 12}}>TO ADD MEDICAL DATA TO YOUR FEED</Text>
                        </View>
                    </View>   
                    <Button onPress={() => {this.RBSheet.close();} } title="Cancel" buttonStyle={webStyles.connectButton} titleStyle={{color: "#d36e6e"}} ></Button>
 
                </>
            )
        }
        return (
            <>
                <View style={{flexDirection: "row", marginBottom: 25}}>
                        <View style={webStyles.connectedContainer}>
                            <Ionicons name="checkmark-outline" size={40} color="#00d6a1"></Ionicons>
                        </View>
                        <View style={webStyles.connectText}>
                            <Text style={{color: "#ddd", fontSize: 12, textAlign: "center", fontWeight: "bold"}}>HOVER OVER A MEDIBOUND BEACON</Text>
                            <Text style={{color: "#ddd", textAlign: "center", fontSize: 12}}>TO ADD MEDICAL DATA TO YOUR FEED</Text>
                        </View>
                </View>
                <Button containerStyle={{marginBottom: 10}}  title="Approve Submission" buttonStyle={webStyles.connectedButton} titleStyle={{color: "#00d6a1"}} ></Button>  
                <Button onPress={() => {this.RBSheet.close();} } title="View More Information" buttonStyle={webStyles.connectButton} titleStyle={{color: "#ddd"}} ></Button>
            </>
        )
    }

    render() {

       
        

        return(
            <>
            <View style={{padding: 15, flexDirection: "row", width: screen.width, borderBottomWidth: 1, borderBottomColor: "#222222"}}>
                <Image
                    style={{width: 40, height: 40,  backgroundColor: "#004030", borderRadius: 5}}
                />
                <Button onPress={() => {this.RBSheet.open();this.readNdef(); NavigationBar.setColor('#121212')}} title="Add Medical Records" buttonStyle={webStyles.addDataButton} titleStyle={{color: "#ddd"}} icon={<Ionicons name={"cloud-upload"} size={20} style={{marginRight: 10}} color="#ddd"/>}></Button>
            </View>
            <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
                <View style={{height: "100%", width: "100%", backgroundColor: "#121212", }}>
                    <View style={webStyles.body}>
                        
                        <StatusBar style="auto" backgroundColor="#00d6a1" barStyle={Platform.OS == 'android' ? "dark-content" : "light-content"} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <Portal>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={this.state.addDataHeight}
                    openDuration={250}
                    closeOnDragDown={false}
                    closeOnPressMask={true}
                    onClose={() => {
                        this.closeNdef()
                        this.setState({search: false, addDataHeight: 220})
                    }}
                    customStyles={{
                        container: {
                            alignItems: "center",
                            backgroundColor: "#121212",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20
                        },
                    }}
                    >
                    <View style={{justifyContent: "center", alignItems: "center", height: this.state.addDataHeight - 35}}>
                        <this.NfcPage searching={this.state.search}/>
                    </View>
                    
                </RBSheet>
                </Portal>
            </>
        )
    }

}

var webStyles = StyleSheet.create({
    body: {
        backgroundColor: "#121212",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        padding: 0,
        zIndex: 10,
    },
    addDataButton: {
        height: 40,
        width: screen.width - 76,
        marginLeft: 10,
        backgroundColor: "#222222",
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: "#222222"
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
      connectContainer: {
          borderWidth: 1,
          borderColor: "#222222",
          backgroundColor: "#222222",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          height: 75,
          width: 75,
      },
      connectedContainer: {
        borderWidth: 1,
        borderColor: "#004030",
        backgroundColor: "#004030",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        height: 75,
        width: 75,
    },
      connectText: {
        borderWidth: 2,
        borderColor: "#222222",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        height: 75,
        marginLeft: 10,
        color: "#ddd",
        padding: 10,
        width: screen.width - 125,
    },
      connectButton: {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: 45,
        width: screen.width - 40,
        backgroundColor: "#222222",
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: "#222222",
      },
      connectedButton: {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: 45,
        width: screen.width - 40,
        backgroundColor: "#222222",
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: "#222222",
      }
});


export default Reports;
