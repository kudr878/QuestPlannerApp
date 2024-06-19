import React, { useState } from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import CharacterSelect from '../components/CharacterSelect'; 
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../redux/settingsSlice'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import { profileStyles as styles } from '../styles/UserProfileStyles';

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
            <Image 
              source={require('../../assets/backgrounds/background.png')}
              style={{
                  position: 'absolute',
                  top: 0,
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                  alignSelf: 'center',
              }}
              resizeMode='stretch'
            />
            <Text style={styles.title}>Выберите нового персонажа</Text>
            <CharacterSelect onSelect={(character) => setSelectedCharacter(character.id)} characterId={selectedCharacter} />
            <TouchableOpacity
                style={styles.button}
                onPress={handleConfirm}
            >
                <Text style={styles.buttonText}>
                    Подтвердить выбор
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChangeCharacterScreen;
