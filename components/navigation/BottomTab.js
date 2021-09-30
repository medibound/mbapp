import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef} from 'react';
import { StyleSheet, Text, TextInput, View, ImageBackground, Dimensions, Button, Easing, SafeAreaView, Keyboard, Animated} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { createStackNavigator, TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Host, Portal } from 'react-native-portalize';
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

import firebase from 'firebase';

import {Pages} from '../../pages/index';
import { screensEnabled } from 'react-native-screens';

const Tab = createBottomTabNavigator();

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const Tabs = AnimatedTabBarNavigator();


export default class BottomTab extends Component {

    _isMounted = false;

    constructor(props) {
      super(props)
      this.state = {
        loaded: false,
        areResourcesReady: false,
        accountType: 0,
      };
      this.data = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
        this.setState({
          accountType: doc.data().accounttype,
        })
      });
      
    }


    componentDidMount = async() => {
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
      this._isMounted = false;
    }

    signOut() {
      firebase.auth().signOut()
        .catch((err) => {
          console.log(error);
        })
    }


    render() {
  
      if (this.state.accountType == 0) {
        return (
          <>
          <NavigationContainer>
              <Tabs.Navigator
                // default configuration from React Navigation
                tabBarOptions={{
                  activeTintColor: "#00d6a1",
                  inactiveTintColor: "#ddd",
                  activeBackgroundColor: "#004030",
                  tabStyle: {
                    borderTopColor: "#222222",
                    borderTopWidth: 1,
                  }
                }}
                appearance={{
                  tabBarBackground: "#121212",
                  dotCornerRadius: 100,
                }}
              >
                <Tabs.Screen name={"Home"} component={Pages.Pathways} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"cube"} size={22} color={focused ? "#00d6a1" :  "#444444"}/>
                  )
                }} />
                <Tabs.Screen name="Partners" component={Pages.Partners} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"shield-checkmark"} size={22} color={focused ? "#00d6a1" :  "#444444"}/>
                  )
                }}/>
                <Tabs.Screen name="Reports" component={Pages.Reports} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"pie-chart"} size={22} color={focused ? "#00d6a1" :  "#444444"}/>
                  )
                }}/>
                <Tabs.Screen name="Account" component={Pages.Account} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"person"} size={22} color={focused ? "#00d6a1" :  "#444444"}/>
                  )
                }}/>
  
              </Tabs.Navigator>
            </NavigationContainer>
        </>
        
        );
      }
      else {
        return (
          <>
          <NavigationContainer>
              <Tabs.Navigator
                // default configuration from React Navigation
                tabBarOptions={{
                  activeTintColor: "#00d6a1",
                  inactiveTintColor: "#ddd",
                  activeBackgroundColor: "#004030",
                  tabStyle: {
                    borderTopColor: "#222222",
                    borderTopWidth: 1,
                  }
                }}
                appearance={{
                  tabBarBackground: "#121212",
                  dotCornerRadius: 100,
                }}
              >
                <Tabs.Screen name={"Home"} component={Pages.Pathways} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"cube"} size={20} color={focused ? "#00d6a1" :  "#444444"}/>
                  )
                }} />
                <Tabs.Screen name="Devices" component={Pages.Device} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"layers"} size={20} color={focused ? "#00d6a1" :  "#444444"}/>
                  )
                }}/>
                <Tabs.Screen name="Users" component={Pages.Users} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"people"} size={20} color={focused ? "#00d6a1" :  "#444444"}/>
                  )
                }}/>
                <Tabs.Screen name="Account" component={Pages.Account} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"person"} size={20} color={focused ? "#00d6a1" :  "#444444"}/>
                  )
                }}/>
  
              </Tabs.Navigator>
            </NavigationContainer>
        </>
        
        );
      }
      
    }
}