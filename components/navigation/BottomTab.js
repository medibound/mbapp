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

import * as Linking from 'expo-linking';

import firebase from 'firebase';

import {Pages} from '../../pages/index';
import { screensEnabled } from 'react-native-screens';

const Tab = createBottomTabNavigator();
const prefix = Linking.createURL('/');

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default class BottomTab extends Component {

    _isMounted = false;

    constructor(props) {
      super(props)
      this.state = {
        loaded: false,
        bounceValue1: new Animated.Value(1),
        bounceValue2: new Animated.Value(1),
        bounceValue3: new Animated.Value(1),
        bounceValue4: new Animated.Value(1),
        areResourcesReady: false,
        account: "",
        tabAltName: "Null",
        tabAltComp: Pages.Users,
      };
      if (firebase.auth().currentUser) {
        this.data = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
          this.setState({
              account: doc.data().accounttype,
          })
        });
      };

      this.bounce1.bind(this);
      this.bounce2.bind(this);
      this.bounce3.bind(this);
      this.bounce4.bind(this);
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
            firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
              var accounttype = doc.data().accounttype;
              this.setState({
                  account: doc.data().accounttype,
              })
              if(accounttype == 0) {
                this.setState({
                  tabAltName: "Partners",
                  tabAltComp: Pages.Partners,
                });
                console.log("success");
                if (this.state.tabAltName == "Users" || this.state.tabAltName == "Partners") {
                  this.setState({
                    loggedIn: true,
                    loaded: true,
                  });
                }
                console.log("load");
              }
              else if (accounttype == 1) {
                this.setState({
                  tabAltName: "Users",
                  tabAltComp: Pages.Users,
                });
                if (this.state.tabAltName == "Users" || this.state.tabAltName == "Partners") {
                  this.setState({
                    loggedIn: true,
                    loaded: true,
                  });
                }
                console.log("load");
              }
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

    bounce1(){
        this.state.bounceValue1.setValue(1.1);
        Animated.spring(
          this.state.bounceValue1, {
            useNativeDriver: true,
            toValue: 1,
            friction: 1.5,
          }
        ).start();
    }

    bounce2(){
      this.state.bounceValue2.setValue(1.1);
      Animated.spring(
        this.state.bounceValue2, {
          useNativeDriver: true,
          toValue: 1,
          friction: 1.5,
        }
      ).start();
    }

    bounce3(){
      this.state.bounceValue3.setValue(1.1);
      Animated.spring(
        this.state.bounceValue3, {
          useNativeDriver: true,
          toValue: 1,
          friction: 1.5,
        }
      ).start();
    }

    bounce4(){
      this.state.bounceValue4.setValue(1.1);
      Animated.spring(
        this.state.bounceValue4, {
          useNativeDriver: true,
          toValue: 1,
          friction: 1.5,
        }
      ).start();
    }


    render() {
  
      const linking = {
        prefixes: [prefix],
        config: {
          screens: {
            Login: 'login',
            Register: 'join',
            Home: '',
            Devices: 'devices',
            Users: 'users',
            Partners: 'partners',
            Account: 'account'
          }
        },
      };
    
      return (
        <>
        <NavigationContainer linking={linking}  >
          <Host>
          <Tab.Navigator 
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let bounceLabel;

              if (route.name === 'Home') {
                iconName = focused 
                  ? 'cube' 
                  : 'cube-outline';
                bounceLabel = focused 
                ? this.state.bounceValue1
                : 1;
              }
              else if (route.name === 'Devices') {
                iconName = focused 
                  ? 'layers' 
                  : 'layers-outline';
                bounceLabel = focused 
                ? this.state.bounceValue2
                : 1;
              }
              else if (route.name === 'Users') {
                iconName = focused
                  ? 'people'
                  : 'people-outline';
                bounceLabel = focused 
                ? this.state.bounceValue3
                : 1;
              }
              else if (route.name === 'Partners') {
                iconName = focused
                  ? 'business'
                  : 'business-outline';
                bounceLabel = focused 
                ? this.state.bounceValue3
                : 1;
              }  
              else if (route.name === 'Account') {
                iconName = focused 
                  ? 'person' 
                  : 'person-outline';
                bounceLabel = focused 
                  ? this.state.bounceValue4
                  : 1;
              }

              // You can return any component that you like here!
              return (
                <Animated.View  >
                  <TouchableHighlight  style={{scaleX: bounceLabel, scaleY: bounceLabel}}>
                    <Ionicons name={iconName} size={27} color={color}/>
                  </TouchableHighlight>
                </Animated.View>);
            },
          })}
          tabBarOptions={{
            activeTintColor: 'rgb(68, 199, 188)',
            inactiveTintColor: '#777777',
            allowFontScaling: true,
            style: { position: "relative",  marginTop: 5, shadowColor: "white", elevation: 0, borderTopWidth: 0, borderTopColor: "#dae0df",   backgroundColor: "white", marginBottom: 0,  "shadowOffset": {"width": 0,"height": -10},"shadowRadius": 50,"shadowColor": "#fbfbfb","shadowOpacity": 1,},
            tabStyle: { backgroundColor: "white", },
            labelStyle: {paddingBottom: 10},
          }} 
        >
            <Tab.Screen name="Home" component={Pages.Home} listeners={({ navigation, route }) => ({
              tabPress: e => {
                // Prevent default action
                e.preventDefault();
                this.bounce1();
                navigation.navigate('Home');
              },
            })}/>
            <Tab.Screen name="Devices" component={Pages.Devices} listeners={({ navigation, route }) => ({
              tabPress: e => {
                // Prevent default action

                e.preventDefault();
                this.bounce2();
                navigation.navigate("Devices");
              },
            })}/>
            <Tab.Screen name={this.state.tabAltName} component={this.state.tabAltComp} listeners={({ navigation, route }) => ({
              tabPress: e => {
                // Prevent default action
                e.preventDefault();
                this.bounce3();
                navigation.navigate(this.state.tabAltName);
              },
            })}/>
            <Tab.Screen name="Account" component={Pages.Account} listeners={({ navigation, route }) => ({
              tabPress: e => {
                // Prevent default action
                e.preventDefault();
                this.bounce4();
                navigation.navigate('Account');
              },
            })}
            />
          </Tab.Navigator>
          </Host>
        </NavigationContainer>
      </>
      );
    }
}