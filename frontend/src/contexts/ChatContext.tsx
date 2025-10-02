import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { api } from '../services/api';

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

interface Match {
  id: string;
  otherUser: {
    id: string;
    username: string;
    profileImage?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    isFromMe: boolean;
  };
  createdAt: string;
}

interface ChatContextType {
  socket: Socket | null;
  matches: Match[];
  isLoading: boolean;
  connectSocket: () => void;
  disconnectSocket: () => void;
  joinMatch: (matchId: string) => void;
  leaveMatch: (matchId: string) => void;
  sendMessage: (matchId: string, content: string, messageType?: string) => void;
  getMessages: (matchId: string) => Promise<Message[]>;
  loadMatches: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const connectSocket = () => {
    if (socket?.connected) return;

    const newSocket = io(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connecté au serveur de chat');
    });

    newSocket.on('disconnect', () => {
      console.log('Déconnecté du serveur de chat');
    });

    newSocket.on('new_message', (message: Message) => {
      // Mettre à jour les matches avec le nouveau message
      setMatches(prev => prev.map(match => {
        if (match.id === message.matchId) {
          return {
            ...match,
            lastMessage: {
              content: message.content,
              createdAt: message.createdAt,
              isFromMe: message.senderId === match.otherUser.id
            }
          };
        }
        return match;
      }));
    });

    newSocket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      // Gérer l'indicateur de frappe
      console.log('Utilisateur en train de taper:', data);
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const joinMatch = (matchId: string) => {
    if (socket) {
      socket.emit('join_room', { matchId, userId: 'current-user-id' });
    }
  };

  const leaveMatch = (matchId: string) => {
    if (socket) {
      socket.emit('leave_room', { matchId, userId: 'current-user-id' });
    }
  };

  const sendMessage = (matchId: string, content: string, messageType: string = 'text') => {
    if (socket) {
      socket.emit('send_message', {
        matchId,
        senderId: 'current-user-id',
        content,
        messageType
      });
    }
  };

  const getMessages = async (matchId: string): Promise<Message[]> => {
    try {
      const response = await api.get(`/chat/messages/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return [];
    }
  };

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/match/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    connectSocket();
    loadMatches();

    return () => {
      disconnectSocket();
    };
  }, []);

  const value: ChatContextType = {
    socket,
    matches,
    isLoading,
    connectSocket,
    disconnectSocket,
    joinMatch,
    leaveMatch,
    sendMessage,
    getMessages,
    loadMatches
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
