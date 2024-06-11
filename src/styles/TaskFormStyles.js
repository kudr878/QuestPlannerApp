import { StyleSheet, Dimensions } from "react-native";
import { colorsLightTheme, minBorder, maxBorder, FontSizes, buttonHeight, constStyles } from "./const";

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
    borderTopRightRadius: minBorder,
    borderBottomRightRadius: maxBorder,
    borderTopLeftRadius: maxBorder,
    borderBottomLeftRadius: minBorder,
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    marginBottom: '5%', 
    minHeight: buttonHeight, 
    justifyContent: 'center',
    alignItems: 'center',    
    backgroundColor: '#ffffff90',
    borderWidth: .5,
    borderColor: colorsLightTheme.inputBorder,
    fontSize: FontSizes.medium,
  },
  multilineInputSub: {
    borderTopRightRadius: minBorder,
    borderBottomRightRadius: maxBorder,
    borderTopLeftRadius: maxBorder,
    borderBottomLeftRadius: minBorder,
    paddingHorizontal: '5%',
    paddingRight: '7.5%',
    paddingVertical: '2%',
    marginBottom: '5%', 
    minHeight: buttonHeight, 
    justifyContent: 'center',
    alignItems: 'center',    
    backgroundColor: '#ffffff90',
    borderWidth: .5,
    borderColor: colorsLightTheme.inputBorder,
    fontSize: FontSizes.medium,
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
  dateText: {
    fontSize: 16,
  },
  datePickerButton: {
    marginHorizontal: 5,
  },
  datePickerButtonText: {
    fontSize: 24,
  },
  repeatIntervalContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
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
    flexWrap: 'wrap',
    marginVertical: 8,
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
    fontSize: 16,
  },
  subtaskTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtaskContainer: {
  },
  deleteButton: {
    position: 'absolute',
    top:'2.5%',
    right:'2.5%',
  },
  deleteButtonText: {
    padding: 8,
    color: 'red',
  },
});
