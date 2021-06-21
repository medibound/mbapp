import React, {Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, ImageBackground, Animated, Dimensions, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Modal} from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from "expo-linear-gradient";
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

 

const UserForm = ({accountType, item, state}) => {
  if (accountType == 1)  {
    return (
        <>
          <View style={styles.accountType}><Button containerStyle={{width: "50%"}} buttonStyle={styles.accountTypeButton} titleStyle={styles.accountTypeButtonText} title="CLIENT ACCOUNT" onPress={() => item.setState({accounttype: 0})}></Button><Button buttonStyle={styles.accountTypeButtonActive} containerStyle={{width: "50%"}} titleStyle={styles.accountTypeButtonTextActive} title="BUSINESS ACCOUNT" ></Button></View>
  
          <Ionicons name={"business"} style={styles.registerIcon} size={15} color={state.state.input6 ? "rgb(68, 199, 188)" : "#b0b4b3"}/>
  
          <TextInput
              style={state.state.input6 ? styles.registerInputFocus : styles.registerInput}
              placeholderTextColor={state.state.input6 ? "rgb(68, 199, 188)" : "#b0b4b3"}
              placeholder="Organization Name"
              keyboardType="default"
              onSubmitEditing={() => item.onSignUp()}
              onFocus={state.setFocus6.bind(state, true)}
              onBlur={state.setFocus6.bind(state, false)}
              autoCompleteType="off"
              onChangeText={(username) => item.setState({username: username.trim()})}
            />
  
        </>
    );
  }
  else if (accountType == 0) {
    return (
        <>
          <View style={styles.accountType}><Button containerStyle={{width: "50%"}} buttonStyle={styles.accountTypeButtonActive} titleStyle={styles.accountTypeButtonTextActive} title="CLIENT ACCOUNT"></Button><Button buttonStyle={styles.accountTypeButton} containerStyle={{width: "50%"}} titleStyle={styles.accountTypeButtonText} title="BUSINESS ACCOUNT" onPress={() => item.setState({accounttype: 1})}></Button></View>
  
          <Ionicons name={"person"} style={styles.registerIcon} size={15} color={state.state.input1 ? "rgb(68, 199, 188)" : "#b0b4b3"} />
  
          <View style={styles.registerInputNameStyle}>
            <TextInput
              style={state.state.input1 ? styles.registerInputNameFocus : styles.registerInputName}
              placeholderTextColor={state.state.input1 ? "rgb(68, 199, 188)" : "#b0b4b3"}
              placeholder="First Name"
              keyboardType="default"
              onSubmitEditing={() => item.onSignUp()}
              onFocus={state.setFocus1.bind(state, true)}
              onBlur={state.setFocus1.bind(state, false)}
              autoCompleteType="off"
              onChangeText={(firstname) => item.setState({firstname: firstname.trim()})}
            />
  
            <TextInput
              style={[state.state.input2 ? styles.registerInputNameFocus : styles.registerInputName, {paddingLeft: 20}]}
              placeholderTextColor={state.state.input2 ? "rgb(68, 199, 188)" : "#b0b4b3"}
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
      input1: false,
      input2: false,
      input3: false,
      input4: false,
      input5: false,
      input6: false,
    }

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email,username, firstname, lastname, accounttype, password, passwordconfirm  } = this.state;
    if (username.trim() != "" || (firstname != "" && lastname != "")) {
      if (passwordconfirm == password) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
              if (accounttype == 1) {
                firebase.firestore().collection("users")
                    .doc(result.user.uid)
                    .set({
                        username: username,
                        accounttype: accounttype,
                        email: email,
                    });
                firebase.auth().currentUser.updateProfile({displayName: username})
                console.log(result);
              }
              else {
                firebase.firestore().collection("users")
                    .doc(result.user.uid)
                    .set({
                        firstname: firstname,
                        lastname: lastname,
                        accounttype: accounttype,
                        email: email
                    });
                firebase.auth().currentUser.updateProfile({displayName: firstname + " " + lastname})
                console.log(result);
              }
            })
            .catch((error) => {
                console.log(error);
                this.setState({errorMessage: error.message});
                Animated.timing(this.state.fadeError, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
                }).start();
            })
        }
        else {
          this.setState({errorMessage: "Passwords Must Match"});
          Animated.timing(this.state.fadeError, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
      }
    }
    else {
        this.setState({errorMessage: "A full name is required for sign up"});
        Animated.timing(this.state.fadeError, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
    }
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

    

    return (
      <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
      <SafeAreaView style={{backgroundColor: "white", flex: 1}}>
      <ScrollView alwaysBounceHorizontal={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
      <ImageBackground source={require('../../src/assets/img/hex.jpg')} style={styles.body}>    
        <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 1)']} style={styles.linearGradient}>
          <View style={styles.innerbody}>
            <View style={[styles.register, {minHeight: "auto", marginVertical: 20, alignSelf: 'center'}]}>
              <View style={styles.registerTitle}><Text style={{"fontSize" : 20,"fontWeight" : "600", "letterSpacing" : 3, color: "#777777"}}>CREATE AN<Text style={{color: "#777777", fontWeight: "600"}}> ACCOUNT</Text> </Text></View>
              <UserForm accountType={this.state.accounttype} item={this} state={this}/>
              
              <Ionicons name={"mail"} style={styles.registerIcon} color={this.state.input3 ? "rgb(68, 199, 188)" : "#b0b4b3"} size={15} />
              <TextInput
                style={this.state.input3 ? styles.registerInputFocus : styles.registerInput}
                placeholderTextColor={this.state.input3 ? "rgb(68, 199, 188)" : "#b0b4b3"}
                placeholder="Email"
                keyboardType="email-address"
                onSubmitEditing={() => this.onSignUp()}
                onFocus={this.setFocus3.bind(this, true)}
                onBlur={this.setFocus3.bind(this, false)}
                autoCompleteType="email"
                onChangeText={(email) => this.setState({email: email})}
              />
              <Ionicons name={"lock-closed"} style={styles.registerIcon} color={this.state.input4 ? "rgb(68, 199, 188)" : "#b0b4b3"} size={15} />
              <TextInput
                style={this.state.input4 ? styles.registerInputFocus : styles.registerInput}
                placeholderTextColor={this.state.input4 ? "rgb(68, 199, 188)" : "#b0b4b3"}
                placeholder="Password"
                keyboardType="default"
                onSubmitEditing={() => this.onSignUp()}
                onFocus={this.setFocus4.bind(this, true)}
                onBlur={this.setFocus4.bind(this, false)}
                autoCompleteType="password"
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password: password})}
              />
              <Ionicons name={"lock-closed-outline"} style={styles.registerIcon} color={this.state.input5 ? "rgb(68, 199, 188)" : "#b0b4b3"} size={15} />
              <TextInput
                style={this.state.input5 ? styles.registerInputFocus : styles.registerInput}
                placeholderTextColor={this.state.input5 ? "rgb(68, 199, 188)" : "#b0b4b3"}
                placeholder="Confirm Password"
                keyboardType="default"
                onSubmitEditing={() => this.onSignUp()}
                onFocus={this.setFocus5.bind(this, true)}
                onBlur={this.setFocus5.bind(this, false)}
                autoCompleteType="password"
                secureTextEntry={true}
                onChangeText={(passwordconfirm) => this.setState({passwordconfirm: passwordconfirm})}
              />
      
              <Animated.View style={[styles.error, {opacity: this.state.fadeError}, {display: this.state.displayError}]} >
                <FontAwesomeIcon style={styles.errorIcon} icon={ faExclamationCircle } />
                <Text style={{color: "#d36e6e", fontWeight: "400",padding: 5}}>{this.state.errorMessage}</Text>
              </Animated.View>
      
              <Button titleStyle={{color: "#777777",fontSize: 12,textDecorationLine:"underline"}} buttonStyle={styles.flipButton} onPress={() => this.props.navigation.navigate("Login")} color="black" title="HAVE AN ACCOUNT? LOG IN"/>
      
              <Button titleStyle={{fontWeight: "600", fontSize:16,justifyContent:"center",alignContent:"center"}} containerStyle={styles.registerButtonContainer} buttonStyle={styles.registerButton} 
                  title="SIGN UP"
                  onPress={() => this.onSignUp()}
                  color="transparent"/>
            </View>

            <View style={styles.registerimg}>
              <ImageBackground source={require('../../src/assets/img/hex.jpg')} style={styles.image}>
                <LinearGradient colors={['rgba(74, 191, 217, 0.7)', 'rgba(114, 212, 192,1)']} style={styles.linearGradient}>
                  
                </LinearGradient>
              </ImageBackground>
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



const webStyles = StyleSheet.create({
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
  
    registerimg: {
      "width": "40%",
      "zIndex": -1,
    },
  
    register: {
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
      "color": "rgb(68, 199, 188)",
      "backgroundColor": "transparent",
      "borderBottomColor": "rgb(68, 199, 188)",
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
      "color": "rgb(68, 199, 188)",
      "fontWeight": "500",
    },
  
    registerInput: {
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

    registerInputFocus: {
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


    registerInputName: {
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
      "width": "48.5%",
      "height": 50
    },

    registerInputNameFocus: {
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
      "width": "48.5%",
      "height": 50
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
  
    registerButton: {
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

    registerButtonContainer: {
      width: 150,
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
    register: {
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
    registerimg: {
      display: "none",
    },
    registerInput: {
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
    registerInputName: {
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
      "width": "48.5%",
      "height": 50
    },
    registerButton: {
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
    registerButtonContainer: {
      "width": "100%",
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
    }
  });

  var styles = webStyles;

  if (window.width < 801) {
    styles = StyleSheet.flatten([webStyles,mobileStyles]);
  }
  else {
    styles = webStyles;
  }

  export default Register;
  