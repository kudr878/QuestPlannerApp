import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ActivityIndicator } from 'react-native';
import TaskForm from '../components/TaskForm';
import { fetchTask, updateTask } from '../../redux/tasksSlice';

const EditTask = ({ route, navigation }) => {
  const { taskId } = route.params;
  const dispatch = useDispatch();
  const task = useSelector(state => state.tasks.tasks.find(t => t.id === taskId));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!task) {
      dispatch(fetchTask(taskId)).then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [taskId, dispatch, task]);

  const handleSave = (taskData) => {
    dispatch(updateTask({ taskId, taskData })).then(() => {
      navigation.goBack();
    });
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!task) {
    return <View><Text>Task not found!</Text></View>;
  }

  return (
    <TaskForm onSubmit={handleSave} initialTask={task} initialSubtasks={task.subtasks || []} />
  );
};

export default EditTask;
