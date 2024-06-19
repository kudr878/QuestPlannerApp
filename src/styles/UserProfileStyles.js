import { Dimensions, StyleSheet } from 'react-native';
import { constStyles, FontSizes, colorsLightTheme } from './const';

export const profileStyles = StyleSheet.create({
  container: {
    ...constStyles.container,
  },
  title: {
    textAlign: 'center',
    fontSize: FontSizes.xlarge,
    marginBottom: 20,
  },
  text: {
    fontSize: FontSizes.medium,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  button: {
    ...constStyles.button,
    marginVertical: 10,
  },
  buttonText: {
    ...constStyles.buttonText,
  },
  progressBarContainer: {
    width: '100%',
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
  image: {
    height: Dimensions.get('window').width*0.9,
    aspectRatio: 1,
    marginBottom: 20,
  },
  editButton: {
    position: 'absolute',
    right: '-5%',
    bottom: '5%',
    padding: '5%',
  },
  editIcon: {
    width: 30,
    height: 30,
  },
});
