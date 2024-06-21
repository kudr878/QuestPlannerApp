import { StyleSheet, Dimensions } from 'react-native';
import { colorsLightTheme, minBorder, maxBorder, FontSizes, buttonHeight, constStyles, screenWidth, screenHeight } from "./const";

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    },
  contentContainer: {
    padding: '5%',
    paddingBottom: screenHeight * 0.4,
    marginTop: screenHeight * 0.3,
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
  },
  progressBarContainer: {
    width: Dimensions.get('window').width * .4,
    height: 20,
    backgroundColor: '#e0e0df',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colorsLightTheme.button,
    borderRadius: 5,
  },
  levelExperienceContainer: {
    position: 'absolute',
    top: '10%',
    left: '55%',
    padding: 8,
    borderRadius: 8,
  },
  levelExperienceText: {
    color: '#000000',
    fontSize: FontSizes.medium,
  },
});
