
import { StyleSheet, Dimensions } from 'react-native';
import { colorsLightTheme, colorsDarkTheme, minBorder, maxBorder, FontSizes, buttonHeight, constStyles, screenWidth } from "./const";


export const TaskStyle = StyleSheet.create({
    container: {
        flex: 1, 
          minHeight: Dimensions.get('window').height*.45,
          paddingHorizontal: '10%',
          paddingTop: '2%',
          backgroundColor: '#fff',
          borderTopRightRadius: 2,
          borderTopLeftRadius: 50,
          borderBottomRightRadius: 50,
          borderBottomLeftRadius: 2, 
          paddingBottom: '5%',
          borderWidth: 5,
          borderColor: '#000',    
             
      },
      taskContainer: {
        paddingVertical: '5%',
        paddingBottom: '5%',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        flexDirection: 'row',
      },
      title: {
        fontSize: FontSizes.large,
        fontWeight: 'bold'
      },
      infoContainer: {
        flex: 1,
        marginLeft: '5%'
      },
      subtaskContainer: {
        paddingHorizontal: '5%',
        marginTop: '5%',
        paddingVertical: '2.5%',
        backgroundColor: '#e0e0e0',
        borderTopRightRadius: minBorder,
        borderBottomRightRadius: maxBorder/2,
        borderTopLeftRadius: maxBorder/2,
        borderBottomLeftRadius: minBorder,
        paddingHorizontal: '5%',
        minHeight: buttonHeight/1.5,
        justifyContent: 'center',
      },
      checkboxContainer: {
        alignItems: 'center',
        marginVertical: 5,
      },
      checkbox: {
        width: Dimensions.get('window').width*0.05,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#000',
        marginRight: '5%',
        position: 'absolute',
        left: -Dimensions.get('window').width*0.04,
        top: 0,
      },
      checkboxCompleted: {
        backgroundColor: '#000',
      },
      checkboxText: {
        color: '#fff',
        fontSize: Dimensions.get('window').width*0.03,
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
      },
      buttonContainer: {
        position: 'absolute',
        right: -Dimensions.get('window').width*0.05,
        top: Dimensions.get('window').height*0.01,
      },
      buttonTask: {
        backgroundColor: '#76c7c0',
        width: Dimensions.get('window').width*0.07,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Dimensions.get('window').width*0.01,
        borderRadius: 5
      },
      noTasksText: {
        fontSize: FontSizes.large,
        textAlign: 'center',
        color: '#00000034',
        marginTop: '50%',
      }
    
  });