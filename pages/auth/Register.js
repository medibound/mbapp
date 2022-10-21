import React, {Component} from 'react';
import { StyleSheet, Text, TextInput, Alert, View, Appearance, ImageBackground, StatusBar, Animated, Dimensions, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Modal} from 'react-native';
import { Button as ElementButton } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock, faMailBulk, faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons';
import { NavigationContainer } from '@react-navigation/native';
import { render } from 'react-dom';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

import {Objects} from '../../components/index';

const Button = Objects.Server.withPressAnimation(ElementButton);


var webStyles;
var Colors;


const UserForm = ({accountType, item, state}) => {
   if (true) {
    return (
        <>
  
          <Ionicons name={"person"} style={webStyles.registerIcon} size={15} color={state.state.input1 ? Colors.barColor : Colors.lighterText} />
  
          <View style={webStyles.registerInputNameStyle}>
            <TextInput
              style={state.state.input1 ? webStyles.registerInputNameFocus : webStyles.registerInputName}
              placeholderTextColor={state.state.input1 ? Colors.barColor : Colors.lighterText}
              placeholder="First Name"
              keyboardType="default"
              onSubmitEditing={() => item.onSignUp()}
              onFocus={state.setFocus1.bind(state, true)}
              onBlur={state.setFocus1.bind(state, false)}
              autoCompleteType="off"
              onChangeText={(firstname) => item.setState({firstname: firstname.trim()})}
            />
  
            <TextInput
              style={[state.state.input2 ? webStyles.registerInputNameFocus : webStyles.registerInputName, {paddingLeft: 20}]}
              placeholderTextColor={state.state.input2 ? Colors.barColor : Colors.lighterText}
              placeholder="Last Name"
              keyboardType="default"
              onSubmitEditing={() => item.onSignUp()}
              onFocus={state.setFocus2.bind(state, true)}
              onBlur={state.setFocus2.bind(state, false)}
              autoCompleteType="off"
              onChangeText={(lastname) => item.setState({lastname: lastname.trim()})}
            />
          </View>
          
  
        </>
    );
  }
}


