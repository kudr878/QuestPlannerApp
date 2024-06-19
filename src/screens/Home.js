import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '../../redux/authSlice';
import { characterImages, Images } from '../utils/characterImages';
import TaskList from '../components/TaskList';
import { fetchTasks } from '../../redux/tasksSlice';
import { homeScreenStyles as styles } from '../styles/HomeStyles';
import { calculateExperienceThreshold } from './UserProfile';

const screenWidth = Dimensions.get('window').width;

const Home = ({ navigation, route }) => {
  const { initialTab } = route.params || { initialTab: 'Активности' };
  const xp = useSelector((state) => state.auth.user?.xp);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const scrollY = useRef(new Animated.Value(0)).current;
  const animation = useRef(new Animated.Value(initialTab === 'Активности' ? 0 : -screenWidth)).current;
  const [activeTab, setActiveTab] = useState(initialTab);

  const scrollViewRef1 = useRef(null);
  const scrollViewRef2 = useRef(null);

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserData());
      dispatch(fetchTasks(user.id));
    } else {
      navigation.replace('Auth');
    }
  }, [user, dispatch, navigation]);

  useEffect(() => {
    if (route.params && route.params.initialTab) {
      handleTabChange(route.params.initialTab);
    }
  }, [route.params]);

  const handleTabChange = (newTab) => {
    resetScrollPosition(newTab);
    resetImageOpacity();

    Animated.timing(animation, {
      toValue: newTab === 'Активности' ? 0 : -screenWidth,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(newTab);
    });
  };

  const resetScrollPosition = (newTab) => {
    if (newTab === 'Активности') {
      scrollViewRef1.current?.scrollTo({ y: 0, animated: false });
    } else {
      scrollViewRef2.current?.scrollTo({ y: 0, animated: false });
    }
  };

  const resetImageOpacity = () => {
    scrollY.setValue(0);
  };

  const animatedStyle = {
    transform: [
      {
        translateX: animation,
      },
    ],
  };

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 350],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (!user) {
    return null;
  }

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
      {user.character_id && (
        <React.Fragment>
          <Animated.Image 
            source={characterImages[user.character_id]}         
            style={[styles.animatedImage, { opacity: imageOpacity }]} 
          />
          <Animated.View style={[styles.levelExperienceContainer, { opacity: imageOpacity }]}>
            <Text style={styles.levelExperienceText}>Уровень: {user.level}</Text>
            <Text style={styles.levelExperienceText}>{user.experience}/{experienceThreshold}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[
                styles.progressBar, 
                { width: `${progress}%` }
              ]} />
            </View>
          </Animated.View>
        </React.Fragment>
      )}
      <Animated.View style={[styles.animatedContainer, animatedStyle, { width: screenWidth * 2 }]}>
        <View style={[styles.screen, { width: screenWidth }]}>
          <ScrollView
            ref={scrollViewRef1}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            <TaskList activeTab="Активности" />
          </ScrollView>
        </View>
        <View style={[styles.screen, { width: screenWidth }]}>
          <ScrollView
            ref={scrollViewRef2}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            <TaskList activeTab="Квесты" />
          </ScrollView>
        </View>
      </Animated.View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          activeOpacity={1}
          style={styles.button} 
          onPress={() => handleTabChange('Активности')}
        >
          <Text style={styles.buttonText}>Активности</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => navigation.navigate('CreateTask')}
        >
          <Image source={Images.plusButton} style={styles.plusButton} />
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={1}
          style={styles.button} 
          onPress={() => handleTabChange('Квесты')}
        >
          <Text style={styles.buttonText}>Квесты</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
