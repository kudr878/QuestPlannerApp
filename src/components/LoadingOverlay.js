import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingOverlay = ({ isVisible }) => {
  return (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#797979" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
  }
});

export default LoadingOverlay;
