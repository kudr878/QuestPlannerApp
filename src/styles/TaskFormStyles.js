// TaskFormStyles.js
import { Dimensions, StyleSheet } from "react-native";
import { colorsLightTheme, minBorder, maxBorder, FontSizes, buttonHeight, constStyles, screenWidth, screenHeight } from "./const";

export const taskFormStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    ...constStyles.container,
  },
  input: {
    ...constStyles.input,
  },
  multilineInput: {
    ...constStyles.input,
    paddingVertical: '2%',
    paddingRight: '7.5%',
  },
  errorBorder: {
    borderColor: 'red',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dateContainer: {
    flex: 1,
  },
  datePickerButton: {
    marginHorizontal: 5,
  },
  datePickerButtonText: {
    fontSize: FontSizes.xlarge,
  },
  repeatIntervalContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: FontSizes.medium,
  },
  intervalControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intervalText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
 },
  dayButton: {
    padding: 8,
    margin: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  selectedDayButton: {
    backgroundColor: '#cce5ff',
    borderColor: '#007bff',
  },
  dayButtonText: {
    fontSize: FontSizes.medium,
  },
  subtaskTitle: {
    marginVertical: '5%',
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
  subtaskContainer: {
  },
  deleteButton: {
    position: 'absolute',
    top: '2.5%',
    right: '2.5%',
  },
  deleteButtonText: {
    fontSize: Dimensions.get('window').width * 0.05,
    color: 'red',
  },
  saveButton: {
...constStyles.button,
    position: 'static',
    alignSelf: 'center',
    bottom: 0,
    width: '80%',
  },
  saveButtonText: {
    ...constStyles.buttonText,
  },
  addSubtaskButton : {
    position: 'absolute', 
    right: '3%',
  },
  addSubtaskButtonText : {
    fontSize: Dimensions.get('window').width * 0.1,
    top: '-15%',
    color: 'black',
    fontWeight: 'bold',
  },
  picker: {
    height: buttonHeight,
  },
  pickerText: {
    fontSize: FontSizes.medium,
  },
  intervalButton: {
    ...constStyles.button,
    width: '10%',
  },
  intervalButtonText: {
    ...constStyles.buttonText,
  },
  intervalText  : {
    fontSize: FontSizes.large,    
    paddingBottom: '5%',
    paddingHorizontal: '3%',
  },

});
