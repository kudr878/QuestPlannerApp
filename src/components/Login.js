import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/authSlice';
import * as FileSystem from 'expo-file-system';
import { authStyles as styles } from '../styles/AuthStyles';

const logToFile = async (message) => {
  const fileUri = `${FileSystem.documentDirectory}log.txt`;
  const timestamp = new Date().toISOString();
  await FileSystem.writeAsStringAsync(fileUri, `${timestamp} - ${message}\n`, { encoding: FileSystem.EncodingType.UTF8, append: true });
};

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
          logToFile(`Login successful: ${email}`);
          navigation.navigate('Home');
        })
        .catch((err) => {
          logToFile(`Login error: ${err}`);
          Alert.alert('Ошибка', err.error || 'Недействительные данные');
        });
    } else {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Имя пользователя"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
