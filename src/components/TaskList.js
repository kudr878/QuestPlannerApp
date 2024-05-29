import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, deleteSubtask } from '../../redux/tasksSlice';

const TaskList = () => {
    const tasks = useSelector(state => state.tasks.tasks);
    const dispatch = useDispatch();

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));
    };

    const handleDeleteSubtask = (subtaskId) => {
        dispatch(deleteSubtask(subtaskId));
    };

    return (
        <View style={styles.container}>
            {tasks.map(task => (
                <View key={task.id} style={styles.taskContainer}>
                    <Text style={styles.title}>{task.title}</Text>
                    <Text>{task.description}</Text>
                    <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
                        <Text style={styles.deleteButton}>Delete Task</Text>
                    </TouchableOpacity>
                    {task.subtasks && task.subtasks.map(subtask => (
                        <View key={subtask.id} style={styles.subtaskContainer}>
                            <Text>{subtask.content}</Text>
                            <TouchableOpacity onPress={() => handleDeleteSubtask(subtask.id)}>
                                <Text style={styles.deleteButton}>Delete Subtask</Text>
                            </TouchableOpacity>
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
    deleteButton: {
        marginTop: 5,
        color: 'red'
    }
});

export default TaskList;
