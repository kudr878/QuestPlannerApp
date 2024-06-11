import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../redux/settingsSlice';
import { updateUser } from '../../redux/authSlice';
import {
  validateUsername,
  validateEmail,
  validateCurrentPassword,
  validatePassword,
  validateConfirmPassword
} from '../utils/errorMessages';
import { taskFormStyles } from '../styles/TaskFormStyles';

const EditModal = ({ visible, onClose, field, navigation }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    setFormData({});
    setErrors({});
  }, [field, visible]);

  const fieldSettings = {
    username: {
      title: 'Изменить имя пользователя',
      inputs: [{ name: 'username', placeholder: 'Новое имя пользователя', validate: validateUsername }]
    },
    email: {
      title: 'Изменить электронную почту',
      inputs: [{ name: 'email', placeholder: 'Новая электронная почта', validate: validateEmail }]
    },
    password: {
      title: 'Изменить пароль',
      inputs: [
        { name: 'oldPassword', placeholder: 'Старый пароль', secureTextEntry: true, validate: validateCurrentPassword },
        { name: 'newPassword', placeholder: 'Новый пароль', secureTextEntry: true, validate: validatePassword },
        { name: 'confirmPassword', placeholder: 'Подтвердите новый пароль', secureTextEntry: true, validate: validateConfirmPassword }
      ]
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    let isValid = true;

    for (const input of fieldSettings[field].inputs) {
        let error;
        if (input.name === 'oldPassword') {
            error = await input.validate(dispatch, user.username, formData[input.name]);
        } else if (input.name === 'confirmPassword') {
            error = input.validate(formData.newPassword, formData[input.name]);
        } else if (input.name === 'newPassword') {
            error = input.validate(formData[input.name], formData.oldPassword);
        } else {
            error = input.validate(formData[input.name], user[input.name]);
        }
        if (error) {
            newErrors[input.name] = error;
            if (error === 'EMPTY_FIELD') {
                setTimeout(() => {
                    setErrors(prevErrors => ({ ...prevErrors, [input.name]: '' }));
                }, 3000);
            } else {
                isValid = false;
            }
        }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).some(key => newErrors[key] === 'EMPTY_FIELD')) {
        isValid = false;
    }

    if (!isValid) return;

    try {
        await dispatch(updateSettings(formData)).unwrap();
        onClose();
    } catch (error) {
        console.error('Ошибка при обновлении данных пользователя:', error);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  if (!field) return null;

  const { title, inputs } = fieldSettings[field];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {inputs.map((input, index) => (
            <View key={index}>
              <TextInput
                placeholder={input.placeholder}
                secureTextEntry={input.secureTextEntry || false}
                style={[styles.input, errors[input.name] && taskFormStyles.errorBorder]}
                value={formData[input.name] || ''}
                onChangeText={value => handleChange(input.name, value)}
              />
              {errors[input.name] && errors[input.name] !== 'EMPTY_FIELD' && (
                <Text style={styles.error}>{errors[input.name]}</Text>
              )}
            </View>
          ))}
          <View style={styles.buttonContainer}>
            <Button title="Отмена" onPress={onClose} />
            <Button title="Сохранить" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5
  },
  error: {
    color: 'red',
    marginBottom: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default EditModal;
