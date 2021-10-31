import React, {Component, useEffect, usetst} from 'react';
import { StyleSheet, KeyboardAvoidingView, StatusBar, Text, TextInput, View, ImageBackground, Dimensions, Button, Easing, SafeAreaView, Keyboard, Animated} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import NavigationBar from 'react-native-navbar-color'
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
import { ColorSchemeProvider } from 'react-native-dynamic'


import firebase from 'firebase';
import {injectWebCss} from './pages/libraries/css'

import {Pages} from './pages/index';

import {Objects} from './components/index'
import { render } from 'react-dom';

const Colors = Objects.Vars.Colors;

injectWebCss();

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

NavigationBar.setColor('#121212')


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

console.log(window.height-screen.height)

var showTopBar = true;

export class AppContainer extends Component {

  _isMounted = false;

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    };
  
  }

  componentDidMount = async() => {


    firebase.firestore().settings({ experimentalForceLongPolling: true });

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
          })
          
        }
      }
      });
    
    
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {

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
        <SafeAreaProvider initialMetrics={initialWindowMetrics} style={{backgroundColor: Colors.backgroundColor}}>
          <NavigationContainer >
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={Pages.Auth.Login} options={{ headerShown: false, headerTitleStyle:{color: "white"}, headerTransparent: true, headerBackTitleStyle: {color: "black"}} } navigation={this.props.navigation}/>
              <Stack.Screen name="Register" component={Pages.Auth.Register} options={{ headerShown: false,  headerTitleStyle:{color: "white"}, headerTransparent: true,...MyTransition }}/>
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>  
      );
    }


    return (
      <SafeAreaProvider initialMetrics={initialWindowMetrics} style={{backgroundColor: Colors.backgroundColor, position: "absolute", height: screen.height-(screen.height-window.height+StatusBar.currentHeight), width: screen.width, }}> 
          <Host>
          <Objects.Navigation.BottomTab mode={this.props.mode}/>
          </Host>
      </SafeAreaProvider>
      
    );
  }
}

export class App extends Component {
  render() {
    return(
      <>
      	<ColorSchemeProvider mode="dark">
          <AppContainer mode="dark"/>
        </ColorSchemeProvider>
      </>
    )
  }
  
}

export default App;

