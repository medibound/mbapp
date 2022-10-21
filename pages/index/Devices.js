import React, {Component, useState} from 'react'
import { Text, View, ScrollView, Appearance , Dimensions, StatusBar,PermissionsAndroid ,ActivityIndicator,TouchableOpacity, NativeAppEventEmitter, NativeModules, NativeEventEmitter,  Linking, StyleSheet, TextInput, Platform, Image } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import IconA from 'react-native-vector-icons/FontAwesome';
import Store from "react-native-fs-store";
import LinearGradient from 'react-native-linear-gradient';


import firebase from 'firebase';
import RBSheet from "react-native-raw-bottom-sheet";
import NavigationBar from 'react-native-navbar-color'
import { useScrollToTop } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

import { Objects } from '../../components';
import { BlurView } from '@react-native-community/blur';

import { BluetoothStatus } from 'react-native-bluetooth-status';

import BleManager, { connect } from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);

var webStyles;
var Colors;

const AsyncStorage = new Store('default');


const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

class Devices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountType: 0,
            loaded: false,
            search: false,
            addDataHeight: 250,
            settingsButtonStyle: null,
            settingsButtonTopStyle: null,
            bluetooth: "Off",
            bleScanStatus: "Null",
            deviceFirstArray: 'null',
            deviceArray: [],
            devices: [],
            buttonLoadingRun: false,
            runStatus: "Idle",
            colors: Appearance.getColorScheme(),
            colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
        }
        this.onSignOut = this.signOut.bind(this);
        this.data = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
            this.setState({
              accountType: doc.data().accounttype,
              loaded: true,
            })
          });
          
        
    }
    async checkInitialBluetoothState() 
        {
        const isEnabled = await BluetoothStatus.state();
        console.log("check bluetooth on or off", isEnabled);
        if(isEnabled == "On"){
        this.setState({bluetooth: "On"});
        } else{
            this.setState({bluetooth: "Off"});

        }
        }


    componentDidMount () {

        AsyncStorage.getItem("devices").then((item) => {
            if (item == undefined) {
                AsyncStorage.setItem(
                    "devices",
                    new Array()
                );
                this.setState({device: new Array()})
                console.log("reset")
            }
            else {
                this.setState({devices: item})
                console.log("already good: " + this.state.devices)
            }
        })


        

        Appearance.addChangeListener(this.onAppThemeChanged);
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                  console.log("Permission is OK");
                } else {
                  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                    if (result) {
                      console.log("User accept");
                    } else {
                      console.log("User refuse");
                    }
                  });
                }
            });
          }  
        BleManager.enableBluetooth()
        .then(() => {
            // Success code
            console.log("The bluetooth is already enabled or the user confirm");
        })
        .catch((error) => {
            // Failure code
            console.log("The user refuse to enable bluetooth");
        });

        this.checkInitialBluetoothState();

        BleManager.start({ showAlert: false }).then((scan) => {
            // Success code
            console.log(scan);
        });
        bleEmitter.addListener('BleManagerDiscoverPeripheral', (peripheral) => {
                //console.log('Got ble peripheral', peripheral);
        });
        bleEmitter.addListener('BleManagerStopScan', () => {
            console.log("Stopped");
            if (this.state.bleScanStatus == "Running") {
                
                BleManager.getDiscoveredPeripherals([]).then((peripheralsArray) => {
                    // Success code
                    
                    AsyncStorage.getItem("devices").then((item) => {
                            if(peripheralsArray.length != 0) {
                                var minDevice = 0;
                                for(var i = 0; i < peripheralsArray.length; i++) {
                                    var verify = false
                                    console.log("check" + i)
                                    for(var j = 0; j < item.length; j++) {
                                        console.log("checklow" + j)
                                        console.log(this.state.devices[j].name == peripheralsArray[i].name)
                                        if (this.state.devices[j].id == peripheralsArray[i].id) {
                                            verify = true;
                                        }
                                    }
                                    if (verify) {
                                        minDevice++;
                                    }
                                }
                                if (minDevice == peripheralsArray.length) {

                                }
                                else {
                                    this.setState({deviceFirstArray: peripheralsArray[minDevice]});
                                    this.RBSheet.close();
                                    this.ConnectSheet.open();
                                    this.setState({bleScanStatus: "Null"});
                                }
                                
                            }
                    });

                });
            }
        } );

        BluetoothStatus.addListener((status)=>{
            this.setState({bluetooth: status});
        })


    }

    componentWillUnmount() {
        Appearance.addChangeListener(this.onAppThemeChanged);
        bleEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        bleEmitter.removeAllListeners('BleManagerStopScan' );
      };
    
      onAppThemeChanged = (theme) => {
        const currentTheme = Appearance.getColorScheme();
        this.setState({colors: currentTheme});
        this.setState({colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)})
      };


    signOut() {
        firebase.auth().signOut()
          .catch((error) => {
            console.log(error);
          })
    }


    Device = ({deviceName, deviceStatus,deviceAlert, deviceNum}) => {
        return(
                                    <View style={{ width: "50%", height: 140, padding: 5}}>
                                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#07523e', '#00d6a1']} style={{borderRadius: 15,}}>
                                        <TouchableOpacity onPress={() => this.DeviceSheet.open()} onLongPress={() => this.removeDevice()} style={{backgroundColor: "transparent", width: "100%", height: "100%", borderRadius: 15, padding: 10}}>
                                            <View style={{height: "50%"}}>
                                                <Image source={{uri: "https://medibound.com/deviceprofile.PNG"}} resizeMode="cover"
                                                        style={{width: 30, height: 30,  backgroundColor: Colors.secondaryColor, borderRadius: 5}}
                                                    />
                                            </View>
                                            <View style={{height: "50%", justifyContent:"flex-end"}}>
                                                <Text style={{fontSize: 18, fontWeight: "bold"}}>{deviceName}</Text>
                                                <Text style={{fontSize: 12, fontWeight: "bold", opacity: 0.8}}>{deviceStatus}</Text>
                                                <Text style={{fontSize: 12, fontWeight: "bold", opacity: 0.8}}>{deviceAlert}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        </LinearGradient>
                                    </View>
        )
    }

    AddDevice = () => {
        return(
                                    <View style={{ width: "50%", height: 120, padding: 5}}>
                                        <Button title="Add Device" titleStyle={{color: Colors.lightText}} icon={ <Icon name="add" size={40} color={Colors.lightText}/>} buttonStyle={{backgroundColor: "transparent", width: "100%", height: "100%", borderRadius: 15, borderWidth: 1, borderStyle: "dashed", borderColor: Colors.lightText}} containerStyle={{borderRadius: 15}}>
                                        </Button>
                                    </View>
        )
    } 

    AccountTag = () => {
        if (this.state.accountType == 0) {
            return(
                <View style={{borderRadius: 10,marginTop: 6, backgroundColor: "transparent", width: 80,  overflow: "hidden"}}><Text style={{padding: 2, color: Colors.primaryColor, height: 20, backgroundColor: Colors.secondaryColor, textAlign: "center",  borderRadius: 50, fontSize: 12,  fontWeight: "bold"}}>PERSONAL</Text></View>
            );
        }
        return(
            <View style={{borderRadius: 10,marginTop: 4, backgroundColor: "transparent", width: 80, overflow: "hidden"}}><Text style={{padding: 2, color: Colors.primaryColor, backgroundColor: Colors.secondaryColor, textAlign: "center",  borderRadius: 50, fontSize: 12,  fontWeight: "bold"}}>PARTNER</Text></View>
            );
    }

    goToURL(url) {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

    bleLoad() {
        console.log(this.state.devices)
        if(this.state.bluetooth) {
            this.RBSheet.open(); 
            NavigationBar.setColor('#121212');
            
          BleManager.scan(["BD21"], 3, true).then((results) => {
            console.log('Scanning...');
            this.setState({bleScanStatus: "Running"})
          }).catch(err => {
            console.error(err);
          });
        }
        else {
            BleManager.enableBluetooth()
            .then(() => {
              // Success code
              console.log("The bluetooth is already enabled or the user confirm");
              this.bleLoad();
            })
            .catch((error) => {
              // Failure code
              console.log("The user refuse to enable bluetooth");
            });
        }
    }

    async acceptAndConnect() {
        await AsyncStorage.getItem("devices").then((item) => {
            if (item == undefined) {
                AsyncStorage.setItem(
                    "devices",
                    []
                );
                this.setState({devices: []})
            }
            else {
                var large = item
                large.push(this.state.deviceFirstArray)
                console.log(large)
                AsyncStorage.setItem(
                    "devices",
                    large
                );
                this.setState({devices: large})
                this.ConnectSheet.close();
            }
        })
        
    }

    async removeDevice(num) {
        await AsyncStorage.getItem("devices").then((item) => {
            if (item == undefined) {
                AsyncStorage.setItem(
                    "devices",
                    []
                );
                this.setState({devices: []})
            }
            else {
                var large = item
                large.splice(num, 1)
                console.log(large)
                AsyncStorage.setItem(
                    "devices",
                    large
                );
                this.setState({devices: large})
            }
        })
    }

    addRecord(array) {
        firebase.firestore().collection("reports").doc(firebase.auth().currentUser.uid).update({
            reports: firebase.firestore.FieldValue.arrayUnion(array)
        })
        console.log("report added")
    }

    runProcess() {
        console.log("go")
        this.setState({runStatus: "Running",buttonLoadingRun: true})
        setTimeout(() => {
            this.setState({runStatus: "Recieving Retinal Capture"})
            setTimeout(() => {
                this.setState({runStatus: "Processing CNN Algorithm"})
                setTimeout(() => {
                    this.setState({runStatus: "Done. Test Returned to Records"})
                    this.addRecord({id: Math.ceil(Math.random() * 100000),name:"VisionBound Report", date: new Date().toDateString(), origin: "Medibound", iconName:"bar-chart", iconTitle:"Medical Tests", iconColor: "#42b0f5"});
                    setTimeout(() => {
                        this.DeviceSheet.close()
                        this.setState({runStatus: "Idle"})
                        this.setState({buttonLoadingRun: false})
                    } ,2000)
                } ,4000)
            } ,4000)
        } ,1000)
    }

    render() {

        const user = firebase.auth().currentUser;
        var displayName;
        var email;
        var photoUrl;
        var emailVerified;
        var uid;
        if (user) {
        // User is signed in.
            if (user != null) {
                displayName = user.displayName;
                email = user.email;
                photoUrl = user.photoURL;
                emailVerified = user.emailVerified;
                uid = user.uid;  
                // The user's ID, unique to the Firebase project. Do NOT use
                // this value to authenticate with your backend server, if
                // you have one. Use User.getToken() instead.
            }
        } else {
        }

        Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
        webStyles = setStyle(Colors);
        /*
        
        <SettingOption label="Personal Information" icon="person-circle"/>
        <SettingOption label="Email Settings" icon="mail"/>
        <SettingOption label="Privacy and Security" icon="lock-closed"/>
        <SettingOption label="Connected Services" icon="globe"/>
        
        */

        if (this.state.loaded == true) {
            return(
                <SafeAreaView style={{height: "100%", width: "100%", backgroundColor: Colors.backgroundColor}}>
                    <ScrollView shouldRasterizeIOS={true} alwaysBounceVertical={true} style={webStyles.body}>
                        <View style={{backgroundColor: "#f5f5f5", }}>
                            <View  style={{padding: 0, backgroundColor: Colors.backgroundColor}} >
                                <TouchableOpacity onPress={() => {this.bleLoad();}} style={{padding: 5}} titleStyle={{color: Colors.lighterText}} icon={<Icon name={"cloud-upload"} size={20} style={{marginRight: 10}} color={Colors.lighterText}/>}><View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-end"}}><Icon name={"add"} size={21} style={{marginRight: 5}} color={Colors.mainColor}></Icon><Text style={{fontSize: 18, color: Colors.mainColor, fontWeight: "500"}}>Add Device</Text></View></TouchableOpacity>
                                <Text style={{fontSize: 30, fontWeight: "bold",padding: 5, paddingTop: 3, paddingBottom: 5, color: Colors.lighterText}}>My Devices</Text>
                                
                                <View style={{paddingHorizontal: 5, marginBottom: 5,}}>
                    
                                    <Icon style={webStyles.searchIcon} name={"search"} size={20} color={Colors.lightText}></Icon>
                                    <TextInput 
                                        style={webStyles.searchInput}
                                        placeholder="Search Testing Devices"
                                        placeholderTextColor="#888888"
                                    />
                                </View>

                                <View prop={this.state.devices} style={{flexDirection: "row", flexWrap: "wrap"}}>
                                    
                                    {
                                        this.state.devices.map((d, index)=>{
                                            return(
                                                <this.Device deviceName={d.name} deviceStatus="Online" deviceAlert="1 new test" deviceNum={index}/>
                                            )
                                        })
                                    }
                                    


                                </View>
                
                                <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle={Colors.darkMode ? "light-content" : "dark-content"} />
                            </View>
                        </View>
                        <View style={{height: 100}}></View>
                    </ScrollView>
                    <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        height={150}
                        openDuration={250}
                        closeOnDragDown={false}
                        closeOnPressMask={true}
                        onClose={() => {
                            this.setState({search: false, bleScanStatus: "Null"})
                            BleManager.stopScan();
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
                        <View style={{justifyContent: "center", alignItems: "center",flexDirection:"row", height: this.state.addDataHeight - 150}}>
                            <ActivityIndicator size="small" color={Colors.lighterText} style={{marginRight: 15}} /><Text>Finding Available Devices</Text>
                        </View>
                    
                    </RBSheet>

                    <RBSheet
                        ref={ref => {
                            this.ConnectSheet = ref;
                        }}
                        height={500}
                        openDuration={250}
                        closeOnDragDown={false}
                        closeOnPressMask={true}
                        onClose={() => {
                            
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
                        <View style={{justifyContent: "center", alignItems: "center",flexDirection:"column", display: "flex"}}>
                            <View style={{flexDirection:"row", paddingBottom: 20}}>
                                <Image source={{uri: "https://medibound.com/deviceprofile.PNG"}} resizeMode="cover"
                                    style={{width: 60, height: 60,  backgroundColor: Colors.secondaryColor, borderRadius: 5, marginRight: 10}}
                                />
                                <View style={{width: "75%",flexDirection:"column"}}>
                                    <Text color={Colors.lighterText}  style={{fontSize: 18, fontWeight: "700"}}>{this.state.deviceFirstArray.name}</Text>
                                    <Text color={Colors.lighterText} >Medibound</Text>
                                    <View style={{flexDirection: "row"}}><Icon style={{marginRight: 5}} name="bar-chart" size={16} color="#42b0f5"/><Text>Medical Tests</Text></View>
                                </View>
                            </View>
                            <View style={{height: 300}}>
                                <View style={{width: screen.width - 50,backgroundColor: Colors.backgroundDarkestColor, borderRadius: 7.5, padding: 20}}>
                                    <Text color={Colors.lighterText}  style={{fontSize: 18, marginBottom: 10, fontWeight: "700"}}>Access Given To This Device</Text>
                                    <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 14,}}>{'\u2022'}</Text>
                                    <Text style={{flex: 1, paddingLeft: 5,fontSize: 14,}}>The use and analysis of personal medical information in relation to retinal profiling</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 14,}}>{'\u2022'}</Text>
                                    <Text style={{flex: 1, paddingLeft: 5,fontSize: 14,}}>The use of the internet to communicate with biomarker indicators</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 14,}}>{'\u2022'}</Text>
                                    <Text style={{flex: 1, paddingLeft: 5,fontSize: 14,}}>The use of existing personal medical information provided to the Medibound Architecture</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 14,}}>{'\u2022'}</Text>
                                    <Text style={{flex: 1, paddingLeft: 5,fontSize: 14,}}>The development of formal medical results, on the patients behalf, in regards to Diabetic Retinopathy testing</Text>
                                    </View>
                                </View>
                            </View>
                            
                        </View>
                        <Button loading={this.state.buttonLoading} loadingProps={{ color: Colors.primaryColor}} titleStyle={{"color": Colors.primaryColor,fontWeight: "600", fontSize:16,justifyContent:"center",alignContent:"center"}} containerStyle={webStyles.connectButtonContainer} buttonStyle={webStyles.connectButton} 
                            title="Accept and Connect"
                            onPress={() => this.acceptAndConnect()}
                            color="transparent"/>
                        <Text style={{fontSize: 12, color: Colors.lightText,marginTop: 10,}}>Tap Away to Cancel</Text>

                    </RBSheet>

                    <RBSheet
                        ref={ref => {
                            this.DeviceSheet = ref;
                        }}
                        height={500}
                        openDuration={250}
                        closeOnDragDown={false}
                        closeOnPressMask={true}
                        onClose={() => {
                            
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
                        <View style={{justifyContent: "center", alignItems: "center",flexDirection:"column", display: "flex"}}>
                            <View style={{flexDirection:"row", paddingBottom: 20}}>
                                <Image source={{uri: "https://medibound.com/deviceprofile.PNG"}} resizeMode="cover"
                                    style={{width: 60, height: 60,  backgroundColor: Colors.secondaryColor, borderRadius: 5, marginRight: 10}}
                                />
                                <View style={{width: "75%",flexDirection:"column"}}>
                                    <Text color={Colors.lighterText}  style={{fontSize: 18, fontWeight: "700"}}>VisionBound Testing Device</Text>
                                    <Text color={Colors.lighterText} >Medibound</Text>
                                    <View style={{flexDirection: "row"}}><Icon style={{marginRight: 5}} name="bar-chart" size={16} color="#42b0f5"/><Text>Medical Tests</Text></View>
                                </View>
                            </View>
                            <Text style={{fontSize: 14, color: Colors.lightText,marginBottom: 0, alignSelf: "flex-start"}}>Status: {this.state.runStatus}</Text>

                            <Button loading={this.state.buttonLoadingRun} loadingProps={{ color: Colors.primaryColor}} titleStyle={{"color": Colors.primaryColor,fontWeight: "600", fontSize:16,justifyContent:"center",alignContent:"center"}} containerStyle={webStyles.connectButtonContainer} buttonStyle={webStyles.connectButton} 
                            title="Run DR Severity Exam"
                            color="transparent"
                            onPress={() => this.runProcess()}/>
                        
                            
                        </View>
                        <Image  style={{width: window.width - 50, marginTop: 15,  height: 250, opacity: 1, borderRadius: 10, }} source={{uri:"https://medibound.com/productimage.png"}}></Image>

                        

                    </RBSheet>
                </SafeAreaView>
            )
        }
        else {
            return(
                <View></View>
            );
        }
    }

}

