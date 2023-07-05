import 'react-native-url-polyfill/auto';

import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('');

  const handleClick = async () => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    );
    try {
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `${inputMessage}` }],
      });
      console.log(completion.data.choices[0].message.content);
      const aiMessage =
        completion && completion.data.choices[0].message.content.trim();
      setOutputMessage(aiMessage);
      const message = {
        _id: Math.random().toString(36).substring(7),
        text: aiMessage,
        createdAt: new Date(),
        user: {
          _id: 2,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );
    } catch (error) {
      console.log(error.message, 'ERROR');
    }
    setInputMessage('');
  };

  const generateImages = async () => {
    try {
      if (openai) console.log('openai image is ready');
      const response = await openai.createImage({
        prompt: `${inputMessage}`,
        n: 1,
        size: '1024x1024',
      });
      const image_url = response && response.data.data[0].url;
      console.log(image_url);
      setOutputMessage(image_url);
    } catch (error) {
      console.log(error.message, 'ERROR CREATING IMAGE');
    }
    setInputMessage('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <GiftedChat
          renderInputToolbar={() => {}}
          messages={messages}
          user={{ _id: 1 }}
        />
      </View>
      <View
        style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}
      >
        <View style={{ flex: 1, marginLeft: 10, marginBottom: 20 }}>
          <TextInput
            style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 10,
              borderColor: '#ccc',
              borderWidth: 1,
              height: 50,
              shadowColor: '#000',
              shadowOffset: {
                width: 1,
                height: 3,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
            placeholder='Enter Query'
            onChangeText={(text) => setInputMessage(text)}
            value={inputMessage}
          />
        </View>
        <TouchableOpacity onPress={handleClick}>
          <View
            style={{
              backgroundColor: '#171717',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              padding: 8,
              marginRight: 10,
              marginBottom: 20,
              borderRadius: 50,
              height: 50,
              width: 50,
              shadowColor: '#000',
              shadowOffset: {
                width: 1,
                height: 3,
              },
              shadowOpacity: 0.5,
              shadowRadius: 3.84,

              elevation: 5,
            }}
          >
            <MaterialCommunityIcons name='send' size={30} color='#eee' />
          </View>
        </TouchableOpacity>
      </View>

      <StatusBar style='auto' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
