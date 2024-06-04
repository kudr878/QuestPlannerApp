import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '../../redux/authSlice'; 
import { characterImages } from '../utils/characterImages';
import TaskList from '../components/TaskList';
import { fetchTasks } from '../../redux/tasksSlice';

const Home = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserData());
      dispatch(fetchTasks(user.id));
    } else {
      navigation.replace('Auth');
    }
  }, [user, dispatch, navigation]);

  if (!user) {
    return null;
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <Image source={characterImages[user.character_id]} style={{ width: 200, height: 200 }} />
      <TaskList />
      <Button title="Create Task" onPress={() => navigation.navigate('CreateTask')} />
    </View>
    </ScrollView>
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
