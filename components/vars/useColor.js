import {Appearance, useColorScheme} from 'react-native';


export default function getColor(darkMode) {
    return Colors = {
        backgroundColor: darkMode ? "#0e0f0f" : "#f2f2f7",
        backgroundColorRGB: darkMode ? "rgba(0,0,0,0.4)" : "rgba(242, 242, 247,0.4)",
        backgroundColorRGBLayers: darkMode ? "rgba(10, 10, 10 ,0.4)" : "rgba(255, 255, 255,0.4)",
        backgroundLightColor: darkMode ? "#131414" : "#ffffff",
        backgroundLayer1Color: darkMode ? "#202020" : "#ffffff",
        backgroundLayer2Color: darkMode ? "#212121" : "#ffffff",
        backgroundLighterColor: darkMode ? "#090909" : "#E3E3E8",
        backgroundLightestColor: darkMode ? "#111111" : "#ffffff",
        backgroundDarkestColor: darkMode ? "#1C1C1E" : "#f2f2f7",
        primaryColor: darkMode ? "#00d6a1" : "#002e22",
        lightColor: darkMode ? "#00d6a1" : "#222",
        secondaryColor: darkMode ? "#002e22" : "#cafcf0",
        lighterText: darkMode ? "#ddd" : "#222",
        lightText: darkMode ? "#8E8E93" : "#8E8E93",
        errColor: darkMode ? "#d36e6e" : "#cc3737",
        barColor: "#00d6a1",
        dividerColor: darkMode ?  "#444": "#bbb",
        blurTheme: darkMode ? "dark" : "light",
        darkMode: darkMode,
        mainColor: "#00d6a1",
    }
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