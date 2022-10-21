import React, {Component} from 'react'
import { Text, View, Appearance, StatusBar, StyleSheet, TextInput, Platform, Image } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import IconA from 'react-native-vector-icons/FontAwesome';

import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

import { Objects } from '../../components';
var webStyles;
var Colors;


class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            colors: Appearance.getColorScheme(),
            colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
        }
          
    }

    componentDidMount () {
        Appearance.addChangeListener(this.onAppThemeChanged);

    }

    componentWillUnmount() {
        Appearance.addChangeListener(this.onAppThemeChanged);
      };
    
      onAppThemeChanged = (theme) => {
        const currentTheme = Appearance.getColorScheme();
        this.setState({colors: currentTheme});
        this.setState({colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)})
      };



    render() {

        Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
        webStyles = setStyle(Colors);

            return(
                <SafeAreaView style={{height: "100%", width: "100%", backgroundColor: Colors.backgroundColor}}>
                    <ScrollView shouldRasterizeIOS={true} alwaysBounceVertical={true} style={webStyles.body}>
                        <Text>Hello</Text>
                    </ScrollView>
                </SafeAreaView>
            )

    }

}

function setStyle(Colors) {

    return StyleSheet.create({
        
    });
}

export default Account;
