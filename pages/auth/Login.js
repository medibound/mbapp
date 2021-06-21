import React, {Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, Text, TextInput, View, ImageBackground, Animated, Dimensions, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faPray, faEnvelope, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { NavigationContainer } from '@react-navigation/native';
import { render } from 'react-dom';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';


const window = Dimensions.get("window");
const screen = Dimensions.get("screen");


export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        email: '',
        password: '',
        errorMessage: '',
        fadeError: new Animated.Value(0),
        dimensions: {
          window,
          screen
        },
        input1: false,
        input2: false,
    }

    this.onSignIn = this.onSignIn.bind(this)
  }

  onSignIn() {
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error)
            this.setState({errorMessage: error.message});
            Animated.timing(this.state.fadeError, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }).start();
        })
  }

  

  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
    if (window.width < 801) {
      styles = StyleSheet.flatten([webStyles,mobileStyles]);
    }
    else {
      styles = webStyles;
    }
  };

  componentDidMount() {
    Dimensions.addEventListener("change", this.onChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onChange);
  }

  setFocus1 (input1) {
    this.setState({input1});
  }

  setFocus2 (input2) {
    this.setState({input2});
  }

  render() {
    return (
    <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
    <SafeAreaView style={{backgroundColor: "white", flex: 1}} >  
    <ScrollView alwaysBounceHorizontal={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
    <ImageBackground source={require('../../src/assets/img/hex.jpg')} style={styles.body}>    
      <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 1)']} style={styles.linearGradient}>
        <View style={styles.innerbody}>

          <View style={styles.loginimg}>
            <ImageBackground source={require('../../src/assets/img/hex.jpg')} style={styles.image}>
              <LinearGradient colors={['rgba(74, 191, 217, 0.7)', 'rgba(114, 212, 192,1)']} style={styles.linearGradient}>
                
              </LinearGradient>
            </ImageBackground>
          </View>

          <View style={[styles.login, {minHeight: "auto", marginVertical: 20, alignSelf: 'center'}]}>
            <View style={{flexDirection: 'row', width: "95%", justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
              <Ionicons name="cube" size={30} color="rgb(68, 199, 188)" style={{marginBottom: 10, marginRight: 10}}/>
              <View style={styles.loginTitle}><Text style={{"fontSize" : 18,"fontWeight" : '600', "letterSpacing" : 3,color: "#777777"}}>SIGN IN TO MEDIBOUND</Text></View>
            </View>
            <Ionicons name={"mail"} style={this.state.input1 ? styles.loginIconFocus : styles.loginIcon} size={15} />
            <TextInput
              style={this.state.input1 ? styles.loginInputFocus : styles.loginInput}
              placeholder="Email"
              placeholderTextColor={this.state.input1 ? "rgb(68, 199, 188)" : "#b0b4b3"}
              keyboardType="email-address"
              onSubmitEditing={() => this.onSignIn()}
              onFocus={this.setFocus1.bind(this, true)}
              onBlur={this.setFocus1.bind(this, false)}
              autoCompleteType="email"
              onChangeText={(email) => this.setState({email: email})}
            />
            <Ionicons name={"lock-closed"} style={this.state.input2 ? styles.loginIconFocus : styles.loginIcon} size={15} />
            <TextInput
              style={this.state.input2 ? styles.loginInputFocus : styles.loginInput}              
              placeholder="Password"
              keyboardType="default"
              placeholderTextColor={this.state.input2 ? "rgb(68, 199, 188)" : "#b0b4b3"}
              secureTextEntry={true}
              onSubmitEditing={() => this.onSignIn()}
              onFocus={this.setFocus2.bind(this, true)}
              onBlur={this.setFocus2.bind(this, false)}
              autoCompleteType="password"
              onChangeText={(password) => this.setState({password: password})}
            />
            
            <Animated.View style={[styles.error, {opacity: this.state.fadeError}, {display: this.state.displayError}]} >
              <FontAwesomeIcon style={styles.errorIcon} icon={ faExclamationCircle } />
              <Text style={{color: "#d36e6e", fontWeight: "400",padding: 5}}>{this.state.errorMessage}</Text>
            </Animated.View>

            <Button titleStyle={{color: "#777777",fontSize: 12,textDecorationLine:"underline"}} buttonStyle={styles.flipButton} onPress={() => this.props.navigation.navigate("Register")} color="black" title="CREATE AN ACCOUNT"/>

            <Button titleStyle={{fontWeight: "600", fontSize:16,justifyContent:"center",alignContent:"center"}} containerStyle={styles.loginButtonContainer} buttonStyle={styles.loginButton} 
              title="LOG IN"
              onPress={() => this.onSignIn()}
              color="transparent"/>

          </View>

          
          <StatusBar style="auto" backgroundColor="rgb(68, 199, 188)" barStyle="dark-content" />
        </View>
      </LinearGradient>
    </ImageBackground>
    </ScrollView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
    )
  }
}

var webStyles = StyleSheet.create({
    image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },

    linearGradient: {
      width: '100%',
      height: '100%',
      opacity: 1,
      justifyContent: 'center',
      alignItems: 'center',
      "paddingTop": 40,
      "paddingRight": 40,
      "paddingBottom": 40,
      "paddingLeft": 40,
    },

    body: {
      "marginTop": 0,
      "marginRight": 0,
      "marginBottom": 0,
      "marginLeft": 0,
      "display": "flex",
      "width": "100%",
      "height": "100%",
      "flexDirection": "row",
      "flexWrap": "wrap",
      "alignItems": "center",
      "justifyContent": "center",
      "fontFamily" : "SFCompactDisplay-SemiBold",
    },

    innerbody: {
      "flexDirection": "row",
      "width": 800,
      "height": 550,
      "alignSelf": "center",
      "justifyContent": "center",
      borderRadius: 10,
      "backgroundColor": "white",
      "shadowOffset": {
        "width": 0,
        "height": 0
      },
      "shadowRadius": 50,
      "shadowColor": "rgba(0,0,0,0.15)",
      "shadowOpacity": 1,
      "overflow": "hidden",
      "fontSize": 13
    },

    loginimg: {
      "width": "40%",
      "zIndex": -1,
    },

    login: {
      "flexDirection": "column",
      "alignContent": "center",
      "justifyContent": "center",
      "textAlign": "center",
      "alignItems": "center",
      "backgroundColor": "white",
      "width": "60%",
      "paddingTop": 40,
      "paddingRight": 40,
      "paddingBottom": 40,
      "paddingLeft": 40
    },

    loginTitle: {
      "display": "flex",
      "flexDirection": "row",
      "alignContent": "center",
      "justifyContent": "center",
      "textAlign": "center",
      "alignItems": "center",
      "marginTop" : 20,
      "marginBottom" : 30,
    },

    loginInput: {
      "marginBottom": 10,
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 40,
      "backgroundColor": "#f4f8f7",
      "borderColor": "#dae0df",
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 50
    },

    loginInputFocus: {
      "marginBottom": 10,
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 40,
      "backgroundColor": "rgb(240, 255, 254)",
      "borderColor": "rgb(68, 199, 188)",
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 50
    },

    loginIcon: {
      "width": 15,
      "zIndex": 10,
      "left" : 15,
      "position" : "relative",
      "top": 34,
      "marginTop":-15,
      "alignSelf": "flex-start",
      "color": "#b0b4b3"
    },

    loginIconFocus: {
      "width": 15,
      "zIndex": 10,
      "left" : 15,
      "position" : "relative",
      "top": 34,
      "marginTop":-15,
      "alignSelf": "flex-start",
      "color": "rgb(68, 199, 188)"
    },

    loginForm: {
      "flexDirection": "column",
      "textAlign": "center",
      "alignItems": "center",
      "width": "100%"
    },

    loginButton: {
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 2.5,
      "backgroundColor": "rgb(68, 199, 188)",
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
      borderRadius: 5,
      "width": 150,
      "height": 40
    },

    loginButtonContainer: {
      "width": 150,
    },

    error: {
      display: "none",
      "justifyContent" : "center",
      "paddingLeft": 35,
      "backgroundColor": "#ffe0e0",
      "textAlign": "left",
      "lineHeight": 25,
      "borderWidth": 0,
      "borderColor": "black",
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": "auto",
      "color": "#d36e6e",
      "overflow": "hidden",
      "fontFamily": "sfd-light",
      "fontWeight": "400"
    },

    errorIcon: {
      "width": 13,
      "zIndex": 2,
      "position": "absolute",
      "top" : 7,
      "left" : 10,
      "color": "#d36e6e"
    },

    flipButton: {
      "backgroundColor" : "transparent",
      height: 35,
    }
  });

  const mobileStyles = StyleSheet.create({
    linearGradient: {
      width: '100%',
      height: '100%',
      opacity: 1,
      justifyContent: 'center',
      alignItems: 'center',
      "paddingTop": 0,
      "paddingRight": 0,
      "paddingBottom": 0,
      "paddingLeft": 0,
    },
    login: {
      "flexDirection": "column",
      "alignContent": "center",
      "justifyContent": "center",
      "textAlign": "center",
      "alignItems": "center",
      "backgroundColor": "white",
      "width": "90%",
      "paddingTop": 0,
      "paddingRight": 0,
      "paddingBottom": 0,
      "paddingLeft": 0
    },
    loginimg: {
      display: "none",
    },
    loginInput: {
      "marginBottom": 10,
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 40,
      "backgroundColor": "#f4f8f7",
      "borderColor": "#dae0df",
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 50
    },
    loginButton: {
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 2.5,
      "backgroundColor": "rgb(68, 199, 188)",
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
      borderRadius: 5,
      "width": "100%",
      "height": 45
    },
    loginButtonContainer: {
      "width": "100%",
    },
    innerbody: {
      "flexDirection": "row",
      "width": "100%",
      "height": "100%",
      "alignSelf": "center",
      "justifyContent": "center",
      "backgroundColor": "white",
      borderRadius: 5,
      "shadowOffset": {
        "width": 0,
        "height": 0
      },
      "shadowRadius": 50,
      "shadowColor": "rgba(0,0,0,0.15)",
      "shadowOpacity": 1,
      "overflow": "hidden",
      "fontSize": 13
    }
  });

  var styles = webStyles;

  if (window.width < 801) {
    styles = StyleSheet.flatten([webStyles,mobileStyles]);
  }
  else {
    styles = webStyles;
  }
  
  export default Login;