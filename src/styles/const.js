import { StyleSheet, Dimensions } from "react-native";

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const FontSizes = {
    small: screenWidth * 0.03,
    medium: screenWidth * 0.038,
    large: screenWidth * 0.05,
    xlarge: screenWidth * 0.06,
}

export const buttonHeight = screenHeight * 0.065;

export const minBorder = 2;
export const maxBorder = 40;

export const colorsLightTheme = {
    buttonText: '#fff',
    button: '#76c7c0',
    labelText: '#000',
    inputBorder: '#76c7c0',
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
        borderTopRightRadius: minBorder,
        borderBottomRightRadius: maxBorder,
        borderTopLeftRadius: maxBorder,
        borderBottomLeftRadius: minBorder,
        marginBottom: '5%', 
        height: buttonHeight,
        justifyContent: 'center',
        alignItems: 'center',   
        backgroundColor: colorsLightTheme.button,
    },
    buttonText: {
        fontSize: FontSizes.large,
        color: colorsLightTheme.buttonText,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        borderTopRightRadius: minBorder,
        borderBottomRightRadius: maxBorder,
        borderTopLeftRadius: maxBorder,
        borderBottomLeftRadius: minBorder,
        paddingHorizontal: '5%',
        marginBottom: '5%', 
        minHeight: buttonHeight, 
        justifyContent: 'center',
        alignItems: 'center',    
        backgroundColor: '#ffffff90',
        borderWidth: 0.5,
        borderColor: colorsLightTheme.inputBorder,
        fontSize: FontSizes.medium,
    },
    background: {
        position: 'absolute',
        top: 0,
        width: screenWidth,
        height: screenHeight,
        alignSelf: 'center',
    },
});
