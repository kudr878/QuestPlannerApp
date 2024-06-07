import { StyleSheet, Dimensions } from "react-native";

export const ScreenWidth = Dimensions.get('window').width;
export const ScreenHeight = Dimensions.get('window').height;

export const FontSizes = {
    small: ScreenWidth < 375 ? 12 : 14,
    medium: ScreenWidth < 375 ? 16 : 18,
    large: ScreenWidth < 375 ? 20 : 22,
    xlarge: ScreenWidth < 375 ? 24 : 26,
}

export const buttonHeight = Dimensions.get('window').height*0.065;

export const minBorder = 2;
export const maxBorder = 40;

export const colorsLightTheme = {
   buttonText : '#fff',
   button : '#76c7c0',
   labelText : '#000',
}

export const colorsDarkTheme = {
    buttonText : '#000',
    button : '#76c7c0',
    labelText : '#fff',
}

export const constStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '5%',
    },
    justContainer: {
        flex: 1,
        padding: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        bortderTopRightRadius: minBorder,
        bortderBottomRightRadius: maxBorder,
        borderTopLeftRadius: maxBorder,
        borderBottomLeftRadius: minBorder,
        paddingHorizontal: '10%',
        marginBottom: '5%', 
        height: buttonHeight,
        justifyContent: 'center',
        alignItems: 'center',    
    },
    buttonText : {
        fontSize: FontSizes.medium,
        color: colorsLightTheme.buttonText,    
    },
    input : {
        marginBottom: '5%',
        height: buttonHeight,
        fontSize: FontSizes.medium,
    }
});