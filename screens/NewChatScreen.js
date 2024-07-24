import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import chatData from '../data/chats.json';

const dataFilePath = FileSystem.documentDirectory + 'chats.json';

const NewChatScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredContacts([]);
    } else {
      const filtered = chatData.filter((chat) =>
        chat.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  const saveChatData = async (data) => {
    try {
      await FileSystem.writeAsStringAsync(dataFilePath, JSON.stringify(data));
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  };

  const handleAddContact = async () => {
    const newId = chatData.length + 1;
    const newChat = {
      id: newId.toString(),
      name: searchText,
      messages: [],
    };
    chatData.push(newChat);
    await saveChatData(chatData);
    navigation.navigate('ChatDetail', { id: newChat.id, name: newChat.name });
  };

  const handleSelectContact = (contact) => {
    navigation.navigate('ChatDetail', { id: contact.id, name: contact.name });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="grey" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter contact name..."
          placeholderTextColor="grey"
          keyboardAppearance="dark"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredContacts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectContact(item)}>
            <Text style={styles.contactItem}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          searchText.length > 0 && (
            <TouchableOpacity onPress={handleAddContact}>
              <Text style={styles.addContactText}>Add "{searchText}" as a new contact</Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
  },
  contactItem: {
    padding: 15,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  addContactText: {
    padding: 15,
    color: 'purple',
    fontStyle: 'italic',
  },
  closeButton: {
    marginRight: 15,
  },
});

export default NewChatScreen;
