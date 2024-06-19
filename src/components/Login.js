import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Имя пользователя не может быть пустым';
    if (!password) newErrors.password = 'Пароль не может быть пустым';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 3000);
    } else {
      dispatch(loginUser({ email, password }))
        .unwrap()
        .then((result) => {
          logToFile(`Login successful: ${email}`);
          navigation.navigate('Home');
        })
        .catch((err) => {
          logToFile(`Login error: ${err}`);
          setErrors({ general: err.error || 'Недействительные данные' });
          setTimeout(() => {
            setErrors({});
          }, 3000);
        });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, errors.email && styles.errorBorder]}
        placeholder="Имя пользователя"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={[styles.input, errors.password && styles.errorBorder]}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
