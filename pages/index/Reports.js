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

import { Objects } from '../../components';
import { ImageBackground } from 'react-native';
import ThemedListItem from 'react-native-elements/dist/list/ListItem';
import { ScrollView } from 'react-native';
const Colors = Objects.Vars.Colors;


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
            postArray: []
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
                                <ActivityIndicator size="large" color={Colors.lighterText} />
                        </View>
                        <View style={webStyles.connectText}>
                            <Text style={{color: Colors.lighterText, fontSize: 12, textAlign: "center", fontWeight: "bold"}}>HOVER OVER A MEDIBOUND BEACON</Text>
                            <Text style={{color: Colors.lighterText, textAlign: "center", fontSize: 12}}>TO ADD MEDICAL DATA TO YOUR FEED</Text>
                        </View>
                    </View>   
                    <Button onPress={() => {this.state.postArray.push(1);this.RBSheet.close();} } title="Cancel" buttonStyle={webStyles.connectButton} titleStyle={{color: Colors.errColor}} ></Button>
 
                </>
            )
        }
        return (
            <>
                <View style={{flexDirection: "row", marginBottom: 25}}>
                        <View style={webStyles.connectedContainer}>
                            <Ionicons name="checkmark-outline" size={40} color={Colors.primaryColor}></Ionicons>
                        </View>
                        <View style={webStyles.connectText}>
                            <Text style={{color: Colors.lighterText, fontSize: 12, textAlign: "center", fontWeight: "bold"}}>HOVER OVER A MEDIBOUND BEACON</Text>
                            <Text style={{color: Colors.lighterText, textAlign: "center", fontSize: 12}}>TO ADD MEDICAL DATA TO YOUR FEED</Text>
                        </View>
                </View>
                <Button onPress={() => {this.state.postArray.push(1);this.RBSheet.close(); } }  containerStyle={{marginBottom: 10}}  title="Approve Submission" buttonStyle={webStyles.connectedButton} titleStyle={{color: Colors.primaryColor}} ></Button>  
                <Button onPress={() => {this.RBSheet.close();} } title="View More Information" buttonStyle={webStyles.connectButton} titleStyle={{color: Colors.lighterText}} ></Button>
            </>
        )
    }

    Post = () => {
        return (
            <View style={{width: "100%",marginBottom: 15, }}>
                    <ImageBackground blurRadius={1} resizeMode="cover" imageStyle={{opacity:0.3}} source={{ uri: "https://www.wealthmanagement.com/sites/wealthmanagement.com/files/styles/article_featured_standard/public/medical-office-examining-room_1.jpg?itok=YGaB5mT1" }} style={webStyles.dataBox}>
                        <View style={{padding: 20}}>
                            <Text style={{fontSize: 20, fontWeight: "700", color: "white", marginBottom: 20, width: "80%"}}>Medibound Report</Text>
                            <View style={{backgroundColor: "#222222", borderBottomLeftRadius: 5, borderTopLeftRadius: 5,  marginBottom: 20, padding: 5, paddingRight: 10, width: "auto", position: "absolute", right: 0, top: 13, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                <Image source={{uri: "https://avatars.githubusercontent.com/u/83532819?s=200&v=4"}}
                                    style={{width: 30, height: 30, marginRight: 10, backgroundColor: Colors.secondaryColor, borderRadius: 20}}
                                />
                                <Text style={{color: "white"}}>Medibound</Text>
                            </View>
                            <Button onPress={() => {this.RBSheet.open();this.readNdef(); NavigationBar.setColor('#121212')}} title="View Information" buttonStyle={webStyles.dataButton} titleStyle={{color: "white"}} ></Button>
                        </View>
                    </ImageBackground>
                </View>
        )
    }

    render() {

       
        

        return(
            <>
            <View style={{padding: 15, flexDirection: "row", width: screen.width, borderBottomWidth: 1, borderBottomColor: Colors.backgroundLightColor}}>
                <Image source={{uri: "https://avatars.githubusercontent.com/u/66661429?v=4"}} resizeMode="cover"
                    style={{width: 40, height: 40,  backgroundColor: Colors.secondaryColor, borderRadius: 5}}
                />
                <Button onPress={() => {this.RBSheet.open();this.readNdef(); NavigationBar.setColor('#121212')}} title="Add Medical Records" buttonStyle={webStyles.addDataButton} titleStyle={{color: Colors.lighterText}} icon={<Ionicons name={"cloud-upload"} size={20} style={{marginRight: 10}} color={Colors.lighterText}/>}></Button>
            </View>
            <View  style={{padding: 15, paddingBottom: 0, flexDirection: "column", width: screen.width, height: window.height-160, borderBottomWidth: 1, borderBottomColor: Colors.backgroundLightColor, marginBottom: 10}}>
                <ScrollView>
                    {this.state.postArray.map(d=> {
                        return(
                            <this.Post/>
                        );
                    })}  
                </ScrollView>              
            </View>
            <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
                <View style={{height: "100%", width: "100%", backgroundColor: Colors.backgroundColor, }}>
                    <View style={webStyles.body}>
                        
                        <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle={Platform.OS == 'android' ? "dark-content" : "light-content"} />
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
                            backgroundColor: Colors.backgroundColor,
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
        backgroundColor: Colors.backgroundColor,
        height: "100%",
        width: "100%",
        overflow: "hidden",
        padding: 0,
        zIndex: 10,
    },
    dataBox: {
        backgroundColor: "#121212",
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
    },
    dataButton: {
        height: 40,
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.15)",
    },
    addDataButton: {
        height: 40,
        width: screen.width - 76,
        marginLeft: 10,
        backgroundColor: Colors.backgroundLightColor,
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: Colors.backgroundLightColor
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
          borderColor: Colors.backgroundLightColor,
          backgroundColor: Colors.backgroundLightColor,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          height: 75,
          width: 75,
      },
      connectedContainer: {
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
        backgroundColor: Colors.secondaryColor,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        height: 75,
        width: 75,
    },
      connectText: {
        borderWidth: 2,
        borderColor: Colors.backgroundLightColor,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        height: 75,
        marginLeft: 10,
        color: Colors.lighterText,
        padding: 10,
        width: screen.width - 125,
    },
      connectButton: {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: 45,
        width: screen.width - 40,
        backgroundColor: Colors.backgroundLightColor,
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: Colors.backgroundLightColor,
      },
      connectedButton: {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: 45,
        width: screen.width - 40,
        backgroundColor: Colors.backgroundLightColor,
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: Colors.backgroundLightColor,
      }
});


export default Reports;
