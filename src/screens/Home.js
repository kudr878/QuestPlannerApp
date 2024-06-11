import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '../../redux/authSlice';
import { characterImages, Images } from '../utils/characterImages';
import TaskList from '../components/TaskList';
import { fetchTasks } from '../../redux/tasksSlice';
import { homeScreenStyles as styles } from '../styles/HomeStyles';

const screenWidth = Dimensions.get('window').width;

const Home = ({ navigation, route }) => {
  const { initialTab } = route.params || { initialTab: 'Активности' };
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const scrollY = useRef(new Animated.Value(0)).current;
  const animation = useRef(new Animated.Value(initialTab === 'Активности' ? 0 : -screenWidth)).current;
  const [activeTab, setActiveTab] = useState(initialTab);

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

  if (!user) {
    return null;
  }

  const handleTabChange = (newTab) => {
    Animated.timing(animation, {
      toValue: newTab === 'Активности' ? 0 : -screenWidth,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(newTab);
    });
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
        <Animated.Image 
          source={characterImages[user.character_id]}         
          style={[styles.animatedImage, { opacity: imageOpacity }]} 
        />
      )}
      <Animated.View style={[styles.animatedContainer, animatedStyle, { width: screenWidth * 2 }]}>
        <View style={[styles.screen, { width: screenWidth }]}>
          <ScrollView
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
        style={styles.button} onPress={() => handleTabChange('Активности')
          
        }>
          <Text style={styles.buttonText}>Активности</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        activeOpacity={1}
        style={styles.addButton} onPress={() => navigation.navigate('CreateTask')}>
          <Image source={Images.plusButton} style={styles.plusButton} />
        </TouchableOpacity>
        <TouchableOpacity 
        activeOpacity={1}
        style={styles.button} onPress={() => handleTabChange('Квесты')}>
          <Text style={styles.buttonText}>Квесты</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