class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      firstname: '',
      lastname: '',
      password: '',
      passwordconfirm: '',
      accounttype: 0,
      errorMessage: '',
      fadeError: new Animated.Value(0),
      dimensions: {
        window,
        screen
      },
      buttonLoading: false,
      input1: false,
      input2: false,
      input3: false,
      input4: false,
      input5: false,
      input6: false,
      colors: Appearance.getColorScheme(),
      colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
    }

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    this.setState({buttonLoading: true});

    const { email,username, firstname, lastname, accounttype, password, passwordconfirm  } = this.state;
    if (username.trim() != "" || (firstname != "" && lastname != "")) {
      if (passwordconfirm == password) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(result.user.uid)
                    .set({
                        firstname: firstname,
                        lastname: lastname,
                        accounttype: accounttype,
                        email: email,
                    });
                firebase.auth().currentUser.updateProfile({displayName: firstname + " " + lastname});
                this.setState({buttonLoading: false});

            })
            .catch((error) => {
                console.log(error);
                this.presentError(error.message)
                this.setState({buttonLoading: false});

            })
        }
        else {
          this.presentError("Passwords Must Match")
          this.setState({buttonLoading: false});

      }
    }
    else {
        this.presentError("A full name is required for sign up")
        this.setState({buttonLoading: false});

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

  setFocus3 (input3) {
    this.setState({input3});
  }

  setFocus4 (input4) {
    this.setState({input4});
  }
  
  setFocus5 (input5) {
    this.setState({input5});
  }

  setFocus6 (input6) {
    this.setState({input6});
  }

  render() {

    Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
    webStyles = setStyle(Colors);

    return (
      <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
      <SafeAreaView style={{backgroundColor: Colors.backgroundLightestColor, flex: 1}}>
      <ScrollView alwaysBounceHorizontal={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View  style={webStyles.linearGradient}>
          <View style={webStyles.innerbody}>
            <View style={[webStyles.register, {minHeight: "auto", marginVertical: 20, alignSelf: 'center'}]}>
              
            <View style={{flexDirection: 'column', width: "100%", justifyContent: 'flex-start', alignItems:'flex-start', alignContent: 'center'}}>
              <View ><Text style={{"fontSize" : 28,"fontWeight" : '900', "letterSpacing" : 0,color: Colors.barColor}}>Welcome to medibound,</Text></View>
              <View style={webStyles.registerTitle}><Text style={{"fontSize" : 20,"fontWeight" : '700', "letterSpacing" : 0,color: Colors.lighterText}}>Create A Secure Account</Text></View>
            </View>

              <UserForm accountType={this.state.accounttype} item={this} state={this}/>
              
              <Ionicons name={"mail"} style={webStyles.registerIcon} color={this.state.input3 ? Colors.barColor : Colors.lighterText} size={15} />
              <TextInput
                style={this.state.input3 ? webStyles.registerInputFocus : webStyles.registerInput}
                placeholderTextColor={this.state.input3 ? Colors.barColor : Colors.lighterText}
                placeholder="Email"
                keyboardType="email-address"
                onSubmitEditing={() => this.onSignUp()}
                onFocus={this.setFocus3.bind(this, true)}
                onBlur={this.setFocus3.bind(this, false)}
                autoCompleteType="email"
                onChangeText={(email) => this.setState({email: email})}
              />
              <Ionicons name={"lock-closed"} style={webStyles.registerIcon} color={this.state.input4 ? Colors.barColor : Colors.lighterText} size={15} />
              <TextInput
                style={this.state.input4 ? webStyles.registerInputFocus : webStyles.registerInput}
                placeholderTextColor={this.state.input4 ? Colors.barColor : Colors.lighterText}
                placeholder="Password"
                keyboardType="default"
                onSubmitEditing={() => this.onSignUp()}
                onFocus={this.setFocus4.bind(this, true)}
                onBlur={this.setFocus4.bind(this, false)}
                autoCompleteType="password"
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password: password})}
              />
              <Ionicons name={"lock-closed-outline"} style={webStyles.registerIcon} color={this.state.input5 ? Colors.barColor : Colors.lighterText} size={15} />
              <TextInput
                style={this.state.input5 ? webStyles.registerInputFocus : webStyles.registerInput}
                placeholderTextColor={this.state.input5 ? Colors.barColor : Colors.lighterText}
                placeholder="Confirm Password"
                keyboardType="default"
                onSubmitEditing={() => this.onSignUp()}
                onFocus={this.setFocus5.bind(this, true)}
                onBlur={this.setFocus5.bind(this, false)}
                autoCompleteType="password"
                secureTextEntry={true}
                onChangeText={(passwordconfirm) => this.setState({passwordconfirm: passwordconfirm})}
              />
      
              <Animated.View style={[webStyles.error, {opacity: this.state.fadeError}, {display: this.state.displayError}]} >
                <FontAwesomeIcon style={webStyles.errorIcon} icon={ faExclamationCircle } />
                <Text style={{color: Colors.lighterText, fontWeight: "400",padding: 5}}>{this.state.errorMessage}</Text>
              </Animated.View>
      
              <Button titleStyle={{color: Colors.lighterText,fontSize: 14}} buttonStyle={webStyles.flipButton} onPress={() => this.props.navigation.navigate("Login")} containerStyle={webStyles.registerButtonContainer} color="black" title="HAVE AN ACCOUNT? LOG IN"/>
      
              <Button loading={this.state.buttonLoading} loadingProps={{ color: Colors.primaryColor}} titleStyle={{fontWeight: "600", fontSize:16,justifyContent:"center",alignContent:"center", color: Colors.primaryColor}} containerStyle={webStyles.registerButtonContainer} buttonStyle={webStyles.registerButton} 
                  title="SIGN UP"
                  onPress={() => this.onSignUp()}
                  color="transparent"/>
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle={Colors.darkMode ? "light-content" : "dark-content"} />

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
      backgroundColor: Colors.backgroundLightestColor,
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
      backgroundColor: Colors.backgroundLightestColor,
      "flexWrap": "wrap",
      "alignItems": "center",
      "justifyContent": "center",
      "fontFamily" : "SFCompactDisplay-SemiBold",
    },

  
    registerTitle: {
      "display": "flex",
      "flexDirection": "row",
      "alignContent": "center",
      "justifyContent": "center",
      "textAlign": "center",
      "alignItems": "center",
      "marginBottom" : 30,
    },

    accountType: {
      "marginBottom": 10,
      "paddingRight": 2.5,
      "backgroundColor": "#f4f8f7",
      "borderColor": "#dae0df",
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 30,
      "flexDirection" :"row",
      "alignContent": "center",
      "justifyContent": "space-evenly"
    },

    accountTypeButton: {
      "padding": 0,
      "fontSize": 12,
      "color": "#777777",
      "backgroundColor": "transparent",
      "height": 30,
      "borderRadius": 0,
      "alignContent": "center",
      "justifyContent": "center",
      "backgroundColor": "transparent"
    },

    accountTypeButtonActive: {
      "padding": 0,
      "fontSize": 12,
      "color": Colors.barColor,
      "backgroundColor": "transparent",
      "borderBottomColor": Colors.barColor,
      "borderBottomWidth": 4,
      "height": 30,
      "borderRadius": 0,
      "alignContent": "center",
      "justifyContent": "center",
      "backgroundColor": "transparent"
    },

    accountTypeButtonText: {
      "padding": 0,
      "fontSize": 12,
      "color": "#777777",
      "fontWeight": "500",
    },

    accountTypeButtonTextActive: {
      "padding": 0,
      "fontSize": 12,
      "color": Colors.barColor,
      "fontWeight": "500",
    },

    registerInputFocus: {
      "marginBottom": 10,
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 40,
      "backgroundColor": Colors.backgroundLightestColor,
      "borderColor": Colors.barColor,
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 50,
      color: Colors.lighterText,
    },

    registerInputNameFocus: {
      "marginBottom": 10,
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 40,
      "backgroundColor": Colors.backgroundLightestColor,
      "borderColor": Colors.barColor,
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "48.5%",
      "height": 50,
      color: Colors.lighterText,
    },

    registerInputNameStyle: {
      "flexDirection" :"row",
      "width" : "100%",
      padding: 0,
      justifyContent: 'space-between',
      alignItems: "center",
    },  
  
    registerIcon: {
      "width": 15,
      "zIndex": 10,
      "left" : 15,
      "position" : "relative",
      "top": 34,
      "marginTop":-15,
      "alignSelf": "flex-start",
    },
  
    registerForm: {
      "flexDirection": "column",
      "textAlign": "center",
      "alignItems": "center",
      "width": "100%"
    },

    error: {
      display: "none",
      "justifyContent" : "center",
      "paddingLeft": 35,
      "backgroundColor": Colors.errColor,
      "textAlign": "left",
      "lineHeight": 25,
      "borderWidth": 0,
      "borderColor": "black",
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": "auto",
      "color": Colors.lighterText,
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
      "color": Colors.lighterText
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
    linearGradient: {
      width: '100%',
      height: '100%',
      opacity: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.backgroundLightestColor,
      "paddingTop": 0,
      "paddingRight": 0,
      "paddingBottom": 0,
      "paddingLeft": 0,
    },
    register: {
      "flexDirection": "column",
      "alignContent": "center",
      "justifyContent": "center",
      "textAlign": "center",
      "alignItems": "center",
      backgroundColor: Colors.backgroundLightestColor,
      "width": "90%",
      "paddingTop": 0,
      "paddingRight": 0,
      "paddingBottom": 0,
      "paddingLeft": 0
    },
    registerimg: {
      display: "none",
    },
    registerInput: {
      "marginBottom": 10,
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 40,
      "backgroundColor": Colors.backgroundDarkestColor,
      "borderColor": Colors.backgroundDarkestColor,
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 50,
      color: Colors.lighterText,
    },
    registerInputName: {
      "marginBottom": 10,
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 40,
      "backgroundColor": Colors.backgroundDarkestColor,
      "borderColor": Colors.backgroundDarkestColor,
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "48.5%",
      "height": 50,
      color: Colors.lighterText,
    },
    registerButton: {
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
      "color":  Colors.primaryColor,
      "fontFamily": "sfd",
      "fontSize": 13,
      "fontWeight": "400",
      borderRadius: 7.5,
      "width": "100%",
      "height": 45
    },
    registerButtonContainer: {
      "width": "100%",
      "marginTop": 10,
      borderRadius: 7.5,
    },
    innerbody: {
      "flexDirection": "row",
      "width": "100%",
      "height": "100%",
      "minHeight": "100%",
      "alignContent": "center",
      "alignSelf": "center",
      "justifyContent": "center",
      borderRadius: 5,
      backgroundColor: Colors.backgroundLightestColor,
      "overflow": "hidden",
      "fontSize": 13
    }
  });
}


  export default Register;
  