import { StyleSheet, Dimensions } from "react-native";
import { colorsLightTheme, colorsDarkTheme, FontSizes, buttonHeight, constStyles } from "./const";

export const authStyles = StyleSheet.create({
    container: {
        ...constStyles.container,
      },
      switchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignSelf: 'center'
      },
      title: {
        fontSize: FontSizes.xlarge,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 8,
    },
    characterContainer: {
        marginVertical: 20,
    },
    button: {
        height: buttonHeight,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: FontSizes.large,
    },

});