function setStyle(Colors) {

    return StyleSheet.create({
        body: {
            backgroundColor: Colors.backgroundColor,
            height: "100%",
            width: "100%",
            overflow: "scroll",
            padding: 10,
            borderBottomLeftRadius: 30, 
            borderBottomRightRadius: 30,
        },
        connectButton: {

            "backgroundColor": Colors.backgroundDarkestColor,
            "shadowOffset": {
              "width": 0,
              "height": 0
            },
            "shadowRadius": 30,
            "shadowColor": "rgba(150, 255, 246, 0.7)",
            "shadowOpacity": 1,
            "borderWidth": 0,
            "borderColor": "black",
            "borderStyle": "solid",
            "color": "white",
            "fontFamily": "sfd",
            "fontSize": 13,
            "fontWeight": "400",
            borderRadius: 7.5,
            "width": screen.width - 50,
            "height": 45,
          },
          connectButtonContainer: {
            "marginTop": 10,
            borderRadius: 7.5,
          },
        accountCard: {
            borderRadius: 10,
            padding: 15,
            paddingLeft: 20,
            paddingRight: 20,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 7,
            elevation:6,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flex: 1,
            width: "100%",
            backgroundColor: "rgb(227, 255, 253)",

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
        
        signOutLayout: {
            "backgroundColor": Colors.backgroundColor,
            fontWeight: "700",
            width: "100%",
            borderWidth: 0,
            height: 50,
            padding: 0,
            margin: 0,
            paddingLeft: 30,
            paddingRight: 30,
            justifyContent: "flex-start",
            overflow: "visible",
        },
        signOutButton: {
            justifyContent: "flex-start",
            borderRadius: 10,
            height: 50,
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
        signOutContainer: {
            marginTop: 20,
            borderRadius: 10,
        },  

    });
}

export default Devices;
