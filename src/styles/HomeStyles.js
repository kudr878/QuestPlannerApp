import { StyleSheet, Dimensions } from 'react-native';
import { colorsLightTheme, maxBorder, buttonHeight, constStyles } from "./const";

const screenWidth = Dimensions.get('window').width;

export const homeScreenStyles = StyleSheet.create({
  container: {
    ...constStyles.container,
  },
  contentContainer: {
    padding: '5%',
    paddingBottom: Dimensions.get('window').height * 0.4,
    marginTop: Dimensions.get('window').height * 0.3,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopLeftRadius: maxBorder,
    borderTopRightRadius: maxBorder,
    height: buttonHeight,
    backgroundColor: colorsLightTheme.button,
  },
  buttonProfile: {
    position: 'absolute',
    right: 0,
  },
  buttonTextProfile: {
    ...constStyles.buttonText,
    backgroundColor: 'black',
    borderRadius: 50,
    width: buttonHeight,
    height: buttonHeight,
    textAlign: 'center',
  },
  buttonText: {
    ...constStyles.buttonText,
    textAlign: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedImage: {
    position: 'absolute',
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    right: '25%',
  },
  plusButton: {
    height: buttonHeight * 1.5,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: buttonHeight * 0.5,
  },
  addButtonText: {
    fontSize: screenWidth * 0.2,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 85,
  },
  screen: {
    width: screenWidth,
  },
  animatedContainer: {
    flexDirection: 'row',
    width: screenWidth,
    position: 'absolute',
  },
});
