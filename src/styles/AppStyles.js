import { StyleSheet } from "react-native";
import { colorsLightTheme, FontSizes } from './const';

export const appStyles = StyleSheet.create({
  button: {
    backgroundColor: colorsLightTheme.button,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: colorsLightTheme.buttonText,
    fontSize: FontSizes.medium,
  },
});
