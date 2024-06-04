import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const daysOfWeek = [
  { name: 'Пн', value: 'monday' },
  { name: 'Вт', value: 'tuesday' },
  { name: 'Ср', value: 'wednesday' },
  { name: 'Чт', value: 'thursday' },
  { name: 'Пт', value: 'friday' },
  { name: 'Сб', value: 'saturday' },
  { name: 'Вс', value: 'sunday' },
];

const TaskForm = ({ onSubmit, initialTask = {}, initialSubtasks = [], ownerId }) => {
  const [task, setTask] = useState({
    ...initialTask,
    owner_id: ownerId,
    difficulty_id: initialTask.difficulty_id || 1,
    deadline_type_id: initialTask.deadline_type_id || 1,
    repeat_interval: initialTask.repeat_interval || 0,
    deadline_date: initialTask.deadline_date ? new Date(initialTask.deadline_date) : new Date(), 
  });
  const [subtask, setSubtask] = useState({ content: '' });
  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const [errors, setErrors] = useState({});
  const [showRepeatInterval, setShowRepeatInterval] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState('date');


  const handleAddSubtask = () => {
    if (!subtask.content) {
      Alert.alert('Validation Error', 'Subtask content cannot be empty');
      return;
    }
    setSubtasks([...subtasks, subtask]);
    setSubtask({ content: '' });
  };

  const validateTask = () => {
    const newErrors = {};
    if (!task.title) newErrors.title = 'Title is required';
    if (!task.difficulty_id) newErrors.difficulty_id = 'Difficulty is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTaskSubmit = () => {
    if (validateTask()) {
      onSubmit({ ...task, subtasks: subtasks.length > 0 ? subtasks : null });
    }
  };

  const handleDateTimePress = () => {
    setShowDateTimePicker(true);
    setDateTimePickerMode('date');
  };

  const handleDateTimeChange = (event, selectedValue) => {
    setShowDateTimePicker(false);
    if (event.type === 'set' && selectedValue) {
      setTask(prevTask => ({ ...prevTask, deadline_date: new Date(selectedValue) }));
      if (dateTimePickerMode === 'date') {
        setShowDateTimePicker(true);
        setDateTimePickerMode('time');
      }
    }
  };

  const toggleDayOfWeek = (day) => {
    setTask((prevTask) => ({ ...prevTask, [day]: !prevTask[day] }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={task.title}
        onChangeText={(text) => setTask((prevTask) => ({ ...prevTask, title: text }))}
      />
      {errors.title && <Text style={styles.error}>{errors.title}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={task.description}
        onChangeText={(text) => setTask((prevTask) => ({ ...prevTask, description: text }))}
      />
      <Picker
        selectedValue={task.difficulty_id}
        style={styles.input}
        onValueChange={(itemValue) => setTask((prevTask) => ({ ...prevTask, difficulty_id: itemValue }))}
      >
        <Picker.Item label="Select Difficulty" value={null} />
        <Picker.Item label="Easy" value={1} />
        <Picker.Item label="Normal" value={2} />
        <Picker.Item label="Hard" value={3} />
        <Picker.Item label="Very Hard" value={4} />
      </Picker>
      {errors.difficulty_id && <Text style={styles.error}>{errors.difficulty_id}</Text>}
    
      <Picker
        selectedValue={task.deadline_type_id}
        style={styles.input}
        onValueChange={(itemValue) => {
          const newTaskSettings = {
            ...task,
            deadline_type_id: itemValue,
            repeat_interval: (itemValue !== 1 && itemValue !== 2) ? Math.max(1, task.repeat_interval) : 0,
          };
          setTask(newTaskSettings);
          setShowRepeatInterval(itemValue !== 1 && itemValue !== 2);
        }}
      >
        <Picker.Item label="No Repeat" value={1} />
        <Picker.Item label="Once" value={2} />
        <Picker.Item label="Daily" value={3} />
        <Picker.Item label="Weekly" value={4} />
        <Picker.Item label="Monthly" value={5} />
        <Picker.Item label="Yearly" value={6} />
      </Picker>
    
      {showRepeatInterval && (
        <View style={styles.repeatIntervalContainer}>
          <Text style={styles.label}>Repeat Interval:</Text>
          <View style={styles.intervalControls}>
            <Button title="-" onPress={() => setTask((prevTask) => ({ ...prevTask, repeat_interval: Math.max(1, prevTask.repeat_interval - 1) }))} />
            <Text style={styles.intervalText}>{task.repeat_interval}</Text>
            <Button title="+" onPress={() => setTask((prevTask) => ({ ...prevTask, repeat_interval: prevTask.repeat_interval + 1 }))} />
          </View>
        </View>
      )}
    
      {task.deadline_type_id === 4 && (
        <View style={styles.daysOfWeekContainer}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[styles.dayButton, task.days_of_week[day.value] && styles.selectedDayButton]}
              onPress={() => toggleDayOfWeek(day.value)}
            >
              <Text style={styles.dayButtonText}>{day.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    
      {(task.deadline_type_id === 2 || task.deadline_type_id > 2) && (
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {task.deadline_date instanceof Date ? `${task.deadline_date.toLocaleDateString()} ${task.deadline_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select Date and Time'}
            </Text>
          </View>
          <TouchableOpacity style={styles.datePickerButton} onPress={handleDateTimePress}>
            <Text style={styles.datePickerButtonText}>📅</Text>
          </TouchableOpacity>
          {showDateTimePicker && (
            <DateTimePicker
              value={task.deadline_date}
              mode={dateTimePickerMode}
              display="default"
              onChange={handleDateTimeChange}
              />
            )}
          </View>
          )}
            <Button title="Сохранить задачу" onPress={handleTaskSubmit} />
        
        <Text style={styles.subtaskTitle}>Subtasks</Text>
        {subtasks.map((subtask, index) => (
          <Text key={index} style={styles.subtaskText}>{subtask.content}</Text>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Subtask Content"
          value={subtask.content}
          onChangeText={(text) => setSubtask({ content: text })}
        />
        <Button title="Сохранить подзадачу" onPress={handleAddSubtask} />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
  },
  error: {
    color: 'red',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
  },
  datePickerButton: {
    marginHorizontal: 5,
  },
  datePickerButtonText: {
    fontSize: 24,
  },
  repeatIntervalContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
  },
  intervalControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intervalText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  dayButton: {
    padding: 8,
    margin: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  selectedDayButton: {
    backgroundColor: '#cce5ff',
    borderColor: '#007bff',
  },
  dayButtonText: {
    fontSize: 16,
  },
  subtaskTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtaskText: {
    marginVertical: 4,
  },
});

export default TaskForm;
