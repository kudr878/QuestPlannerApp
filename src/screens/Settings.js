import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import EditModal from '../components/EditModal';
import { logoutUser,clearUser } from '../../redux/authSlice';

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
        <Text style={styles.title}>Настройки пользователя</Text>
        <Button title="Изменить имя пользователя" onPress={() => openModal('username')} />
        <Button title="Изменить электронную почту" onPress={() => openModal('email')} />
        <Button title="Изменить пароль" onPress={() => openModal('password')} />
        <EditModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          field={currentField}    
          navigation={navigation}
        />
        <Button title="Выйти" onPress={handleLogout} />

      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  }
});

export default SettingsScreen;
