import React, {Component} from 'react';
import { StyleSheet,StatusBar, Image, Text, TextInput, View, ImageBackground, Animated, Dimensions, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native';
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
import axios from 'axios';


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

  async onSignIn() {
    const { email, password } = this.state;
    const result = await axios.post("https://manage.medibound.com/api/checkUserAccount", {email: email}).catch(err => {
      firebase.auth().signInWithEmailAndPassword(email + "@example.com", password)
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
    });
    console.log(result);
    if (result.data == false)  {
      this.setState({errorMessage: "Admin Accounts Cannot Login Here"});
            Animated.timing(this.state.fadeError, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }).start();
    }
    else if (result.data == true) {
        await firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
          console.log(result);
        }).catch((error) => {
          console.log(error)
          this.setState({errorMessage: error.message});
          Animated.timing(this.state.fadeError, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        });
      
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

  render() {
    return (
    <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
    <SafeAreaView style={{backgroundColor: "#121212", flex: 1,borderWidth: 1, borderColor: "#121212"}} >  
    <ScrollView alwaysBounceHorizontal={true} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.innerbody}>


          <View style={[styles.login, {minHeight: "auto", marginVertical: 20, alignSelf: 'center'}]}>
            <View style={{flexDirection: 'row', width: "95%", justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
              <Image source={require('../../assets/logo2.png')} style={{width: 30, height: 30, marginRight: 10, marginBottom: 10,}}></Image>
              <View style={styles.loginTitle}><Ionicons name="chevron-forward-outline" color="white" size={20}></Ionicons><Text style={{marginLeft: 10,"fontSize" : 18,"fontWeight" : '600', "letterSpacing" : 3,color: "white"}}>SIGN IN TO PATHWAYS</Text></View>
            </View>

            <Text style={{color: this.state.input1 ? "#00ff79" : "#b0b4b3", alignSelf: "flex-start", marginBottom: 5, fontSize: 14, fontWeight: "700"}}>Email</Text>
            <Ionicons name={"mail"} style={this.state.input1 ? styles.loginIconFocus : styles.loginIcon} size={15} />
            <TextInput
              style={[this.state.input1 ? styles.loginInputFocus : styles.loginInput, {color: "white"}]}
              placeholder="Email"
              placeholderTextColor={this.state.input1 ? "#00ff79" : "#b0b4b3"}
              keyboardType="email-address"
              onSubmitEditing={() => this.onSignIn()}
              onFocus={this.setFocus1.bind(this, true)}
              onBlur={this.setFocus1.bind(this, false)}
              autoCompleteType="email"
              onChangeText={(email) => this.setState({email: email})}
            />
            <Text style={{color: this.state.input2 ? "#00ff79" : "#b0b4b3", alignSelf: "flex-start", marginBottom: 5, fontSize: 14, fontWeight: "700"}}>Password</Text>
            <Ionicons name={"lock-closed"} style={this.state.input2 ? styles.loginIconFocus : styles.loginIcon} size={15} />
            <TextInput
              style={[this.state.input2 ? styles.loginInputFocus : styles.loginInput, {color: "white"}]}              
              placeholder="Password"
              keyboardType="default"
              placeholderTextColor={this.state.input2 ? "#00ff79" : "#b0b4b3"}
              secureTextEntry={true}
              onSubmitEditing={() => this.onSignIn()}
              onFocus={this.setFocus2.bind(this, true)}
              onBlur={this.setFocus2.bind(this, false)}
              autoCompleteType="password"
              onChangeText={(password) => this.setState({password: password})}
            />
            
            <Animated.View style={[styles.error, {opacity: this.state.fadeError}, {display: this.state.displayError}]} >
              <FontAwesomeIcon style={styles.errorIcon} icon={ faExclamationCircle } />
              <Text style={{color: "white", fontWeight: "400",padding: 5}}>{this.state.errorMessage}</Text>
            </Animated.View>

            <Button titleStyle={{color: "#dae0df",fontSize: 12,textDecorationLine:"underline"}} buttonStyle={styles.flipButton} onPress={() => this.props.navigation.navigate("Register")} color="black" title="CREATE AN ACCOUNT"/>

            <Button titleStyle={{"color": "#121212",fontWeight: "600", fontSize:16,justifyContent:"center",alignContent:"center"}} containerStyle={styles.loginButtonContainer} buttonStyle={styles.loginButton} 
              title="LOG IN"
              onPress={() => this.onSignIn()}
              color="transparent"/>

          </View>

          
          <StatusBar style="auto" backgroundColor="#00ff79" barStyle={Platform.OS == 'android' ? "dark-content" : "light-content"} />
        </View>
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
      "borderColor": "#dae0df",
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 50,
    },

    loginInputFocus: {
      "marginBottom": 10,
      "paddingTop": 2.5,
      "paddingRight": 2.5,
      "paddingBottom": 2.5,
      "paddingLeft": 40,
      "borderColor": "#00ff79",
      "borderWidth": 1,
      "borderStyle": "solid",
      borderRadius: 5,
      "width": "100%",
      "height": 50,

    },

    loginIcon: {
      "width": 15,
      "zIndex": 10,
      "left" : 15,
      "position" : "relative",
      "top": 34,
      "marginTop":-15,
      "alignSelf": "flex-start",
      "color": "#b0b4b3",
    },

    loginIconFocus: {
      "width": 15,
      "zIndex": 10,
      "left" : 15,
      "position" : "relative",
      "top": 34,
      "marginTop":-15,
      "alignSelf": "flex-start",
      "color": "#00ff79"
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
      "backgroundColor": "#00ff79",
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
      "backgroundColor" : "transparent",
      height: 35,
    }
  });

  const mobileStyles = StyleSheet.create({

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
      "backgroundColor": "#00ff79",
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
      "flexDirection": "column",
      "width": "100%",
      "height": "100%",
      "alignSelf": "flex-start",
      "justifyContent": "center",
      "shadowOffset": {
        "width": 0,
        "height": 0
      },
      borderWidth: 0,
      "shadowRadius": 50,
      "shadowColor": "rgba(0,0,0,0.15)",
      "shadowOpacity": 1,
      "overflow": "hidden",
      "fontSize": 13
    }
  });

  var styles = webStyles;
  styles = StyleSheet.flatten([webStyles,mobileStyles]);

  
  export default Login;