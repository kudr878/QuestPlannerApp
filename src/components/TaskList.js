import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, toggleTaskCompletion } from '../../redux/tasksSlice';
import { useNavigation } from '@react-navigation/native';
import { TaskStyle as styles } from '../styles/TaskStyle';

const TaskList = ({ activeTab }) => {
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

  const filterEmptyLines = (text) => {
    if (!text) return '';
    return text
      .split('\n')
      .filter((line, index, lines) => {
        return line.trim() !== '' || (index > 0 && lines[index - 1].trim() !== '');
      })
      .join('\n')
      .trim();
  }; 
   const filterTasks = (tasks, activeTab) => {
    if (activeTab === 'Активности') {
      return tasks.filter(task => task.repeat_interval > 0);
    } else {
      return tasks.filter(task => task.repeat_interval === 0);
    }
  };
  
  const filteredTasks = filterTasks(tasks, activeTab);

  return (
    <View style={styles.container}>
      {filteredTasks.length === 0 ? (
        <Text style={styles.noTasksText}>
          {activeTab === 'Активности' ? 'Активностей нет' : 'Квестов нет'}
        </Text>
      ) : (
        filteredTasks.map(task => (
          <View key={task.id} style={styles.taskContainer}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, task.is_completed && styles.checkboxCompleted]}
                onPress={() => handleToggleTaskCompletion(task.id)}
              >
                {task.is_completed && <Text style={styles.checkboxText}>✔</Text>}
              </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{task.title}</Text>
              {task.description && <Text>{filterEmptyLines(task.description)}</Text>}
              <Text>{task.difficulty_name}</Text>
              {task.repeatInfo && <Text>{task.repeatInfo}</Text>}
              {task.subtasks && task.subtasks.map(subtask => (
                <View key={subtask.id} style={styles.subtaskContainer}>
                  <Text>{filterEmptyLines(subtask.content)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonTask} onPress={() => handleDeleteTask(task.id)}>
                <Text >D</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonTask} onPress={() => handleEditTask(task.id)}>
                <Text>E</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

export default TaskList;
