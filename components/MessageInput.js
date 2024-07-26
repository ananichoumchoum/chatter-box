import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageInput = ({ message, onChangeText, onSend  }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="grey"
        keyboardAppearance="dark"
        value={message}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <Ionicons name="paper-plane" size={24} color="purple" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#272727',
    padding: 20,
    backgroundColor: '#121212',
  },
  input: {
    flex: 1,
    color: 'white',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default MessageInput;
