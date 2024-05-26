import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/authSlice';


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.auth);
  
    const handleLogin = () => {
        if (email && password) {
            dispatch(loginUser({ email, password })) 
          .unwrap()
          .then((result) => {
            navigation.navigate('Home');
          })
          .catch((err) => {
            Alert.alert('Ошибка', err.error || 'Недействительные данные');
          });
      } else {
        Alert.alert('Ошибка', 'Все поля должны быть заполнены');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text>Логин</Text>
        <TextInput
          placeholder="Имя пользователя"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Войти" onPress={handleLogin} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  export default Login;