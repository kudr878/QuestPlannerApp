import { StyleSheet, Dimensions } from "react-native";
import { colorsLightTheme, colorsDarkTheme, minBorder, maxBorder, FontSizes, buttonHeight, constStyles, screenWidth } from "./const";

export const authStyles = StyleSheet.create({
    container: {
        ...constStyles.container,
        marginTop: '10%',
    },
    switchContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    buttonLog: {
        flex: .4,
        borderTopLeftRadius: maxBorder,
        borderBottomLeftRadius: minBorder,
        paddingHorizontal: '5%',
        marginBottom: '5%', 
        height: buttonHeight,
        justifyContent: 'center',
        alignItems: 'center',   
        backgroundColor: colorsLightTheme.button,
    },
    buttonReg: {
        flex: .4,
        borderTopRightRadius: minBorder,
        borderBottomRightRadius: maxBorder,
        paddingHorizontal: '5%',
        marginBottom: '5%', 
        height: buttonHeight,
        justifyContent: 'center',
        alignItems: 'center',   
        backgroundColor: colorsLightTheme.button,
    },
    title: {
        fontSize: FontSizes.xlarge,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        ...constStyles.input,
    },
    characterContainer: {
        marginVertical: 20,
    },
    button: {
        ...constStyles.button,
    },

    buttonText: {
        ...constStyles.buttonText
    },
    codeContainer: {
        flexDirection: 'row',
    },
    codeInput: {
        flex: 1,
    },
    sendCodeButton: {
        flex: 0.5,
        marginLeft: 10,
        ...constStyles.button,
        backgroundColor: 'blue',
        
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    animatedContainerReg: {
        flex: 1,
        width: '100%',
    },
    formSection: {
        width: '100%',
        height: Dimensions.get('window').height,
    },
    animatedWrapper: {
        position: 'absolute',
        top: '10%', 
      },
      animatedContainerAuth: {
        flexDirection: 'row',
        width: screenWidth,
        position: 'absolute',
        top: '10%',
      },
      screen: {
        width: screenWidth
      },    
});
