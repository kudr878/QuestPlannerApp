import { StyleSheet, Dimensions } from 'react-native';
import { colorsLightTheme, minBorder, maxBorder, FontSizes, buttonHeight, constStyles, screenWidth, screenHeight } from "./const";

export const TaskStyle = StyleSheet.create({
    container: {
        flex: 1, 
        minHeight: screenHeight * 0.45,
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
        paddingRight: '5%',
        paddingBottom: '5%',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    description: {
        fontSize: FontSizes.medium,
    },
    title: {
        fontSize: FontSizes.large,
        fontWeight: 'bold'
    },
    difficulty: {
        fontSize: FontSizes.medium,
        color: '#888888',
    },  
    repeatInfo : {
        fontSize: FontSizes.small,
        color: '#888888',
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
        borderBottomRightRadius: maxBorder / 2,
        borderTopLeftRadius: maxBorder / 2,
        borderBottomLeftRadius: minBorder,
        paddingHorizontal: '5%',
        minHeight: buttonHeight / 1.5,
        justifyContent: 'center',
    },
    subtaskText : {
        fontSize: FontSizes.medium,
    },
    subButtonText  : {
        fontSize: FontSizes.medium,
        color: 'white',
    },
    checkboxContainer: {
        alignItems: 'center',
        marginVertical: 5,
    },
    checkbox: {
        width: screenWidth * 0.05,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: '#000',
        marginRight: '5%',
        position: 'absolute',
        left: -screenWidth * 0.04,
        top: 0,
    },
    checkboxCompleted: {
        backgroundColor: '#000',
    },
    checkboxText: {
        color: '#fff',
        fontSize: screenWidth * 0.03,
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonContainer: {
        position: 'absolute',
        right: -screenWidth * 0.05,
        top: screenHeight * 0.01,
    },
    buttonTask: {
        backgroundColor: '#76c7c0',
        width: screenWidth * 0.07,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: screenWidth * 0.01,
        borderRadius: 5
    },
    buttonDeleteConfirm: {
        backgroundColor: '#ff4d4d',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    noTasksText: {
        fontSize: FontSizes.large,
        textAlign: 'center',
        color: '#00000034',
        marginTop: '50%',
    }
});
