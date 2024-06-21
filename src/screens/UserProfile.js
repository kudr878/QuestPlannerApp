import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { characterImages } from '../utils/characterImages';
import { fetchUserData } from '../../redux/authSlice';
import { profileStyles as styles } from '../styles/UserProfileStyles';
export const calculateExperienceThreshold = (level) => {
  let threshold = 100;
  let increment_factor = 1.0;
  let increment = 150;
  for (let i = 1; i < level; i++) {
    threshold += increment * increment_factor;
    increment_factor += 0.2;
  }
  return threshold;
};

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
      <Image 
        source={require('../../assets/backgrounds/background.png')}
        style={{
            position: 'absolute',
            top: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            alignSelf: 'center',
        }}
        resizeMode='stretch'
      />
      <Text style={styles.text}>Дата регистрации: {new Date(user.first_login_date).toLocaleDateString()}</Text>
      <Text style={styles.text}>Всего входов: {user.login_count > 0 ? user.login_count : 1}</Text>
      <View style={styles.characterContainer}>
        <Image source={characterImages[user.character_id]} style={styles.image} />
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ChangeCharacterScreen')}>
          <Image source={require('../../assets/icons/iconEdit.png')} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>Уровень: {user.level}</Text>
      <Text style={styles.text}>{user.experience}/{experienceThreshold}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

export default React.memo(UserProfile);
