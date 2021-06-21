import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst} from 'react';
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
import BottomSheet from 'react-native-bottomsheet-reanimated';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Host, Portal } from 'react-native-portalize';

import * as Linking from 'expo-linking';

import firebase from 'firebase';
import {injectWebCss} from './pages/libraries/css'

import {Pages} from './pages/index';
import {Objects} from './components/index'

injectWebCss();

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");


const Screen = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
};

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4suI2UA6Us7ezsvsRpjCO5vdoMheuNlg",
  authDomain: "medibound-87c8a.firebaseapp.com",
  projectId: "medibound-87c8a",
  storageBucket: "medibound-87c8a.appspot.com",
  messagingSenderId: "1047243459021",
  appId: "1:1047243459021:web:f8c1e9e4df6f5d18b61c84",
  measurementId: "G-4NJ8B9CSZ6"
};

if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator();

const prefix = Linking.createURL('/');

const MyTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forSlideUp,
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.5],
                })
              : 1,
          },
          {
            scale: current
              ? current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                })
              : 1,
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0],
        }),
      },
    };
  },
}

var showTopBar = true;

export class App extends Component {

  _isMounted = false;

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    };
  
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

    const {loggedIn, loaded} = this.state;

    if (Keyboard) {
      showTopBar = false
    }
    else {
      showTopBar = true;
    }

    

    if (!loaded) {
      return (
        <View style={{width: "100%", height: "100%", alignItems: "center", alignContent: "center", justifyContent: "center"}}>
        </View>
        
      );
    }
    if (!loggedIn) {
      return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <NavigationContainer linking={linking}>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={Pages.Auth.Login} options={{ headerShown: false, headerTitleStyle:{color: "black"}, headerBackTitleStyle: {color: "black"}} } navigation={this.props.navigation}/>
              <Stack.Screen name="Register" component={Pages.Auth.Register} options={{ headerShown: showTopBar, ...MyTransition ,headerBackImage: () => <Ionicons style={{paddingLeft: 0}} name="chevron-back-circle-outline" size={36} color="rgb(68, 199, 188)"/>, headerBackTitleVisible: false, headerTransparent: true, headerTitle: false,} } navigation={this.props.navigation}/>
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>  
      );
    }


    return (
      <SafeAreaProvider initialMetrics={initialWindowMetrics} style={{backgroundColor: "white", position: "relative" }}> 
          <Objects.Navigation.BottomTab/>
      </SafeAreaProvider>
      
    );
  }
}

export default App

