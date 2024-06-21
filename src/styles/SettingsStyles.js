import { StyleSheet } from "react-native";
import { constStyles, colorsLightTheme, FontSizes } from './const';

export const settingsStyles = StyleSheet.create({
  container: {
    ...constStyles.container,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: FontSizes.large,
    marginBottom: 20,
  },
  button: {
    ...constStyles.button,
    marginBottom: 15,
  },
  buttonText: {
    ...constStyles.buttonText,
  },
});
