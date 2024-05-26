import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../redux/settingsSlice';
import { updateUser, verifyPassword } from '../../redux/authSlice';
import bcrypt from 'bcryptjs';


const log = (level, message) => {
const loggingLevel = "debug";
  if (loggingLevel.localeCompare(level) <= 0) {
    console[level](message.trim());
  }
};

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
          inputs: [{ name: 'username', placeholder: 'Новое имя пользователя' }]
        },
        email: {
          title: 'Изменить электронную почту',
          inputs: [{ name: 'email', placeholder: 'Новая электронная почта' }]
        },
        password: {
            title: 'Изменить пароль',
            inputs: [
              { name: 'oldPassword', placeholder: 'Текущий пароль' },
              { name: 'newPassword', placeholder: 'Новый пароль'},
              { name: 'confirmPassword', placeholder: 'Подтвердите новый пароль' }
            ]
          }
        };
      
        const handleSave = async () => {
            if (field === 'password') {
                const result = await dispatch(verifyPassword({ username: user.username, password: formData.oldPassword }));
                if (result.error) {
                    setErrors(prev => ({ ...prev, oldPassword: 'Текущий пароль неверен' }));
                    return;
                }
    
                if (!formData.newPassword || formData.newPassword.trim() === '') {
                    setErrors(prev => ({ ...prev, newPassword: 'Введите новый пароль' }));
                    return;
                }
    
                if (formData.newPassword !== formData.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: 'Пароли не совпадают' }));
                    return;
                }
    
                const userData = { oldPassword: formData.oldPassword, newPassword: formData.newPassword };
                try {
                    const updatedUserData = await dispatch(updateSettings(userData)).unwrap();
                    dispatch(updateUser(updatedUserData));
                    alert('Пароль обновлен');
                    onClose();
                } catch (error) {
                    console.error('Ошибка при обновлении данных пользователя:', error);
                }
            } else {
                let isValid = true;
                const newErrors = {};
                if (field === 'username' && (!formData.username || formData.username === user.username)) {
                    newErrors.username = 'Введите новое имя пользователя или отличное от текущего';
                    isValid = false;
                }
    
                if (field === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!formData.email || formData.email === user.email || !emailRegex.test(formData.email)) {
                        newErrors.email = 'Введите корректный адрес электронной почты или отличный от текущего';
                        isValid = false;
                    }
                }
    
                if (!isValid) {
                    setErrors(newErrors);
                    return;
                }
    
                try {
                    const updatedUserData = await dispatch(updateSettings(formData)).unwrap();
                    dispatch(updateUser(updatedUserData));
                    alert('Данные обновлены');
                    onClose();
                } catch (error) {
                    console.error('Ошибка при обновлении данных пользователя:', error);
                }
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
                style={styles.input}
                value={formData[input.name] || ''}
                onChangeText={value => handleChange(input.name, value)}
              />
              {errors[input.name] && <Text style={styles.error}>{errors[input.name]}</Text>}
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
