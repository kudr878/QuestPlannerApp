import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask } from '../../redux/tasksSlice';
import TaskForm from '../components/TaskForm';

const CreateTask = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = (task) => {
    dispatch(addTask(task)).then(() => {
      navigation.goBack();
    });
  };

  return (
    <TaskForm onSubmit={handleSubmit} ownerId={user.id} />
  );
};

export default CreateTask;
