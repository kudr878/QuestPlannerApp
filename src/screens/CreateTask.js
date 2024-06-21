import React from 'react';
import { Dimensions, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTask } from '../../redux/tasksSlice';
import TaskForm from '../components/TaskForm';
import { View } from 'react-native-animatable';

const CreateTask = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = (task) => {
    dispatch(addTask(task)).then(({ payload }) => {
      const taskType = payload.repeat_interval > 0 ? 'Активности' : 'Квесты';
      navigation.navigate('Home', { initialTab: taskType });
    });
  };

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
      <TaskForm onSubmit={handleSubmit} ownerId={user.id} />
    </View>
  );
};

export default CreateTask;
