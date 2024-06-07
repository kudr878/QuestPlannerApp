import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, sendVerificationCode, verifyCode } from '../../redux/authSlice';
import CharacterSelect from './CharacterSelect';
import { authStyles as styles } from '../styles/AuthStyles';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const dispatch = useDispatch();
    
  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character.id);
  };

  const handleRegister = () => {
    if (username && email && password && confirmPassword && selectedCharacter) {
      if (password === confirmPassword) {
        dispatch(sendVerificationCode({ email }))
          .unwrap()
          .then(() => {
            setIsCodeSent(true);
            Alert.alert('Код отправлен', 'Код подтверждения отправлен на вашу электронную почту.');
          })
          .catch((err) => {
            Alert.alert('Ошибка', err.error || 'Произошла ошибка при отправке кода.');
          });
      } else {
        Alert.alert('Ошибка', 'Пароли не совпадают');
      }
    } else {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
    }
  };

  const handleVerifyCode = () => {
    dispatch(verifyCode({ email, code: verificationCode }))
      .unwrap()
      .then(() => {
        dispatch(registerUser({ username, email, password, character_id: selectedCharacter }))
        .unwrap()
          .then((result) => {
            navigation.navigate('Home');
          })
          .catch((err) => {
            Alert.alert('Ошибка', err.error || 'Произошла ошибка при регистрации.');
          });
      })
      .catch((err) => {
        Alert.alert('Ошибка', 'Неправильный код подтверждения.');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Имя пользователя"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Электронная почта"
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
      <TextInput
        style={styles.input}
        placeholder="Подтвердите пароль"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {isCodeSent && (
        <TextInput
          style={styles.input}
          placeholder="Код подтверждения"
          value={verificationCode}
          onChangeText={setVerificationCode}
        />
      )}
      <CharacterSelect onSelect={(character) => handleSelectCharacter(character)} characterId={selectedCharacter} />
      <Button title={isCodeSent ? "Подтвердить код" : "Зарегистрироваться"} onPress={isCodeSent ? handleVerifyCode : handleRegister} />
    </View>
  );
};

export default Register;
