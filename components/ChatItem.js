import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const ChatItem = ({ name, lastMessage, date }) => {
    const theme = useTheme();
    
    return (
        <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.leftContainer}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
            <Text style={styles.lastMessage}>{lastMessage}</Text>
        </View>
        <Text style={styles.date}>{date}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 2,
  },
  leftContainer: {
    flexDirection: 'column',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: 'grey',
    marginTop: 5,
  },
  date: {
    color: 'grey',
  },
});

export default ChatItem;
