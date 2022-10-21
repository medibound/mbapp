import React, {Component, useState} from 'react'
import { Text, View, Linking, Animated,Appearance, TouchableOpacity, useColorScheme, Image, ActivityIndicator, StatusBar, Platform, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { TextInput, TouchableHighlight } from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView,{PROVIDER_GOOGLE, OverlayComponent} from 'react-native-maps';
import { Host, Portal } from 'react-native-portalize';
import RBSheet from "react-native-raw-bottom-sheet";
import NavigationBar from 'react-native-navbar-color'
import LinearGradient from 'react-native-linear-gradient';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import { Buffer } from 'buffer';

import firebase from 'firebase';

import { Objects } from '../../components';
import { ImageBackground } from 'react-native';
import ThemedListItem from 'react-native-elements/dist/list/ListItem';
import { ScrollView } from 'react-native';
import { LARGE_PANEL_CONTENT_HEIGHT } from 'rn-swipeable-panel';
import { StackAggregator } from 'react-native-ui-lib';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

var webStyles;
var Colors;


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
            addDataHeight: 250,
            postArray: [],
            colors: Appearance.getColorScheme(),
            colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false),
            collapsed: true,
            menuShow: "flex",
            currentRecord: null
        }

        
        
    }

    async componentDidMount () {
        initNfc();

        Appearance.addChangeListener(this.onAppThemeChanged);

        await firebase.firestore().collection("reports").doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
            if (snapshot.data() == null) {
                firebase.firestore().collection("reports").doc(firebase.auth().currentUser.uid).set({
                    reports: []

                })
                this.setState({postArray: []})
            }
            else {
                this.setState({postArray: snapshot.data().reports})
            }
        });

    }

    componentWillUnmount() {
        Appearance.addChangeListener(this.onAppThemeChanged);
      };
    
      onAppThemeChanged = (theme) => {
        const currentTheme = Appearance.getColorScheme();
        this.setState({colors: currentTheme});
        this.setState({colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)})
      };

      SettingOption = ({label,records, icon, color, onPress}) => {
        label = label;
        var display = 1;
        if (color == null) {
            color = Colors.lighterText
            display = 1;
        }
        const [isFocused, setIsFocused] = useState(false)
        return (
            <>
            <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                
                <Button onPressOut={() => setIsFocused(false)} onPressIn={() => setIsFocused(true)}  onPress={onPress} titleStyle={{color: Colors.lighterText,flexDirection: "row", marginLeft: 10, fontSize: 17, fontWeight: "normal", width: "100%", textAlign: "left"}} buttonStyle={[webStyles.settingsButton, isFocused && {backgroundColor: Colors.dividerColor}]} icon={<Icon name={icon} size={25} color={color}/>} title={()=> {return(
                    <View style={{color: Colors.lighterText,flexDirection: "row", marginLeft: 10, flexDirection: "column", fontSize: 17, fontWeight: "normal", width: "100%", textAlign: "left"}}>
                    <Text style={{color: Colors.lighterText, fontWeight: 'bold', fontSize: 18 }}>{label}</Text>
                    <Text style={{color: Colors.lighterText, fontStyle: 'normal', fontSize: 12, opacity: 0.8 }}>
                      {records}
                    </Text>
                  </View>
                )}}/> 
                <Icon style={{ position: "absolute", top: 15, right: 25, opacity: display}} name="chevron-forward-outline" size={20} color={Colors.lightText}/>
            </View>
            </>
        );
    }

    addRecord(array) {
        firebase.firestore().collection("reports").doc(firebase.auth().currentUser.uid).update({
            reports: firebase.firestore.FieldValue.arrayUnion(array)
        })
        console.log("report added")
    }

    removeRecord(array) {
        firebase.firestore().collection("reports").doc(firebase.auth().currentUser.uid).update({
            reports: firebase.firestore.FieldValue.arrayRemove(array)
        })
    }
    
    SettingOptionTop = ({label, icon, color, onPress}) => {
        label = label;
        var display = 1;
        if (color == null) {
            color = Colors.lighterText
            display = 1;
        }
        const [isFocused, setIsFocused] = useState(false)
        return (
            <>
            <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                
                <Button onPressOut={() => setIsFocused(false)} onPressIn={() => setIsFocused(true)}  onPress={onPress}  titleStyle={{color: Colors.lighterText,flexDirection: "row", marginLeft: 10,  fontSize: 17, fontWeight: "normal", width: "100%", textAlign: "left"}} buttonStyle={[webStyles.settingsButtonTop, isFocused && {backgroundColor: Colors.dividerColor}]} icon={<Icon name={icon} size={25} color={color}/>} title={label} /> 
                <Icon style={{ position: "absolute", top: 15, right: 25, opacity: display}} name="chevron-forward-outline" size={20} color={Colors.lightText}/>
            </View>
            </>
        );
    }

    SettingOptionTopDefinition = ({label,desc, icon, color, onPress}) => {
        label = label;
        var display = 1;
        if (color == null) {
            color = Colors.lighterText
            display = 1;
        }
        const [isFocused, setIsFocused] = useState(false)
        return (
            <>
            <View style={[ webStyles.settingsButtonTop,{flexDirection: "column", justifyContent: "center", alignItems: "flex-start", paddingLeft: 20, height: 80}]}>
                
                <Text style={{color: Colors.lighterText,fontWeight: "bold", fontSize: 20, paddingBottom: 5}}>Medical Records</Text>
                <Text style={{color: Colors.lighterText,fontSize: 14,opacity: 0.8}}>{desc}</Text>
            </View>
            </>
        );
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
                    <Button onPress={() => {this.addRecord({id: this.state.postArray.length + 1,name:"VisionBound Report", date: new Date().toDateString(), origin: "Medibound", iconName:"bar-chart", iconTitle:"Medical Tests", iconColor: "#42b0f5"}); this.setState({menuShow: "flex"}); this.RBSheet.close();} } title="Cancel" buttonStyle={webStyles.connectButton} titleStyle={{color: Colors.errColor}} ></Button>
 
                </>
            )
        }
        return (
            <>
                <View style={{flexDirection: "row", marginBottom: 25}}>
                        <View style={webStyles.connectedContainer}>
                            <Icon name="checkmark-outline" size={40} color={Colors.primaryColor}></Icon>
                        </View>
                        <View style={webStyles.connectText}>
                            <Text style={{color: Colors.lighterText, fontSize: 12, textAlign: "center", fontWeight: "bold"}}>HOVER OVER A MEDIBOUND BEACON</Text>
                            <Text style={{color: Colors.lighterText, textAlign: "center", fontSize: 12}}>TO ADD MEDICAL DATA TO YOUR FEED</Text>
                        </View>
                </View>
                <Button onPress={() => {this.addRecord({id: this.state.postArray.length + 1,name:"VisionBound Report", date: new Date().toDateString(), origin: "Medibound", iconName:"bar-chart", iconTitle:"Medical Tests", iconColor: "#42b0f5"}); this.setState({menuShow: "flex"});this.RBSheet.close(); } }  containerStyle={{marginBottom: 10}}  title="Approve Submission" buttonStyle={webStyles.connectedButton} titleStyle={{color: Colors.primaryColor}} ></Button>  
                <Button onPress={() => {this.RBSheet.close();} } title="View More Information" buttonStyle={webStyles.connectButton} titleStyle={{color: Colors.lighterText}} ></Button>
            </>
        )
    }

    

    PostList = (post) => {
        const Post = ({iconColor, iconTitle, iconName, name, origin, date, array}) => {
            return (
                <>
                <TouchableOpacity style={{marginBottom: 3,
                    padding: 10,
                    height: 70,
                    zIndex: 100,
                    overflow: "hidden",
                    backgroundColor: Colors.backgroundLightColor,
                    borderRadius: 10,
                    
                } }onPress={() => {this.DataSheet.open(); NavigationBar.setColor('#121212'); this.setState({currentRecord: array})}}
                onLongPress={() => {this.removeRecord(array); this.DataSheet.close(); this.setState({menuShow: "flex"})}}
                >
                            <View  style={{flexDirection: "row"}}>
                                <Image source={{uri: "https://medibound.com/deviceprofile.PNG"}} resizeMode="cover"
                                    style={{width: 50, height: 50,  backgroundColor: Colors.secondaryColor, borderRadius: 5}}
                                />
                                <View style={{flexDirection: "column", height: "100%", justifyContent: "center"}}>
                                    <Text style={{fontSize: 20,  paddingLeft: 20, fontWeight: "700", color: Colors.lighterText, marginBottom: 0, marginTop: -3}}>{name}</Text>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Icon style={{margin: 0, paddingLeft: 20,}} name={iconName} size={10} color={iconColor}></Icon>
                                        <Text style={{fontSize: 12,opacity: 0.8, paddingLeft: 5, fontWeight: "normal", color: Colors.lighterText,}}>{iconTitle}</Text>
                                    </View>
                                    <Text style={{fontSize: 12, opacity: 0.8,paddingLeft: 20, fontWeight: "normal", color: Colors.lighterText,}}>{"From " + origin + " • " + date }</Text>
                                    
                                </View>
                                
    
                            </View>
                    </TouchableOpacity>
                
                        
                
                
                </>
            )
        }
        if (this.state.postArray.length == 0) {
            return(
<></>                );
        }
        else if (this.state.postArray.length < 1) {
            return(<>{this.state.postArray.map(d=> {
                return(
                    <Post name="VisionBound Report" date={new Date().toDateString()} array={d} origin={"Medibound"} iconName={"bar-chart"} iconTitle={"Medical Tests"} iconColor={"#42b0f5"}/>
                );
            })}</>);        }
        else {
            var scaleX = 1;
            var buttonShow = "flex";
            if (this.state.menuShow == "flex") {
                buttonShow = "none";
                if (this.state.postArray.length == 2) {
                    scaleX = 1.05
                }
                else if (this.state.postArray.length == 1) {
                    scaleX = 1.1
                }
            }
            else {

            }
            return(
                <>
            <StackAggregator 
                    contentContainerStyle={{width: "100%",backgroundColor:  Colors.backgroundLightColor,borderRadius: 10, elevation:2, marginBottom: -10, padding: 0}}
                    containerStyle={{padding:0, transform: [{ scaleX: scaleX }]}}
                    buttonProps={{color: Colors.mainColor, style: {textAlign: "center", display: buttonShow}}}
                    padding={false}
                    collapsed={this.state.collapsed}
                    backgroundColor={"transparent"}
                    onItemPress={() => {this.DataSheet.open(); NavigationBar.setColor('#121212')}}
                    onCollapseWillChange={(bool) => {
                        if (bool == false) {
                            this.setState({menuShow: "none"})
                        }
                        else {
                            this.setState({menuShow: "flex"})
                        }
                        
                    }}
                    >                        
                    {this.state.postArray.map(d=> {
                        return(
                            <Post name={d.name} date={d.date} origin={d.origin} array={d} iconName={d.iconName} iconTitle={d.iconTitle} iconColor={d.iconColor}/>
                        );
                    })}</StackAggregator>
                                        <View style={{height: 10}}></View>


                    </>
                    
                    );
            
        }
                
    }

    goToURL(url) {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

    //                            <Button onPress={() => {this.DataSheet.open(); NavigationBar.setColor('#121212')}} title="View Report" buttonStyle={webStyles.dataButton} titleStyle={{color: Colors.lighterText}} icon={<Icon name={"document"} size={20} style={{marginRight: 10}} color={Colors.lighterText}/>}></Button>
//<TouchableOpacity style={{width: "100%", marginTop: 5, alignItems: "center", opacity: 1}}>
//<Text style={{color: Colors.lightText}}>View All Recent Records</Text>
//</TouchableOpacity>
    render() {

        Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
        webStyles = setStyle(Colors);
        
        return(
            <>
            <Host>
            <SafeAreaView style={{backgroundColor: Colors.backgroundLightColor}}>
            

            <View  style={{overflow: "visible", borderTopLeftRadius: 0,padding:15 ,borderTopRightRadius: 0, paddingBottom: 0, flexDirection: "column", width: screen.width, height: window.height, borderBottomWidth: 1, backgroundColor: Colors.backgroundColor, marginBottom: 10}}>
                <ScrollView> 
                <TouchableOpacity onPress={() => {this.RBSheet.open();this.readNdef(); NavigationBar.setColor('#121212')}} titleStyle={{color: Colors.lighterText}} icon={<Icon name={"cloud-upload"} size={20} style={{marginRight: 10}} color={Colors.lighterText}/>}><View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-end"}}><Icon name={"add"} size={21} style={{marginRight: 5}} color={Colors.mainColor}></Icon><Text style={{fontSize: 18, color: Colors.mainColor, fontWeight: "500"}}>Add Medical Records</Text></View></TouchableOpacity>

                    <Text style={{fontSize: 30, fontWeight: "bold", paddingTop: 7.5, paddingBottom: 5, color: Colors.lighterText}}>My Records</Text>
                    <View style={{paddingHorizontal: 0, marginBottom: 0,}}>
                    
                                    <Icon style={webStyles.searchIcon} name={"search"} size={20} color={Colors.lightText}></Icon>
                                    <TextInput 
                                        style={webStyles.searchInput}
                                        placeholder="Search Medical Records"
                                        placeholderTextColor="#888888"
                                    />
                    </View>

                    <View style={{height: 10}}></View>
                    <this.PostList key={this.state.postArray.length}/>
                    
                    

                    <View style= {[webStyles.card, {marginTop: 15, display: this.state.menuShow}]}>
                        <this.SettingOptionTopDefinition label="Medical Tests" desc="Medibound records are classified below:" icon="bar-chart" color="#42b0f5" onPress={()=> this.goToURL('https://twitter.com/medibound')}/>
                        <this.SettingOption label="Medical Tests" records={"1 Record"} icon="bar-chart" color="#42b0f5" onPress={()=> this.goToURL('https://twitter.com/medibound')}/>
                        <this.SettingOption label="Immunizations" records={"5 Records"} icon="bandage" color="#5eab62" onPress={()=> this.goToURL('https://medibound.com')}/>
                        <this.SettingOption label="Clinical Notes" records={"29 Records"} icon="receipt" color="#f5b942" onPress={()=> this.goToURL('https://twitter.com/medibound')}/>
                        <this.SettingOption label="Conditions" records={"6 Records"} icon="fitness" color="#f54242" />
                        <this.SettingOption label="Other" records={"107 Records"} icon="apps" color="#555555"/>
                    </View>
                    <View style={{height: 120}}></View>
                </ScrollView>              
            </View>
            <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
                <View style={{height: "100%", width: "100%", backgroundColor: Colors.backgroundColor, }}>
                    <View style={webStyles.body}>
                        
                    <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle={Colors.darkMode ? "light-content" : "dark-content"} />
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
                        this.setState({search: false, addDataHeight: 250})
                    }}
                    customStyles={{
                        container: {
                            alignItems: "center",
                            backgroundColor: Colors.backgroundLightestColor,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20
                        },
                    }}
                    >
                    <View style={{justifyContent: "center", alignItems: "center", height: this.state.addDataHeight - 50}}>
                        <this.NfcPage searching={this.state.search}/>
                    </View>
                    
                </RBSheet>
                <RBSheet
                    ref={ref => {
                        this.DataSheet = ref;
                    }}
                    height={window.height - 150}
                    openDuration={250}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    onClose={() => {
                
                    }}
                    customStyles={{
                        container: {
                            alignItems: "center",
                            backgroundColor: Colors.backgroundLightestColor,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                        },
                        draggableIcon: {
                            backgroundColor: Colors.backgroundDarkestColor,
                            margin: 0
                        }
                    }}
                    >
                        <ScrollView style={{ height: this.state.addDataHeight - 50}}>
                        <View style={{ borderRadius: 20,justifyContent: "center", alignItems: "center",}}>
                        
                        </View>
                        <Text style={{fontSize: 30,  color: Colors.lighterText, fontWeight: "700",marginTop: 20,}}>VisionBound Report</Text>
                        <Text style={{fontSize: 14, color: Colors.lightText,marginBottom: 20,}}>From Medibound</Text>

                        <View style={{ borderRadius: 100,  marginBottom: 10, backgroundColor: Colors.backgroundDarkestColor}}>
                            <View style={{borderRadius: 100, width: (window.width - 40)/2, overflow: "hidden"}}>
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#036ffc', '#00e03c', '#ffde08', '#ff6f08', '#ff2908']} style={{height: 10, width: window.width - 40, borderRadius: 100}}>

                                </LinearGradient>
                            </View>
                        </View>
                        <View style={{width: window.width - 40, padding: 20, borderRadius: 10,backgroundColor: Colors.backgroundDarkestColor, flexDirection: "row"}}>
                            <View style={{width: 0.3*(window.width - 40),borderColor: "#ffde08", borderWidth: 4, height:0.3*(window.width - 40), backgroundColor: Colors.backgroundLightColor, borderRadius: 1000, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{fontSize: 0.16*(window.width - 40), fontWeight: "600", color: "#ffde08", }}>3</Text>
                            </View>
                            <View style={{flexDirection: "column", marginLeft: 20, width:0.5*(window.width - 40)}}>
                                <Text style={{fontSize: 12, color: Colors.lighterText,}}>Model Severity Prediction: 3/5</Text>
                                <Text style={{fontSize: 26, color: Colors.lighterText, fontWeight:"600"}}>Moderate DR</Text>
                                <Text style={{fontSize: 12, color: Colors.lighterText,}}>1-Year Severity Projection: Severe DR (4)</Text>

                                <Button containerStyle={{marginTop: 5, backgroundColor: "transparent"}} titleStyle={{color: Colors.mainColor, fontSize: 12}} buttonStyle={{backgroundColor:"transparent"}} title="View Treatment Options" icon={<Icon name={"open-outline"} size={18} style={{marginRight: 5}} color={Colors.mainColor}></Icon>}></Button>
                            </View>
                        </View>

                        <Image style={{width: window.width - 40,marginTop: 10,  height: 100, opacity: 0.4, borderTopLeftRadius: 10, borderTopRightRadius: 10}} source={{uri:"https://medibound.com/retina.png"}}></Image>
                        <Button onPress={()=> this.goToURL('https://medibound.com/retina.png')} containerStyle={{width: window.width - 40,backgroundColor: Colors.backgroundDarkestColor,borderBottomLeftRadius: 10, borderBottomRightRadius: 10}} titleStyle={{color: Colors.mainColor}} buttonStyle={{backgroundColor:"transparent", height: 50}} title="View Full Retinal Image" icon={<Icon name={"open-outline"} size={18} style={{marginRight: 5}} color={Colors.mainColor}></Icon>}></Button>
                        
                        <View style={{flexDirection: "row", marginTop: 10}}>
                            <Button containerStyle={{width: 0.8*(window.width - 40) -10,marginRight: 10, backgroundColor: Colors.backgroundDarkestColor,borderRadius: 10}} titleStyle={{color: Colors.lighterText}} buttonStyle={{backgroundColor:"transparent", height: 50}} title="Share With Partners" icon={<Icon name={"share-social"} size={18} style={{marginRight: 5}} color={Colors.lighterText}></Icon>}></Button>
                            <Button onPress={() => {this.removeRecord(this.state.currentRecord); this.DataSheet.close(); this.setState({menuShow: "flex"})}} containerStyle={{width: 0.2*(window.width - 40),backgroundColor: Colors.backgroundDarkestColor, borderRadius: 10}} titleStyle={{color: Colors.mainColor}} buttonStyle={{backgroundColor:"transparent", height: 50}} title="" icon={<Icon name={"trash"} size={18} style={{marginRight: 5}} color={Colors.errColor}></Icon>}></Button>
                        </View>

                        </ScrollView>
                </RBSheet>
                </Portal>
                </SafeAreaView>
                </Host>
            </>
        )
    }

}
function setStyle(Colors) {
    return StyleSheet.create({
        body: {
            backgroundColor: Colors.backgroundColor,
            height: "100%",
            width: "100%",
            overflow: "visible",
            padding: 0,
            zIndex: 10,
        },
        dataBox: {
            backgroundColor: Colors.backgroundColor,
            width: "100%",
            borderRadius: 10,
            overflow: "visible",
            
        },
        dataButton: {
            height: 45,
            width: "100%",
            opacity: 0.9,
            backgroundColor: Colors.backgroundLightColor,
        },
        searchInput: {
            "marginBottom": 10,
            "paddingTop": 2.5,
            "paddingRight": 2.5,
            "paddingBottom": 2.5,
            "paddingLeft": 40,
            "backgroundColor": Colors.backgroundLightColor,
            borderRadius: 10,
            color: Colors.lightText,
            "width": "100%",
            "height": 35,
        },
        searchInputFocused: {
            "marginBottom": 10,
            "paddingTop": 2.5,
            "paddingRight": 2.5,
            "paddingBottom": 2.5,
            "paddingLeft": 40,
            "backgroundColor": Colors.backgroundLightColor,
            borderRadius: 10,
            color: "#888888",
            "width": "100%",
            "height": 45,
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
            "top": 28,
            "marginTop":-15,
            "alignSelf": "flex-start",
            elevation:6,
        },
        card: {
            width: "100%",
            backgroundColor: Colors.backgroundLightColor,
            marginTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: Colors.backgroundLightColor,
            borderRadius: 10,
            overflow: "hidden",
        },
        settingsButton: {
            "backgroundColor": Colors.backgroundLightColor,
            fontWeight: "700",
            height: 50,
            padding: 0,
            paddingLeft: 40,
            paddingRight: 30,
            justifyContent: "flex-start",
            overflow: "visible",
            borderTopWidth: 0.5,
            borderTopColor: Colors.dividerColor
        },
        settingsButtonTop: {
            "backgroundColor": Colors.backgroundLightColor,
            fontWeight: "700",
            height: 50,
            padding: 0,
            paddingLeft: 40,
            paddingRight: 30,
            justifyContent: "flex-start",
            overflow: "visible",
        },
        addDataButton: {
            height: 45,
            width: screen.width - 76,
            marginLeft: 10,
            marginTop: -2.5,
            backgroundColor: Colors.backgroundColor,
            borderRadius: 7.5,
            borderWidth: 0,
            borderColor: Colors.backgroundLighterColor,
        },
        connectContainer: {
            borderWidth: 1,
            borderColor: Colors.backgroundDarkestColor,
            backgroundColor: Colors.backgroundDarkestColor,
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
            borderColor: Colors.backgroundDarkestColor,
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
            backgroundColor: Colors.backgroundDarkestColor,
            borderRadius: 7.5,
            borderWidth: 2,
            borderColor: Colors.backgroundDarkestColor,
        },
        connectedButton: {
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: 45,
            width: screen.width - 40,
            backgroundColor: Colors.backgroundDarkestColor,
            borderRadius: 7.5,
            borderWidth: 2,
            borderColor: Colors.backgroundDarkestColor,
        }
    });
}

export default Reports;
