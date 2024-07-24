import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const dataFilePath = FileSystem.documentDirectory + 'chats.json';

const ChatDetailScreen = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { id, name } = route.params;
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

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
      id: (chatHistory.length + 1).toString(),
      text: message,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // HH:MM format
      sent: true,
    };

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
      <FlatList
        data={chatHistory}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)}>
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="grey"
          keyboardAppearance="dark"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="paper-plane" size={24} color="purple" />
        </TouchableOpacity>
      </View>

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
  backButton: {
    marginLeft: 10,
  },
  headerButton: {
    marginRight: 15,
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
});

export default ChatDetailScreen;
