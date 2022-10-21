import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef} from 'react';
import { StyleSheet, Text, TextInput,TouchableOpacity, Appearance, View, ImageBackground, Dimensions, Button, Easing, SafeAreaView, Keyboard, Animated} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { createStackNavigator, TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import RBSheet from "react-native-raw-bottom-sheet";
import { Host, Portal } from 'react-native-portalize';
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import { BlurView } from '@react-native-community/blur';

import firebase from 'firebase';

import {Pages} from '../../pages/index';
import { screensEnabled } from 'react-native-screens';
import { Objects } from '..'; 

const Tab = createBottomTabNavigator();

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const Tabs = createBottomTabNavigator();

var webStyle;
var Colors;

export default class BottomTab extends Component {

    _isMounted = false;
  
    constructor(props) {
      super(props)
      this.state = {
        loaded: false,
        areResourcesReady: false,
        addDataHeight: 350,
        accountType: 0,
        colors: Appearance.getColorScheme(),
            colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
      };
      this.data = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
        this.setState({
          accountType: doc.data().accounttype,
        })
      });
      
    }


    componentDidMount = async() => {
      Appearance.addChangeListener(this.onAppThemeChanged);

      this._isMounted = true;


      

      await firebase.auth().onAuthStateChanged((user) => {
        if (this._isMounted) {
          if (!user) {
            this.setState({
              loggedIn: false,
              loaded: true,
            })
          } else {
            this.setState({
              loggedIn: true,
              loaded: true,
            });
          }
        }
        });
        
    }

    componentWillUnmount() {
      Appearance.addChangeListener(this.onAppThemeChanged);

      this._isMounted = false;
    }
    onAppThemeChanged = (theme) => {
      const currentTheme = Appearance.getColorScheme();
      this.setState({colors: currentTheme});
      this.setState({colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)})
    };


    signOut() {
      firebase.auth().signOut()
        .catch((err) => {
          console.log(error);
        })
    }

/*
<Tabs.Screen name={"Home"} children={()=><Pages.Pathways {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "cube" : "cube"} size={22} color={focused ? Colors.primaryColor :  Colors.dividerColor}/>
                  )
                }} />

*/
    render() {

      Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
  
      if (this.state.accountType == 0) {
        return (
          <>
          <RBSheet
                    ref={ref => {
                        this.AddDataBoth = ref;
                    }}
                    height={this.state.addDataHeight}
                    openDuration={250}
                    closeOnDragDown={false}
                    closeOnPressMask={true}
                    onClose={() => {
                        this.setState({addDataHeight: 350})
                    }}
                    customStyles={{
                        container: {
                            alignItems: "center",
                            backgroundColor: Colors.backgroundLightestColor,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                            marginBottom: -100,
                        },
                    }}
                    >
                    <View style={{justifyContent: "center", alignItems: "center", height: this.state.addDataHeight}}>
                        <Text>Hello</Text>
                    </View>
                    
                </RBSheet>

          <NavigationContainer >
              <Tabs.Navigator
                // default configuration from React Navigation
                tabBarOptions={{
                  activeTintColor: Colors.mainColor,
                  inactiveTintColor: Colors.lighterText,
                  showLabel: false,
                  style: {
                    borderTopColor: Colors.dividerColor,
                    borderTopWidth: 0.25,
                    backgroundColor: "transparent",
                    height: 60,
                    paddingHorizontal: 20,
                    position: 'absolute', 
                    elevation: 0,
                  }
                }}

                tabBar={ (props) => (
                  <View style={{overflow: "hidden",bottom: 0, position: "absolute", height: 60, width: "100%"}}>
                  <BlurView blurType={Colors.blurTheme} blurAmount={5} style={{overflow: "hidden",bottom: 0, position: "absolute", height: 60, width: "100%"}}>
                    <BottomTabBar {...props} />

                  </BlurView>
                  </View>
                )}

                
                
                appearance={{
                  dotCornerRadius: 100,
                }}
                lazy={false}
                optimizationsEnabled={true}

              >
                <Tabs.Screen name="Devices" children={()=><Pages.Devices {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "layers" : "layers-outline"} size={26} color={focused ? Colors.mainColor :  Colors.dividerColor}/>
                  ),
                  
                  
                }}/>
                
                <Tabs.Screen name="Reports" children={()=><Pages.Reports {...this.props}/>}  
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "pie-chart" : "pie-chart-outline" } size={26} color={focused ? Colors.mainColor :  Colors.dividerColor}/>
                  )
                }}/>
                <Tabs.Screen name="Account" children={()=><Pages.Account {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "person" : "person-outline"} size={26} color={focused ? Colors.mainColor :  Colors.dividerColor}/>
                  )
                }}/>
  
              </Tabs.Navigator>
            </NavigationContainer>

                
        </>
        
        ); /*
        
        <Tabs.Screen name="Settings"  component={() => null}
                    options={({navigation})=> ({
                      tabBarIcon:props => <TouchableOpacity {...props} onPress={()=>this.AddDataBoth.open()}>
                        <Ionicons name={"add-circle-outline"} size={26} color={Colors.dividerColor}/>
                      </TouchableOpacity>
                })}/>
        
        */
      }
      else {
        return (
          <>
          <NavigationContainer>
              <Tabs.Navigator
                // default configuration from React Navigation
                tabBarOptions={{
                  activeTintColor: Colors.primaryColor,
                  inactiveTintColor: Colors.lighterText,
                  activeBackgroundColor: Colors.secondaryColor,
                  tabStyle: {
                    borderTopColor: Colors.backgroundLightColor,
                    borderTopWidth: 1,
                  }
                }}
                appearance={{
                  tabBarBackground: Colors.backgroundLightestColor,
                  dotCornerRadius: 100,
                }}
              >
                <Tabs.Screen name={"Home"} children={()=><Pages.Pathways {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"cube"} size={20} color={focused ? Colors.primaryColor :  Colors.backgroundLighterColor}/>
                  )
                }} />
                <Tabs.Screen name="Devices" children={()=><Pages.Device {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"layers"} size={20} color={focused ? Colors.primaryColor :  Colors.backgroundLighterColor}/>
                  )
                }}/>
                <Tabs.Screen name="Users" children={()=><Pages.Users {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"people"} size={20} color={focused ? Colors.primaryColor :  Colors.backgroundLighterColor}/>
                  )
                }}/>
                <Tabs.Screen name="Account" children={()=><Pages.Account {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"person"} size={20} color={focused ? Colors.primaryColor :  Colors.backgroundLighterColor}/>
                  )
                }}/>
  
              </Tabs.Navigator>
            </NavigationContainer>
        </>
        
        );
      }
      
    }
}