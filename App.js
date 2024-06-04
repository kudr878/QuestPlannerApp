import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import Auth from './src/screens/Auth';
import Home from './src/screens/Home';
import store from './redux/store';
import UserProfile from './src/screens/UserProfile';
import Settings from './src/screens/Settings';
import { Button, Alert } from 'react-native';
import { restoreUser, refreshAuthToken } from './redux/authSlice';
import CharacterSelect from './src/components/CharacterSelect';
import ChangeCharacterScreen from './src/screens/ChangeCharacter';
import CreateTask from './src/screens/CreateTask';
import EditTask from './src/screens/EditTask';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from '@env';


const showAlert = (title, message) => {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => resolve() }],
      { cancelable: false }
    );
  });
};
const checkNetworkAccess = async () => {
  try {
    const response = await fetch('https://www.google.com');
    if (response.status !== 200) throw new Error('Network response was not ok');
    await showAlert('Сеть доступна', 'Доступ к интернету есть');
    await logToFile('Доступ к интернету есть');
  } catch (error) {
    await showAlert('Ошибка сети', `Нет доступа к сети: ${error.message}`);
    await logToFile(`Нет доступа к сети: ${error.message}`);
  }
};

const checkAPIAccess = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    const responseBody = await response.text();
    if (response.status !== 200) throw new Error(`API response was not ok: ${response.status} ${response.statusText}`);
    await showAlert(`Доступ к API есть. Статус: ${response.status}. Тело ответа: ${responseBody}`);
  } catch (error) {
    await showAlert(`${error.message}. URL: ${API_BASE_URL}`);
  }
};


const logToFile = async (message) => {
  const fileUri = `${FileSystem.documentDirectory}log.txt`;
  const timestamp = new Date().toISOString();
  try {
    await FileSystem.writeAsStringAsync(fileUri, `${timestamp} - ${message}\n`, { encoding: FileSystem.EncodingType.UTF8, append: true });
    await showAlert('Файл логов', `Сообщение занесено в файл логов. Файл находится по пути: ${fileUri}`);
  } catch (error) {
    await showAlert('Ошибка', `Не удалось записать в файл логов: ${error.message}`);
  }
};

const Stack = createStackNavigator();
const AppContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
 
  useEffect(() => {
    const checkLoginStatus = async () => {
      await checkNetworkAccess();
      await checkAPIAccess();
      await dispatch(restoreUser()).unwrap()
        .then(() => {
          return dispatch(refreshAuthToken()).unwrap();
        })
        .catch(() => {
          console.log('No user found');
          logToFile('No user found');
        });
      setIsLoading(false);
    };
    checkLoginStatus();
  }, [dispatch]);

  if (isLoading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Auth'}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} options={({ navigation }) => ({
          headerRight: () => (
            <Button title="Профиль" onPress={() => navigation.navigate('UserProfile')} />
          ),
          headerLeft: () => (
            <Button title="Настройки" onPress={() => navigation.navigate('Settings')} />
          )
        })} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="CharacterSelect" component={CharacterSelect} />
        <Stack.Screen name="ChangeCharacterScreen" component={ChangeCharacterScreen} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="EditTask" component={EditTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

export default App;
