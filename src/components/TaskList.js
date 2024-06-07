import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, toggleTaskCompletion } from '../../redux/tasksSlice';
import { useNavigation } from '@react-navigation/native';
const TaskList = () => {
  const tasks = useSelector(state => state.tasks.tasks);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const handleToggleTaskCompletion = (taskId) => {
    dispatch(toggleTaskCompletion(taskId));
  };

  const handleEditTask = (taskId) => {
    navigation.navigate('EditTask', { taskId }); 
  };

  return (
    <View style={styles.container}>
      {tasks.map(task => (
        <View key={task.id} style={styles.taskContainer}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, task.is_completed && styles.checkboxCompleted]}
              onPress={() => handleToggleTaskCompletion(task.id)}
            >
              {task.is_completed && <Text style={styles.checkboxText}>✔</Text>}
            </TouchableOpacity>
            <Text>Выполнено</Text>
          </View>
          <Text style={styles.title}>{task.title}</Text>
          <Text>{task.description}</Text>
          <Text>Сложность: {task.difficulty_name}</Text>
          {task.repeatInfo && (
            <Text>{task.repeatInfo}</Text>
          )}
          <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
            <Text style={styles.deleteButton}>Delete Task</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEditTask(task.id)} style={styles.editButton}>
            <Text>Edit Task</Text>
          </TouchableOpacity>
          {task.subtasks && task.subtasks.map(subtask => (
            <View key={subtask.id} style={styles.subtaskContainer}>
              <Text>{subtask.content}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  taskContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtaskContainer: {
    paddingLeft: 20,
    marginTop: 5,
    backgroundColor: '#e0e0e0'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxCompleted: {
    backgroundColor: '#000',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 18,
  },
  deleteButton: {
    marginTop: 5,
    color: 'red'
  },
  editButton: { 
    marginTop: 5,
    backgroundColor: '#add8e6',
    padding: 10,
    borderRadius: 5
  }
});

export default TaskList;
