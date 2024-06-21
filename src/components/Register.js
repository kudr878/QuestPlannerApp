import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Animated, Dimensions, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { registerUser, sendVerificationCode, verifyCode, checkEmail } from '../../redux/authSlice';
import CharacterSelect from './CharacterSelect';
import { authStyles as styles } from '../styles/AuthStyles';
import PrivacyPolicyText from './PrivacyPolicyText';

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
  const [errors, setErrors] = useState({});
  const [isPrivacyPolicyVisible, setIsPrivacyPolicyVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [privacyPolicyText, setPrivacyPolicyText] = useState('');

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSendCode = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Введите электронную почту для отправки кода';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Некорректная электронная почта';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 3000);
      return;
    }

    if (timer === 0) {
      dispatch(checkEmail({ email }))
        .unwrap()
        .then(() => {
          dispatch(sendVerificationCode({ email }))
            .unwrap()
            .then(() => {
              setIsCodeSent(true);
              setTimer(60);
              setErrors({});
            })
            .catch((err) => {
              setErrors({ general: err.error || 'Произошла ошибка при отправке кода.' });
              setTimeout(() => setErrors({}), 3000);
            });
        })
        .catch((err) => {
          setErrors({ email: 'Электронная почта уже используется.' });
          setTimeout(() => setErrors({}), 3000);
        });
    }
  };

  const handleContinue = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Имя пользователя не может быть пустым';
    if (!email) newErrors.email = 'Электронная почта не может быть пустой';
    if (!password) newErrors.password = 'Пароль не может быть пустым';
    if (!confirmPassword) newErrors.confirmPassword = 'Подтвердите пароль';
    if (!verificationCode) newErrors.verificationCode = 'Код подтверждения не может быть пустым';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!validateEmail(email)) newErrors.email = 'Некорректная электронная почта';
    if (!validatePassword(password)) newErrors.password = 'Пароль должен содержать минимум 8 символов, включая цифру, букву и спецсимвол(@$!%*?&)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 5000);
    } else {
      dispatch(verifyCode({ email, code: verificationCode }))
        .unwrap()
        .then(() => {
          Animated.timing(animation, {
            toValue: -screenHeight,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setIsInitialForm(false);
            setErrors({});
          });
        })
        .catch((err) => {
          setErrors({ general: 'Неправильный код подтверждения.' });
          setTimeout(() => setErrors({}), 3000);
        });
    }
  };

  const handleBack = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsInitialForm(true);
      setErrors({});
    });
  };

  const handleRegister = () => {
    if (!selectedCharacter) {
      setErrors({ character: 'Выберите персонажа' });
      setTimeout(() => setErrors({}), 3000);
      return;
    }
    dispatch(checkEmail({ email }))
      .unwrap()
      .then(() => {
        dispatch(registerUser({ username, email, password, character_id: selectedCharacter }))
          .unwrap()
          .then(() => {
            navigation.navigate('Home');
          })
          .catch((err) => {
            setErrors({ general: err.error || 'Произошла ошибка при регистрации.' });
            setTimeout(() => setErrors({}), 3000);
          });
      })
      .catch((err) => {
        setErrors({ email: 'Электронная почта уже используется.' });
        setTimeout(() => setErrors({}), 3000);
      });
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
              style={[styles.input, errors.username && styles.errorBorder]}
              placeholder="Имя пользователя"
              value={username}
              onChangeText={setUsername}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            <TextInput
              style={[styles.input, errors.email && styles.errorBorder]}
              placeholder="Электронная почта"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <View style={styles.codeContainer}>
              <TextInput
                style={[styles.input, styles.codeInput, errors.verificationCode && styles.errorBorder]}
                placeholder="Код подтверждения"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
              <TouchableOpacity
                onPress={handleSendCode}
                style={[styles.sendCodeButton, timer > 0 && styles.disabledButton]}
                disabled={timer > 0}
              >
                <Text style={styles.buttonTextCode}>
                  {timer > 0 ? `Отправить код (${timer})` : 'Отправить код'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.verificationCode && <Text style={styles.errorText}>{errors.verificationCode}</Text>}

            <TextInput
              style={[styles.input, errors.password && styles.errorBorder]}
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.errorBorder]}
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
            <Text style={styles.textPolicy}>
              При регистрации вы соглашаетесь с <Text style={styles.link} onPress={() => setIsPrivacyPolicyVisible(true)}>политикой конфиденциальности</Text>.
            </Text>

            <TouchableOpacity onPress={handleContinue} style={styles.button}>
              <Text style={styles.buttonText}>Продолжить</Text>
            </TouchableOpacity>
          </>
        </View>
        <View style={styles.formSection}>
          <>
            <CharacterSelect onSelect={(character) => handleSelectCharacter(character)} characterId={selectedCharacter} />
            {errors.character && <Text style={styles.errorText}>{errors.character}</Text>}
            <TouchableOpacity onPress={handleBack} style={styles.button}>
              <Text style={styles.buttonText}>Назад</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister} style={styles.button}>
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </TouchableOpacity>
            {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
          </>
        </View>
      </Animated.View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPrivacyPolicyVisible}
        onRequestClose={() => setIsPrivacyPolicyVisible(false)}
      >
        <View style={styles.overlay}>
        <View style={styles.modalView}>
          <ScrollView>
          <PrivacyPolicyText />
          </ScrollView>
          <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setIsPrivacyPolicyVisible(false)}
            >
              <Text style={styles.buttonText}>Закрыть</Text>
            </TouchableOpacity>
        </View>
        </View>
      </Modal>
    </View>
  );
};

export default Register;
