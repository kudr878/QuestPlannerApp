import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Alert, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { registerUser, sendVerificationCode, verifyCode, checkEmail } from '../../redux/authSlice';
import CharacterSelect from './CharacterSelect';
import { authStyles as styles } from '../styles/AuthStyles';
import { constStyles } from '../styles/const';

const screenHeight = Dimensions.get('window').height;

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isInitialForm, setIsInitialForm] = useState(true);
  const [timer, setTimer] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character.id);
  };

  const handleSendCode = () => {
    if (email) {
      if (timer === 0) {
        dispatch(checkEmail({ email }))
          .unwrap()
          .then(() => {
            dispatch(sendVerificationCode({ email }))
              .unwrap()
              .then(() => {
                setIsCodeSent(true);
                setTimer(60);
                Alert.alert('Код отправлен', 'Код подтверждения отправлен на вашу электронную почту.');
              })
              .catch((err) => {
                Alert.alert('Ошибка', err.error || 'Произошла ошибка при отправке кода.');
              });
          })
          .catch((err) => {
            Alert.alert('Ошибка', err.error || 'Электронная почта уже используется.');
          });
      }
    } else {
      Alert.alert('Ошибка', 'Введите электронную почту для отправки кода.');
    }
  };

  const handleContinue = () => {
    if (username && email && password && confirmPassword && verificationCode) {
      if (password === confirmPassword) {
        dispatch(verifyCode({ email, code: verificationCode }))
          .unwrap()
          .then(() => {
            Animated.timing(animation, {
              toValue: -screenHeight,
              duration: 500,
              useNativeDriver: true,
            }).start(() => {
              setIsInitialForm(false);
            });
          })
          .catch((err) => {
            Alert.alert('Ошибка', 'Неправильный код подтверждения.');
          });
      } else {
        Alert.alert('Ошибка', 'Пароли не совпадают');
      }
    } else {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
    }
  };

  const handleBack = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsInitialForm(true);
    });
  };

  const handleRegister = () => {
    if (selectedCharacter) {
      dispatch(registerUser({ username, email, password, character_id: selectedCharacter }))
        .unwrap()
        .then(() => {
          navigation.navigate('Home');
        })
        .catch((err) => {
          Alert.alert('Ошибка', err.error || 'Произошла ошибка при регистрации.');
        });
    } else {
      Alert.alert('Ошибка', 'Выберите персонажа');
    }
  };

  const animatedStyle = {
    transform: [
      {
        translateY: animation,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainerReg, animatedStyle]}>
        <View style={styles.formSection}>
          <>
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
            <View style={styles.codeContainer}>
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="Код подтверждения"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
              <TouchableOpacity
                onPress={handleSendCode}
                style={[styles.sendCodeButton, timer > 0 && styles.disabledButton]}
                disabled={timer > 0}
              >
                <Text style={styles.buttonText}>
                  {timer > 0 ? `Отправить код (${timer})` : 'Отправить код'}
                </Text>
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity onPress={handleContinue} style={styles.button}>
              <Text style={styles.buttonText}>Продолжить</Text>
            </TouchableOpacity>
          </>
        </View>
        <View style={styles.formSection}>
          <>
            <CharacterSelect onSelect={(character) => handleSelectCharacter(character)} characterId={selectedCharacter} />
            <TouchableOpacity onPress={handleBack} style={styles.button}>
              <Text style={styles.buttonText}>Назад</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister} style={styles.button}>
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </>
        </View>
      </Animated.View>
    </View>
  );
};

export default Register;
