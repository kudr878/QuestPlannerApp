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


const Stack = createStackNavigator();
const AppContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
 
  useEffect(() => {
    const checkLoginStatus = async () => {
      await dispatch(restoreUser()).unwrap()
        .then(() => {
          return dispatch(refreshAuthToken()).unwrap();
        })
        .catch(() => {
          console.log('No user found');
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
