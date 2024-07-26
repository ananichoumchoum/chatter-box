import React from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const MessageList = ({ messages, onLongPress }) => {
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <TouchableOpacity onLongPress={() => onLongPress(item)}>
          <View style={styles.messageContainer}>
            <Text style={styles.date}>{item.date}</Text>
            <View style={[styles.messageBox, item.sent && styles.sentMessageBox]}>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 20,
  },
  date: {
    color: 'grey',
    marginBottom: 5,
  },
  messageBox: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#2C2C2E',
  },
  sentMessageBox: {
    backgroundColor: 'purple', 
  },
  messageText: {
    color: 'white',
  },
  time: {
    color: 'grey',
    textAlign: 'right',
    marginTop: 5,
  },
});

export default MessageList;
