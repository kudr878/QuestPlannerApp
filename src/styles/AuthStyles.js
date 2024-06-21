import { StyleSheet, Dimensions } from "react-native";
import { colorsLightTheme, minBorder, maxBorder, FontSizes, buttonHeight, constStyles, screenWidth, screenHeight } from "./const";

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
        flex: 0.5,
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
        flex: 0.5,
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
    },
    buttonTextCode: {
        fontSize: FontSizes.medium*0.8,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
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
        height: screenHeight,
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
        width: screenWidth,
        backgroundColor: '#ffffff86',
    },
    errorText: {
        marginTop:'-3.55%',
        color: 'red',
    },
    errorBorder: {
        borderColor: 'red',
    },
    textPolicy  : {
        fontSize: FontSizes.small,
        color: 'gray',
        paddingBottom: '5%',
    },
    link: {
        textDecorationLine: 'underline'
      },
      overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalView: {
        backgroundColor: '#fff',
        flex: 1,
        marginHorizontal: '10%',
        marginVertical: '20%',
        padding: '5%',
        borderTopRightRadius: minBorder,
        borderBottomRightRadius: maxBorder,
        borderTopLeftRadius: maxBorder,
        borderBottomLeftRadius: minBorder,
      },
      buttonClose: {
        ...constStyles.button,
        marginTop: '5%',
        marginBottom: '-2.5%',
        width: '40%',
        alignSelf: 'center',
      },
      modalText: {
        fontSize: FontSizes.medium,
        marginBottom: '5%',
      },
});
