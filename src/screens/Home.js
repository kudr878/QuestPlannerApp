import React, { useState , useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true 
    );
    return () => backHandler.remove(); 
  }, []);

  return (
    <View style={styles.container}>
      <Text>Добро пожаловать домой, {user ? user.username : 'Гость'}!</Text>
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

export default Home;
