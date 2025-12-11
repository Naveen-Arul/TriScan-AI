import { create } from 'zustand';
import { chatApi } from '@/api';

interface Chat {
  _id: string;
  chatId: string;
  userId: string;
  mode: 'ocr' | 'web' | 'compare';
  preview: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  history: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  error: string | null;
  
  setHistory: (history: Chat[]) => void;
  setCurrentChatId: (chatId: string | null) => void;
  refreshHistory: () => Promise<void>;
  createNewChat: (mode: 'ocr' | 'web' | 'compare') => Promise<Chat>;
  getChatById: (chatId: string) => Chat | undefined;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  history: [],
  currentChatId: null,
  isLoading: false,
  error: null,

  setHistory: (history) => set({ history }),
  
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

  refreshHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatApi.getHistory();
      if (response.success && response.history) {
        set({ history: response.history, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to refresh chat history:', error);
    }
  },

  createNewChat: async (mode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatApi.createChat(mode);
      if (response.success && response.chat) {
        // Refresh history to include new chat
        await get().refreshHistory();
        return response.chat;
      }
      throw new Error('Failed to create chat');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  getChatById: (chatId) => {
    return get().history.find(chat => chat.chatId === chatId);
  }
}));
