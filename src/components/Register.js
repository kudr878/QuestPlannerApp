import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/authSlice';



const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.auth);
  
    const handleRegister = () => {
        console.log('Register button clicked');
        if (username && email && password && confirmPassword) {
          if (password === confirmPassword) {
            console.log('Dispatching registerUser');
            dispatch(registerUser({ username, email, password }))
              .unwrap()
              .then((result) => {
                console.log('Registration successful, navigating to home');
                navigation.navigate('Home');
              })
              .catch((err) => {
                console.error(`Registration failed: ${err.error || 'Unknown error'}`);
                Alert.alert('Ошибка', err.error || 'Произошла ошибка');
              });
          } else {
            console.error('Passwords do not match');
            Alert.alert('Ошибка', 'Пароли не совпадают');
          }
        } else {
          console.error('All fields must be filled');
          Alert.alert('Ошибка', 'Все поля должны быть заполнены');
        }
      };
      
  
    return (
      <View style={styles.container}>
        <Text>Регистрация</Text>
        <TextInput
          placeholder="Имя пользователя"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Электронная почта"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Button title="Зарегистрироваться" onPress={handleRegister} />
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
  
  export default Register;