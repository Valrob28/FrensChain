import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWallet } from '@solana/wallet-adapter-react';
import { api } from '../services/api';

interface User {
  id: string;
  walletAddress: string;
  username: string;
  isPremium: boolean;
  premiumUntil?: string;
  profileImage?: string;
  interests?: any[];
  badges?: any[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (walletAddress: string, signature: string) => Promise<void>;
  register: (username: string, interests: string[]) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { publicKey, signMessage } = useWallet();

  const isAuthenticated = !!user;

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (walletAddress: string, signature: string) => {
    try {
      setIsLoading(true);
      
      const response = await api.post('/auth/login', {
        walletAddress,
        signature
      });

      const { token, user: userData } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, interests: string[]) => {
    try {
      setIsLoading(true);
      
      if (!publicKey || !signMessage) {
        throw new Error('Wallet non connecté');
      }

      // Créer un message à signer
      const message = `FrensChain - Création de compte\nWallet: ${publicKey.toString()}\nTimestamp: ${Date.now()}`;
      const signature = await signMessage(new TextEncoder().encode(message));

      const response = await api.post('/auth/register', {
        walletAddress: publicKey.toString(),
        username,
        interests,
        signature: Array.from(signature).join(',')
      });

      const { token, user: userData } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.put('/user/profile', data);
      const updatedUser = { ...user, ...response.data };
      
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
