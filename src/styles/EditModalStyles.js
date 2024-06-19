import { StyleSheet } from "react-native";
import { colorsLightTheme, minBorder, maxBorder, FontSizes, buttonHeight, constStyles, screenWidth, screenHeight } from "./const";

export const editModalStyles = StyleSheet.create({
  modalContainer: {
    ...constStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    marginBottom: 20,
  },
  input: {
    ...constStyles.input
  },
  error: {
    marginTop:'-3.55%',
    color: 'red',  
},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: colorsLightTheme.button,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    ...constStyles.buttonText,
  },

});
