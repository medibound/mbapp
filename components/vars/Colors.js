import {Appearance, useColorScheme} from 'react-native';

var darkMode = (Appearance.getColorScheme() === 'dark')

Appearance.addChangeListener(()=> {
    darkMode = (Appearance.getColorScheme() === 'dark')

    
})

export default Colors = {
    backgroundColor: darkMode ? "#000000" : "#f2f2f7",
    backgroundColorRGB: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
    backgroundLightColor: darkMode ? "#1C1C1E" : "#ffffff",
    backgroundLighterColor: darkMode ? "#090909" : "#E3E3E8",
    primaryColor: darkMode ? "#00d6a1" : "#004030",
    secondaryColor: darkMode ? "#004030" : "#00d6a1",
    lighterText: darkMode ? "#ddd" : "#222",
    lightText: darkMode ? "#8E8E93" : "#8E8E93",
    errColor: darkMode ? "#d36e6e" : "#cc3737",
    barColor: "#00d6a1",
    darkMode: darkMode,
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