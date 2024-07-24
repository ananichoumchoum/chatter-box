import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import ChatItem from '../components/ChatItem';

const dataFilePath = FileSystem.documentDirectory + 'chats.json';

const ChatHistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
    let chatData;
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
      chatData = JSON.parse(fileContent);
    } else {
      chatData = require('../data/chats.json');
    }

    const formattedChats = chatData.map(chat => {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return {
        id: chat.id,
        name: chat.name,
        lastMessage: lastMessage ? lastMessage.text : '',
        date: lastMessage ? lastMessage.date : '',
      };
    });
    formattedChats.sort((a, b) => new Date(b.date) - new Date(a.date));

    setChats(formattedChats);
  };

  useEffect(() => {
    fetchChats();

    const unsubscribe = navigation.addListener('focus', fetchChats);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ChatDetail', { id: item.id, name: item.name })}>
            <ChatItem name={item.name} lastMessage={item.lastMessage} date={item.date} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

ChatHistoryScreen.navigationOptions = ({ navigation }) => ({
  title: 'Chats',
  headerRight: () => (
    <TouchableOpacity onPress={() => navigation.navigate('NewChatScreen')} style={{ marginRight: 15 }}>
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  ),
  headerTitleStyle: {
    fontSize: 32,
    paddingBottom: 15,
    color: 'white',
  },
  headerStyle: {
    backgroundColor: '#1F1F1F',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatHistoryScreen;
