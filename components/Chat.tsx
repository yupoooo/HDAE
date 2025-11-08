import React, { useState, useEffect, useRef } from 'react';
import { startChatSession } from '../services/geminiService';
import type { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';
import { MessageCircleIcon, SendIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
// FIX: Alias the imported `Chat` type to `GeminiChat` to avoid name collision with the `Chat` component.
import type { Chat as GeminiChat } from '@google/genai';

export const Chat: React.FC = () => {
  // FIX: Use the aliased `GeminiChat` type for the state.
  const [chat, setChat] = useState<GeminiChat | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // بدء جلسة الدردشة عند تحميل المكون
    const initChat = async () => {
        const chatSession = startChatSession(user?.name);
        setChat(chatSession);
        
        // الحصول على الرسالة الترحيبية الأولى
        try {
            // إرسال رسالة أولية لبدء الحوار والحصول على ترحيب النموذج
            const result = await chatSession.sendMessage({ message: "مرحباً" });
            const responseText = result.text;
            setMessages([{ author: 'model', text: responseText }]);
        } catch (error) {
            console.error("Failed to get initial message:", error);
            setMessages([{ author: 'model', text: `أهلاً بك يا ${user?.name || 'صديقي'}! كيف يمكنني مساعدتك اليوم؟` }]);
        } finally {
            setIsLoading(false);
        }
    };
    if (user) {
        initChat();
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chat || isLoading) return;

    const userMessage: ChatMessageType = { author: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await chat.sendMessageStream({ message: userMessage.text });
      
      let text = '';
      let firstChunk = true;
      for await (const chunk of result) {
        text += chunk.text;
        // تحديث تدريجي للرسالة
         setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.author === 'model' && !firstChunk) {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { ...lastMessage, text: text };
                return newMessages;
            } else {
                 firstChunk = false;
                 return [...prev, { author: 'model', text: text }];
            }
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessageType = { author: 'model', text: "عذراً، حدث خطأ ما. هل يمكنك المحاولة مرة أخرى؟" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <MessageCircleIcon className="w-6 h-6 ml-3 text-teal-500" />
          الدردشة مع رفيقك الصحي
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          هنا للاستماع والدعم. كيف تشعر اليوم؟
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
         {isLoading && messages[messages.length - 1]?.author === 'user' && (
            <ChatMessage message={{ author: 'model', text: ''}} isLoading={true} />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 disabled:bg-gray-200"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-teal-600 text-white rounded-full p-3 hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
