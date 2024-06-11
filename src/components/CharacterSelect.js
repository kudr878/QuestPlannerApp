import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { characterImages } from '../utils/characterImages';

const CharacterSelect = ({ onSelect, characterId }) => {
    const characterIds = Object.keys(characterImages);
    const initialIndex = characterId ? characterIds.indexOf(characterId) : 0;
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const dispatch = useDispatch();

    const handleCharacterSelect = (index) => {
        const id = characterIds[index];
        const character = { id, src: characterImages[id] };
        setSelectedIndex(index);
        onSelect(character);
    };

    const handleNext = () => {
        if (selectedIndex < characterIds.length - 1) {
            handleCharacterSelect(selectedIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (selectedIndex > 0) {
            handleCharacterSelect(selectedIndex - 1);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.navigation}>
                <View style={styles.arrowContainer}>
                    {selectedIndex > 0 && (
                        <TouchableOpacity onPress={handlePrevious}>
                            <Text style={styles.arrow}>←</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Image
                    source={characterImages[characterIds[selectedIndex]]}
                    style={[styles.image, styles.selected]}
                />
                <View style={styles.arrowContainer}>
                    {selectedIndex < characterIds.length - 1 && (
                        <TouchableOpacity onPress={handleNext}>
                            <Text style={styles.arrow}>→</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width * .8,
        aspectRatio: 1,
        marginHorizontal: '1%',
    },
    arrowContainer: {
        width: 40, 
        alignItems: 'center',
    },
    arrow: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    selected: {
        borderWidth: 3,
        borderColor: 'blue',
    },
});

export default CharacterSelect;
