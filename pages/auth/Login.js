import React, {Component} from 'react';
import { StyleSheet,StatusBar, Appearance, Alert, Image, Text, TextInput, View, ImageBackground, Animated, Dimensions, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native';
import { Button as ElementButton } from 'react-native-elements';
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faPray, faEnvelope, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { NavigationContainer } from '@react-navigation/native';
import { render } from 'react-dom';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import {Objects} from '../../components/index';

const Button = Objects.Server.withPressAnimation(ElementButton);

var webStyles;
var Colors;

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
        buttonLoading: false,
        colors: Appearance.getColorScheme(),
        colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
    }

    this.onSignIn = this.onSignIn.bind(this)
  }

  async onSignIn() {
    this.setState({buttonLoading: true});

    const { email, password } = this.state;

    if (email == "" || password == "") {
      this.presentError("Please Enter the Correct Information");
      this.setState({buttonLoading: false});

    }
    else {
      const result = await axios.post("https://manage.medibound.com/api/checkUserAccount", {email: email}).catch(err => {
        firebase.auth().signInWithEmailAndPassword(email + "@example.com", password)
            .then((result) => {
                console.log(result);
                this.setState({buttonLoading: false});
            })
            .catch((error) => {
                  console.log(error)
                  this.presentError(error.message);
                  this.setState({buttonLoading: false});
                
            })
      });
      console.log(result);
      if (result.data == false && email != "" && password != "")  {
        this.presentError("Admin Accounts Cannot Login Here");
        this.setState({buttonLoading: false});

      }
      else if (result.data == true) {
        this.setState({buttonLoading: true});
          await firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            console.log(result);
            this.setState({buttonLoading: false});
          }).catch((error) => {
            console.log(error)
            this.setState({buttonLoading: false});
            
            this.presentError(error.message);
          });
        
      }
    }
  }

  presentError(message) {
    this.setState({buttonLoading: false});
    this.setState({errorMessage: message});
    if (Platform.OS == 'ios') {
      Alert.alert("Login Error", message)
    }
    else {
      Animated.timing(this.state.fadeError, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
    
  }


  componentDidMount() {
    Dimensions.addEventListener("change", this.onChange);
    Appearance.addChangeListener(this.onAppThemeChanged);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onChange);
    Appearance.addChangeListener(this.onAppThemeChanged);

  }
  onAppThemeChanged = (theme) => {
    const currentTheme = Appearance.getColorScheme();
    this.setState({colors: currentTheme});
    this.setState({colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)})
  };

  setFocus1 (input1) {
    this.setState({input1});
  }

  setFocus2 (input2) {
    this.setState({input2});
  }

  render() {


    Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
    webStyles = setStyle(Colors);

    return (
    <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
    <SafeAreaView style={{backgroundColor: Colors.backgroundLightestColor, flex: 1}} >  
    <ScrollView alwaysBounceHorizontal={true} contentContainerStyle={{flexGrow: 1}}>
        <View style={webStyles.innerbody}>


          <View style={[webStyles.login, {minHeight: "auto", marginVertical: 20, alignSelf: 'center'}]}>
            <View style={{flexDirection: 'column', width: "100%", justifyContent: 'flex-start', alignItems:'flex-start', alignContent: 'center'}}>
              <View ><Text style={{"fontSize" : 35,"fontWeight" : '900', "letterSpacing" : 0,color: Colors.barColor}}>Welcome Back,</Text></View>
              <View style={webStyles.loginTitle}><Text style={{"fontSize" : 20,"fontWeight" : '700', "letterSpacing" : 0,color: Colors.lighterText}}>Log in to Your Account</Text></View>
            </View>

            <Text style={{color: this.state.input1 ? Colors.barColor : Colors.lighterText, alignSelf: "flex-start", marginBottom: 5, fontSize: 14, fontWeight: "700"}}>Email</Text>
            <Ionicons name={"mail"} style={this.state.input1 ? webStyles.loginIconFocus : webStyles.loginIcon} size={15} />
            <TextInput
              style={[this.state.input1 ? webStyles.loginInputFocus : webStyles.loginInput]}
              placeholder="Email"
              placeholderTextColor={this.state.input1 ? Colors.barColor : Colors.lighterText}
              keyboardType="email-address"
              onSubmitEditing={() => this.onSignIn()}
              onFocus={this.setFocus1.bind(this, true)}
              onBlur={this.setFocus1.bind(this, false)}
              autoCompleteType="email"
              onChangeText={(email) => this.setState({email: email})}
            />
            <Text style={{color: this.state.input2 ? Colors.barColor : Colors.lighterText, alignSelf: "flex-start", marginBottom: 5, fontSize: 14, fontWeight: "700"}}>Password</Text>
            <Ionicons name={"lock-closed"} style={this.state.input2 ? webStyles.loginIconFocus : webStyles.loginIcon} size={15} />
            <TextInput
              style={[this.state.input2 ? webStyles.loginInputFocus : webStyles.loginInput]}              
              placeholder="Password"
              keyboardType="default"
              placeholderTextColor={this.state.input2 ? Colors.barColor : Colors.lighterText}
              secureTextEntry={true}
              onSubmitEditing={() => this.onSignIn()}
              onFocus={this.setFocus2.bind(this, true)}
              onBlur={this.setFocus2.bind(this, false)}
              autoCompleteType="password"
              onChangeText={(password) => this.setState({password: password})}
            />
            
            <Animated.View style={[webStyles.error, {opacity: this.state.fadeError}, {display: this.state.displayError}]} >
              <FontAwesomeIcon style={webStyles.errorIcon} icon={ faExclamationCircle } />
              <Text style={{color: "white", fontWeight: "400",padding: 5}}>{this.state.errorMessage}</Text>
            </Animated.View>

            <Button titleStyle={{color: Colors.lighterText,fontSize: 14}} buttonStyle={webStyles.flipButton} containerStyle={webStyles.loginButtonContainer} onPress={() => this.props.navigation.navigate("Register")} color="black" title="CREATE AN ACCOUNT"/>

            <Button loading={this.state.buttonLoading} loadingProps={{ color: Colors.primaryColor}} titleStyle={{"color": Colors.primaryColor,fontWeight: "600", fontSize:16,justifyContent:"center",alignContent:"center"}} containerStyle={webStyles.loginButtonContainer} buttonStyle={webStyles.loginButton} 
              title="LOG IN"
              onPress={() => this.onSignIn()}
              color="transparent"/>

          </View>

          
          <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle={Colors.darkMode ? "light-content" : "dark-content"} />
        </View>
    </ScrollView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
    )
  }
}
function setStyle(Colors) {
  return StyleSheet.create({
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
      "overflow": "hidden",
      "fontSize": 13
    },



    loginTitle: {
      "display": "flex",
      "flexDirection": "row",
      "alignContent": "center",
      "justifyContent": "center",
      "textAlign": "center",
      "alignItems": "center",
      "marginTop" : 0,
      "marginBottom" : 35,
    },


    loginInputFocus: {
      "marginBottom": 10,
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 40,
      "borderColor": Colors.barColor,
      "borderWidth": 1,
      "backgroundColor": Colors.backgroundLightestColor,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 50,
      color: Colors.lighterText
    },

    loginIcon: {
      "width": 15,
      "zIndex": 10,
      "left" : 15,
      "position" : "relative",
      "top": 34,
      "marginTop":-15,
      "alignSelf": "flex-start",
      "color": Colors.lighterText,
    },

    loginIconFocus: {
      "width": 15,
      "zIndex": 10,
      "left" : 15,
      "position" : "relative",
      "top": 34,
      "marginTop":-15,
      "alignSelf": "flex-start",
      "color": Colors.barColor
    },


    loginButtonContainer: {
      "width": 150,
    },

    error: {
      display: "none",
      "justifyContent" : "center",
      "paddingLeft": 35,
      "backgroundColor": "#d36e6e",
      "textAlign": "left",
      "lineHeight": 25,
      "borderWidth": 0,
      "borderColor": "black",
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": "auto",
      "color": "white",
      "overflow": "hidden",
      "fontFamily": "sfd-light",
      "fontWeight": "400"
    },

    errorIcon: {
      "width": 13,
      "zIndex": 2,
      "position": "absolute",
      "top" : 6,
      "left" : 10,
      "color": "white"
    },

    flipButton: {
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 2.5,
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
      "width": "100%",
      "height": 45
    },
    login: {
      "flexDirection": "column",
      "alignContent": "center",
      "justifyContent": "center",
      "textAlign": "center",
      "alignItems": "center",
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
      "borderColor": Colors.backgroundDarkestColor,
      "backgroundColor": Colors.backgroundDarkestColor,
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 50,
      color: Colors.lighterText

    },
    loginButton: {
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 2.5,
      "backgroundColor": Colors.secondaryColor,
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
      "width": "100%",
      "height": 45
    },
    loginButtonContainer: {
      "width": "100%",
      "marginTop": 10,
      borderRadius: 7.5,
    },
    innerbody: {
      "flexDirection": "column",
      "width": "100%",
      "height": "100%",
      "alignSelf": "flex-start",
      "justifyContent": "center",
      "overflow": "hidden",
      "fontSize": 13
    },
  });
}


  
  export default Login;