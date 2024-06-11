import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Button, ScrollView, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { taskFormStyles as styles } from '../styles/TaskFormStyles';

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
    monday: initialTask.monday || false,
    tuesday: initialTask.tuesday || false,
    wednesday: initialTask.wednesday || false,
    thursday: initialTask.thursday || false,
    friday: initialTask.friday || false,
    saturday: initialTask.saturday || false,
    sunday: initialTask.sunday || false,
    deleteSubtaskIds: [],
  });
  const [subtask, setSubtask] = useState({ content: '' });
  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const [errors, setErrors] = useState({});
  const [showRepeatInterval, setShowRepeatInterval] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState('date');

  const toggleDayOfWeek = (day) => {
    setTask((prevTask) => ({ ...prevTask, [day]: !prevTask[day] }));
  };

  const handleAddSubtask = () => {
    const trimmedContent = subtask.content.trim();
    if (!trimmedContent) {
      setErrors((prevErrors) => ({ ...prevErrors, subtask: true }));
      setTimeout(() => {
        setErrors((prevErrors) => {
          const { subtask, ...rest } = prevErrors;
          return rest;
        });
      }, 3000);
      return;
    }
    setSubtasks([...subtasks, { content: trimmedContent }]);
    setSubtask({ content: '' });
  };

  const handleUpdateSubtask = (index, content) => {
    const updatedSubtasks = subtasks.map((sub, i) =>
      i === index ? { ...sub, content } : sub
    );
    setSubtasks(updatedSubtasks);
  };

  const handleDeleteSubtask = (index) => {
    const subtaskToDelete = subtasks[index];
    if (subtaskToDelete.id) {
      setSubtasks(subtasks.filter((_, i) => i !== index));
      setTask(prevTask => ({
        ...prevTask,
        deleteSubtaskIds: [...prevTask.deleteSubtaskIds || [], subtaskToDelete.id]
      }));
    } else {
      setSubtasks(subtasks.filter((_, i) => i !== index));
    }
  };

  const validateTask = () => {
    const newErrors = {};
    if (!task.title) {
      newErrors.title = true;
    }
    if (subtasks.some(sub => !sub.content.trim())) {
      newErrors.subtask = true;
    }
    if (task.deadline_type_id === 4 && !daysOfWeek.some(day => task[day.value])) {
      newErrors.daysOfWeek = true;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 3000);
    }
    return Object.keys(newErrors).length === 0;
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

  const removeExtraEmptyLines = (text) => {
    if (!text) return '';
    return text
      .replace(/(^\s*\n)|(\s*\n$)/g, '')
      .replace(/\n{2,}/g, '\n\n');
  };

  const handleTaskSubmit = () => {
    if (validateTask()) {
      onSubmit({
        ...task,
        description: removeExtraEmptyLines(task.description),
        subtasks: subtasks.length > 0 ? subtasks.filter(sub => sub.content.trim() !== '').map(sub => ({ ...sub, content: removeExtraEmptyLines(sub.content) })) : null,
        deleteSubtaskIds: task.deleteSubtaskIds
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TextInput
          style={[styles.input, errors.title && styles.errorBorder]}
          placeholder="Task Title"
          value={task.title}
          onChangeText={(text) => setTask((prevTask) => ({ ...prevTask, title: text }))}
        />
        <TextInput
          style={styles.multilineInput}
          placeholder="Task Description"
          value={task.description}
          onChangeText={(text) => setTask((prevTask) => ({ ...prevTask, description: text }))}
          multiline
        />
        <Picker
          selectedValue={task.difficulty_id}
          style={styles.input}
          onValueChange={(itemValue) => setTask((prevTask) => ({ ...prevTask, difficulty_id: itemValue }))}
        >
          <Picker.Item label="Легкая" value={1} />
          <Picker.Item label="Обычная" value={2} />
          <Picker.Item label="Средняя" value={3} />
          <Picker.Item label="Тяжелая" value={4} />
        </Picker>
        <Text style={styles.subtaskTitle}>Настройка расписания</Text>

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
          <Picker.Item label="Не повторять" value={1} />
          <Picker.Item label="Один раз" value={2} />
          <Picker.Item label="Ежедневно" value={3} />
          <Picker.Item label="Еженедельно" value={4} />
          <Picker.Item label="Ежемесячно" value={5} />
          <Picker.Item label="Ежегодно" value={6} />
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
                style={[styles.dayButton, task[day.value] && styles.selectedDayButton, errors.daysOfWeek && styles.errorBorder]}
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

        <Text style={styles.subtaskTitle}>Дополнительно</Text>
        {subtasks.map((subtask, index) => (
          <View key={index} style={styles.subtaskContainer}>
            <TextInput
              style={styles.multilineInputSub}
              value={subtask.content}
              onChangeText={(text) => handleUpdateSubtask(index, text)}
              multiline
            />
            <TouchableOpacity onPress={() => handleDeleteSubtask(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          style={[styles.multilineInput, errors.subtask && styles.errorBorder]}
          placeholder="Subtask Content"
          value={subtask.content}
          onChangeText={(text) => setSubtask({ content: text })}
          multiline
        />

        <Button title="Add Subtask" onPress={handleAddSubtask} />
      </View>
    </ScrollView>
  );
};

export default TaskForm;
