import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import CharacterSelect from '../components/CharacterSelect'; 
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../redux/settingsSlice'; 

const ChangeCharacterScreen = ({ navigation }) => {
    const user = useSelector(state => state.auth.user);
    const [selectedCharacter, setSelectedCharacter] = useState(user.character_id);
    const dispatch = useDispatch();

    const handleConfirm = () => {
        dispatch(updateSettings({ character_id: selectedCharacter }))
          .then(() => {
            navigation.goBack(); 
          })
          .catch((error) => {
            alert('Ошибка при обновлении персонажа: ' + error.message);
          });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Выберите нового персонажа</Text>
            <CharacterSelect onSelect={(character) => setSelectedCharacter(character.id)} characterId={selectedCharacter} />
            <Button title="Подтвердить выбор" onPress={handleConfirm} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default ChangeCharacterScreen;
