import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { characterImages } from '../utils/characterImages'; 

const CharacterSelect = ({ onSelect, characterId }) => {
    const [selectedCharacter, setSelectedCharacter] = useState(characterId ? characterImages[characterId] : null);
    const dispatch = useDispatch();

    const handleCharacterSelect = (id) => {
        const character = { id, src: characterImages[id] };
        setSelectedCharacter(character);
        onSelect(character);
    };

    return (
        <View>
            <Text>Select a character:</Text>
            <View style={styles.characterGrid}>
                {Object.keys(characterImages).map((id) => (
                    <TouchableOpacity key={id} onPress={() => handleCharacterSelect(id)}>
                        <Image
                            source={characterImages[id]}
                            style={[
                                styles.image,
                                selectedCharacter && selectedCharacter.id === id ? styles.selected : {},
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    selected: {
        borderWidth: 3,
        borderColor: 'blue',
    },
    characterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
});

export default CharacterSelect;
