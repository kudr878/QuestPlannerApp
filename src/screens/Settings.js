import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import EditModal from '../components/EditModal';
import { logoutUser, clearUser } from '../../redux/authSlice';
import { settingsStyles as styles } from '../styles/SettingsStyles';

const SettingsScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentField, setCurrentField] = useState('');
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
      dispatch(logoutUser())
        .unwrap()
        .then(() => {
          dispatch(clearUser());
          navigation.replace('Auth');
        })
        .catch((error) => {
          alert('Ошибка при выходе из системы: ' + error.message);
        });
    };
  
    const openModal = (field) => {
      setCurrentField(field);
      setModalVisible(true);
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => openModal('username')}>
          <Text style={styles.buttonText}>Изменить имя пользователя</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openModal('email')}>
          <Text style={styles.buttonText}>Изменить электронную почту</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openModal('password')}>
          <Text style={styles.buttonText}>Изменить пароль</Text>
        </TouchableOpacity>
        <EditModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          field={currentField}    
          navigation={navigation}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    );
};

export default SettingsScreen;
