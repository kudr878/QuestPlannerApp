import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import Login from '../components/Login';
import Register from '../components/Register';
import { authStyles as styles } from '../styles/AuthStyles';
import { screenWidth } from '../styles/const';

const Auth = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isLogin ? 0 : -screenWidth,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isLogin]);

  const handleSwitch = (showLogin) => {
    setIsLogin(showLogin);
  };

  const animatedStyle = {
    transform: [
      {
        translateX: animation,
      },
    ],
  };

  return (
    <View style={styles.container}>
    <View style={styles.switchContainer}>
        <TouchableOpacity
        activeOpacity={1}
          onPress={() => handleSwitch(true)}
          style={[styles.buttonLog, isLogin ? { backgroundColor: '#76c7c0' } : { backgroundColor: 'gray' }]}
        >
          <Text style={styles.buttonText}>Логин</Text>
        </TouchableOpacity>
        <TouchableOpacity
        activeOpacity={1}
          onPress={() => handleSwitch(false)}
          style={[styles.buttonReg, !isLogin ? { backgroundColor: '#76c7c0' } : { backgroundColor: 'gray' }]}
        >
          <Text style={styles.buttonText}>Регистрация</Text>
        </TouchableOpacity>
      </View>
        <Animated.View style={[styles.animatedContainerAuth, animatedStyle]}>
          <View style={styles.screen}>
            <Login navigation={navigation} />
          </View>
          <View style={styles.screen}>
            <Register navigation={navigation} />
          </View>
        </Animated.View>
    </View>
  );
};


export default Auth;
