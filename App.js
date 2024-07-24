import React from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import ChatHistoryScreen from './screens/ChatHistoryScreen';
import HeaderButton from './components/HeaderButton';
import ChatDetailScreen from './screens/ChatDetailScreen';
import NewChatScreen from './screens/NewChatScreen';

const Stack = createStackNavigator();

// Custom Dark Theme
const CustomDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: '#BB86FC',
    background: '#121212',
    card: '#1F1F1F',
    text: '#FFFFFF',
    border: '#272727',
  },
};

export default function App() {
  return (
    <PaperProvider theme={CustomDarkTheme}>
      <NavigationContainer theme={CustomDarkTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Chats"
            component={ChatHistoryScreen}
            options={({ navigation }) => ({
              title: 'Chats',
              headerTitleStyle: {
                fontSize: 32,
                paddingBottom: 25,
                color: CustomDarkTheme.colors.text,
              },
              headerRight: () => (
                <HeaderButton onPress={() => navigation.navigate('NewChatScreen')} />
              ),
              headerStyle: {
                backgroundColor: CustomDarkTheme.colors.card,
              },
            })}
          />
           <Stack.Screen
            name="ChatDetail"
            component={ChatDetailScreen}
            options={({ route }) => ({
              title: route.params.name,
              headerTitleStyle: {
                fontSize: 32,
                paddingBottom: 15,
                color: CustomDarkTheme.colors.text,
              },
              headerStyle: {
                backgroundColor: CustomDarkTheme.colors.card,
              },
            })}
          />
           <Stack.Screen
            name="NewChatScreen"
            component={NewChatScreen}
            options={({ navigation }) => ({
              title: 'New Chat',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              ),
              headerLeft: () => null, 
              headerTitleStyle: {
                color: 'white',
              },
              headerStyle: {
                backgroundColor: '#1F1F1F',
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
