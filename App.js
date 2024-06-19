import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector, Provider } from 'react-redux';
import Auth from './src/screens/Auth';
import Home from './src/screens/Home';
import store from './redux/store';
import UserProfile from './src/screens/UserProfile';
import Settings from './src/screens/Settings';
import { TouchableOpacity, Text, View } from 'react-native';
import { restoreUser, refreshAuthToken } from './redux/authSlice';
import CharacterSelect from './src/components/CharacterSelect';
import ChangeCharacterScreen from './src/screens/ChangeCharacter';
import CreateTask from './src/screens/CreateTask';
import EditTask from './src/screens/EditTask';
import { appStyles as styles } from './src/styles/AppStyles';

const Stack = createStackNavigator();

const AppContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await dispatch(restoreUser()).unwrap();
        await dispatch(refreshAuthToken()).unwrap();
        console.log('Текущий пользователь:', user);
      } catch (error) {
        console.log('No user found', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Auth'}>
        <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserProfile')}>
                <Text style={styles.buttonText}>Профиль</Text>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.buttonText}>Настройки</Text>
              </TouchableOpacity>
            ),
            title: user ? user.username : 'Home'
          })} 
        />
        <Stack.Screen name="UserProfile" component={UserProfile} options={() => ({
          title: user ? user.username : 'UserProfile'
        })} />
        <Stack.Screen name="Settings" component={Settings} options={() => ({ title: 'Настройки' })}/>
        <Stack.Screen name="CharacterSelect" component={CharacterSelect} options={{ title: 'Выберите персонажа' }} />
        <Stack.Screen name="ChangeCharacterScreen" component={ChangeCharacterScreen} options={{ title: 'Выберите персонажа' }}/>
        <Stack.Screen name="CreateTask" component={CreateTask} options={{ title: 'Создание задачи' }}/>
        <Stack.Screen name="EditTask" component={EditTask} options={{ title: 'Редактирование задачи' }}/>
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
