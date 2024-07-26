import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import MessageList from '../components/MessageList'; 
import MessageInput from '../components/MessageInput'; 
import generateBotResponse from '../utils/generateBotResponse';

const dataFilePath = FileSystem.documentDirectory + 'chats.json';

const ChatDetailScreen = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { id, name } = route.params;
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
      let chatData;
      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
        chatData = JSON.parse(fileContent);
      } else {
        chatData = require('../data/chats.json');
        await FileSystem.writeAsStringAsync(dataFilePath, JSON.stringify(chatData));
      }

      const chat = chatData.find(chat => chat.id === id);
      if (chat) {
        setChatHistory(chat.messages);
      }
    };

    fetchChatHistory();
  }, [id]);

  const saveChatData = async (data) => {
    try {
      await FileSystem.writeAsStringAsync(dataFilePath, JSON.stringify(data));
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
  
    const newMessage = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text: message,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // HH:MM format
      sent: true,
    };

    // Update the chat history with the new message
    const updatedChatHistory = [...chatHistory, newMessage];
    setChatHistory(updatedChatHistory);
    const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
    let chatData;
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
      chatData = JSON.parse(fileContent);
    } else {
      chatData = require('../data/chats.json');
    }
  
    const chatIndex = chatData.findIndex(chat => chat.id === id);
    if (chatIndex > -1) {
      chatData[chatIndex].messages = updatedChatHistory;
      await saveChatData(chatData);
    }

    setMessage('');
  
    const responseMessage = generateBotResponse(message);
    if (responseMessage) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        handleSendResponseMessage(responseMessage, updatedChatHistory);
      }, 3000); // Wait for 3 seconds before sending the bot response
    }
  };
  
  const handleSendResponseMessage = async (responseMessage, currentChatHistory) => {
    const newMessage = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text: responseMessage,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // HH:MM format
      sent: false, 
    };
    // Update the chat history with the bot's response
    const updatedChatHistory = [...currentChatHistory, newMessage];
    setChatHistory(updatedChatHistory);
  
    const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
    let chatData;
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
      chatData = JSON.parse(fileContent);
    } else {
      chatData = require('../data/chats.json');
    }
  
    const chatIndex = chatData.findIndex(chat => chat.id === id);
    if (chatIndex > -1) {
      chatData[chatIndex].messages = updatedChatHistory;
      await saveChatData(chatData);
    }
  };

  const handleLongPress = (message) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const handleDeleteMessage = async () => {
    const updatedChatHistory = chatHistory.filter(msg => msg.id !== selectedMessage.id);
    setChatHistory(updatedChatHistory);

    const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
    let chatData;
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(dataFilePath);
      chatData = JSON.parse(fileContent);
    } else {
      chatData = require('../data/chats.json');
    }

    const chatIndex = chatData.findIndex(chat => chat.id === id);
    if (chatIndex > -1) {
      chatData[chatIndex].messages = updatedChatHistory;
      await saveChatData(chatData);
    }

    setModalVisible(false);
  };

  const handleEditMessage = () => {
    setMessage(selectedMessage.text);
    setChatHistory(chatHistory.filter(msg => msg.id !== selectedMessage.id));
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <MessageList messages={chatHistory} onLongPress={handleLongPress} />
      {typing && <Text style={styles.typingIndicator}>{`${name} is typing...`}</Text>}
      <MessageInput message={message} onChangeText={setMessage} onSend={handleSendMessage} />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleEditMessage}>
              <Text style={styles.modalOption}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteMessage}>
              <Text style={styles.modalOption}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalOption}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

ChatDetailScreen.navigationOptions = ({ navigation, route }) => ({
  title: route.params.name,
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
  ),
  headerTitleStyle: {
    color: 'white',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  typingIndicator: {
    color: 'grey',
    padding: 10,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalOption: {
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  backButton: {
    marginLeft: 10,
  },
});

export default ChatDetailScreen;
