import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

const dataFilePath = FileSystem.documentDirectory + 'chats.json';

const SwipeableChatItem = ({ id, name, lastMessage, date, onDelete, onPress }) => {
  const theme = useTheme();

  const confirmDelete = () => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat?",
      [
        { text: "No", onPress: () => {}, style: "cancel" },
        { text: "Yes", onPress: () => onDelete(id) },
      ],
      { cancelable: true }
    );
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
      <Ionicons name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
        <Text style={styles.message}>{lastMessage}</Text>
        <Text style={styles.date}>{date}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  message: {
    color: 'grey',
    fontSize: 14,
  },
  date: {
    color: 'grey',
    fontSize: 12,
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
});

export default SwipeableChatItem;
