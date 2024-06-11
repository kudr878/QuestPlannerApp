import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { characterImages } from '../utils/characterImages';
import { useDispatch } from 'react-redux';
import { fetchUserData } from '../../redux/authSlice';

const UserProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [currentLevelExperience, setCurrentLevelExperience] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchUserData());
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  const calculateExperienceThreshold = (level) => {
    let threshold = 100;
    let increment_factor = 1.0;
    let increment = 150;
    for (let i = 1; i < level; i++) {
      threshold += increment * increment_factor;
      increment_factor += 0.2;
    }
    return threshold;
  };

  useEffect(() => {
    if (user) {
      const previousLevelThreshold = user.level > 1 ? calculateExperienceThreshold(user.level - 1) : 0;
      setCurrentLevelExperience(user.experience - previousLevelThreshold);
    }
  }, [user]);

  const experienceThreshold = calculateExperienceThreshold(user.level);
  const previousLevelThreshold = user.level > 1 ? calculateExperienceThreshold(user.level - 1) : 0;
  const progress = ((user.experience - previousLevelThreshold) / (experienceThreshold - previousLevelThreshold)) * 100;

  return (
    <View style={styles.container}>
      <Text>Имя: {user.username}</Text>
      <Text>Почта: {user.email}</Text>
      <Text>Дата регистрации: {new Date(user.first_login_date).toLocaleDateString()}</Text>
      <Text>Последний вход: {new Date(user.last_login_date).toLocaleDateString()}</Text>
      <Text>Всего входов: {user.login_count > 0 ? user.login_count : 1}</Text>
      <Image source={characterImages[user.character_id]} style={{ width: 200, height: 200 }} />
      <Button title="Изменить персонажа" onPress={() => navigation.navigate('ChangeCharacterScreen')} />

      <Text>Уровень: {user.level}</Text>
      <Text>{user.experience}/{experienceThreshold}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
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
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0df',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#76c7c0',
    borderRadius: 5,
  },
});

export default React.memo(UserProfile);
