import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

const initialState: ChatState = {
  messages: [],
  connectionStatus: 'disconnected',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setConnectionStatus: (state, action: PayloadAction<ChatState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, setConnectionStatus, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;



