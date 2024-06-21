import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, updateTask } from '../../redux/tasksSlice';
import TaskForm from '../components/TaskForm';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, ActivityIndicator, Dimensions, Image } from 'react-native';

const EditTask = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const taskId = route.params.taskId;

  const task = useSelector(state => state.tasks.tasks.find(t => t.id === taskId));
  const [initialData, setInitialData] = useState(null);
  const [initialSubtasks, setInitialSubtasks] = useState([]);

  useEffect(() => {
    if (!task) {
      dispatch(fetchTasks(taskId));
    } else {
      setInitialData(task);
      setInitialSubtasks(task.subtasks || []);
    }
  }, [taskId, task, dispatch]);

  const handleSubmit = (taskData) => {
    dispatch(updateTask({ taskId: task.id, taskData })).then(() => {
      dispatch(fetchTasks(task.owner_id)); 
      navigation.navigate('Home'); 
    });
  };

  if (!initialData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
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
    <TaskForm onSubmit={handleSubmit} initialTask={initialData} initialSubtasks={initialSubtasks} />
  </View>
  );
};

export default EditTask;
