import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';

const UserProfile = ({ navigation }) => {
    const user = useSelector(state => state.auth.user);
    console.log('Loaded user data in UserProfile:', user);
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Профиль пользователя</Text>
        {user ? (
          <>
            <Text>Имя: {user.username}</Text>
            <Text>Почта: {user.email}</Text> 
          </>
        ) : (
          <Text>Пользователь не найден</Text>
        )}
      </View>
    );
  };
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
    },
});

export default UserProfile;
