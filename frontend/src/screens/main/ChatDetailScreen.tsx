import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Avatar, Text, Button, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  senderId: string;
  messageType: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    profileImage?: string;
  };
}

const ChatDetailScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const route = useRoute();
  const navigation = useNavigation();
  const { match } = route.params as { match: any };
  const { sendMessage, getMessages, joinMatch, leaveMatch } = useChat();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    joinMatch(match.id);
    
    return () => {
      leaveMatch(match.id);
    };
  }, [match.id]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const messagesData = await getMessages(match.id);
      setMessages(messagesData);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageContent = newMessage.trim();
      setNewMessage('');
      
      // Envoyer le message via WebSocket
      sendMessage(match.id, messageContent, 'text');
      
      // Ajouter le message localement pour un feedback immédiat
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        senderId: user!.id,
        messageType: 'text',
        createdAt: new Date().toISOString(),
        sender: {
          id: user!.id,
          username: user!.username,
          profileImage: user!.profileImage
        }
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // Scroll vers le bas
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const handleTypingStart = () => {
    setIsTyping(true);
  };

  const handleTypingEnd = () => {
    setIsTyping(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isFromMe = item.senderId === user!.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isFromMe ? styles.myMessage : styles.otherMessage
      ]}>
        {!isFromMe && (
          <Avatar.Image
            size={32}
            source={{ 
              uri: item.sender.profileImage || 'https://via.placeholder.com/32x32/6366f1/ffffff?text=Avatar'
            }}
            style={styles.messageAvatar}
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isFromMe ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isFromMe ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isFromMe ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Avatar.Image
          size={40}
          source={{ 
            uri: match.otherUser.profileImage || 'https://via.placeholder.com/40x40/6366f1/ffffff?text=Avatar'
          }}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerUsername}>{match.otherUser.username}</Text>
          <Text style={styles.headerStatus}>En ligne</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>{match.otherUser.username} est en train d'écrire...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Tapez votre message..."
          multiline
          onFocus={handleTypingStart}
          onBlur={handleTypingEnd}
        />
        <Button
          mode="contained"
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
          style={styles.sendButton}
        >
          Envoyer
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 10,
  },
  headerInfo: {
    marginLeft: 15,
    flex: 1,
  },
  headerUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerStatus: {
    fontSize: 12,
    color: '#10b981',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#ffffff',
  },
  otherMessageText: {
    color: '#1e293b',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  myMessageTime: {
    color: '#e0e7ff',
  },
  otherMessageTime: {
    color: '#64748b',
  },
  typingIndicator: {
    padding: 10,
    backgroundColor: '#f1f5f9',
  },
  typingText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    backgroundColor: '#f8fafc',
  },
  sendButton: {
    borderRadius: 20,
  },
});

export default ChatDetailScreen;
