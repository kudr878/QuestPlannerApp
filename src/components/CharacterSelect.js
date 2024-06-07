import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
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
        <View style={styles.container}>
            <Text style={styles.title}>Выберите персонажа:</Text>
            <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContent}>
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollViewContent: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginHorizontal: 10,
    },
    selected: {
        borderWidth: 3,
        borderColor: 'blue',
    },
});

export default CharacterSelect;
