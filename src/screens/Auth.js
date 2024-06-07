// AuthScreen.js
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Login from '../components/Login';
import Register from '../components/Register';
import { authStyles} from '../styles/AuthStyles';

const Auth = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={authStyles.container}>
      <View style={authStyles.switchContainer}>
        <Button
          title="Логин"
          onPress={() => setIsLogin(true)}
          color={isLogin ? 'blue' : 'gray'}
        />
        <Button
          title="Регистрация"
          onPress={() => setIsLogin(false)}
          color={!isLogin ? 'blue' : 'gray'}
        />
      </View>
      {isLogin ? <Login navigation={navigation} /> : <Register navigation={navigation} />}
    </View>
  );
};


export default Auth;
