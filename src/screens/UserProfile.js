import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { characterImages } from '../utils/characterImages'; 
import { useDispatch } from 'react-redux';
import { fetchUserData } from '../../redux/authSlice';

const UserProfile = ({ navigation }) => {
  const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        dispatch(fetchUserData()); 
      });
    
      return unsubscribe;
    }, [navigation, dispatch]);
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Профиль пользователя</Text>
            {user ? (
                <>
                    <Text>Имя: {user.username}</Text>
                    <Text>Почта: {user.email}</Text>
                    <Image source={characterImages[user.character_id]} style={{ width: 200, height: 200 }} />
                    <Button title="Изменить персонажа" onPress={() => navigation.navigate('ChangeCharacterScreen')} />
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

export default React.memo(UserProfile);
