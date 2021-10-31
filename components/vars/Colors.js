import {Appearance} from 'react-native';

var darkMode = (Appearance.getColorScheme() === 'dark')

Appearance.addChangeListener(()=> {
    darkMode = (Appearance.getColorScheme() === 'dark')

    
})

export default Colors = {
    backgroundColor: darkMode ? "#121212" : "#eeeeee",
    backgroundLightColor: darkMode ? "#222222" : "#dedede",
    backgroundLighterColor: darkMode ? "#444444" : "#aaaaaa",
    primaryColor: darkMode ? "#00d6a1" : "#004030",
    secondaryColor: darkMode ? "#004030" : "#00d6a1",
    lighterText: darkMode ? "#ddd" : "#222",
    errColor: darkMode ? "#d36e6e" : "#cc3737",
    barColor: "#00d6a1"
}

/*export default Colors = {
    backgroundColor:  new DynamicValue('#eeeeee', '#121212'),
    backgroundLightColor: new DynamicValue('#dedede', '#222222'),
    backgroundLighterColor:  new DynamicValue('#aaaaaa', '#444444'),
    primaryColor: new DynamicValue('#004030', '#00d6a1'),
    secondaryColor: new DynamicValue('#00d6a1', '#004030'),
    lighterText: new DynamicValue('#222', '#ddd'),
    errColor: new DynamicValue('#cc3737', '#d36e6e'),
    barColor: "#00d6a1"
} */