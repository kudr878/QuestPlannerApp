import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, toggleTaskCompletion } from '../../redux/tasksSlice';
import { useNavigation } from '@react-navigation/native';
import { TaskStyle as styles } from '../styles/TaskStyle';

const TaskList = ({ activeTab }) => {
  const tasks = useSelector(state => state.tasks.tasks);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [deleteConfirm, setDeleteConfirm] = useState({});

  const handleDeleteTask = (taskId) => {
    if (deleteConfirm[taskId]) {
      dispatch(deleteTask(taskId));
      setDeleteConfirm(prevState => ({ ...prevState, [taskId]: false }));
    } else {
      setDeleteConfirm(prevState => ({ ...prevState, [taskId]: true }));
    }
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
      return tasks.filter(task => task.repeat_interval > 0 && task.deadline_type_id !== 2);
    } else {
      return tasks.filter(task => task.repeat_interval === 0 || task.deadline_type_id === 2);
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
              {task.description && <Text style={styles.description}>{filterEmptyLines(task.description)}</Text>}
              <Text style={styles.difficulty}>{task.difficulty_name}</Text>
              {task.repeatInfo && (
                <Text style={styles.repeatInfo}>
                  {task.repeatInfo}
                </Text>
              )}
              {task.subtasks && task.subtasks.map(subtask => (
                <View key={subtask.id} style={styles.subtaskContainer}>
                  <Text style={styles.subtaskText}>{filterEmptyLines(subtask.content)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
<TouchableOpacity 
                style={[styles.buttonTask, deleteConfirm[task.id] && styles.buttonDeleteConfirm]} 
                onPress={() => handleDeleteTask(task.id)}
                testID={`delete-task-${task.id}`}
              >
                <Text style={styles.subButtonText}>D</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.buttonTask, task.is_completed && styles.buttonDisabled]} 
                onPress={() => !task.is_completed && handleEditTask(task.id)}
                disabled={task.is_completed}
              >
                <Text style={styles.subButtonText}>E</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

export default TaskList;
