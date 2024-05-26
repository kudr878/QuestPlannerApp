// AuthScreen.js
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Login from '../components/Login';
import Register from '../components/Register';

const Auth = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});

export default Auth;
