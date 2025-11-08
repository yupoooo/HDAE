
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { UserIcon } from './icons/Icons';
import { HealthIcon } from './icons/Icons';

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading }) => {
  const isModel = message.author === 'model';

  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center flex-shrink-0">
            <HealthIcon className="w-5 h-5" />
        </div>
      )}
      
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
          isModel
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
            : 'bg-teal-600 text-white rounded-br-none'
        }`}
      >
        {isLoading ? (
            <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
            </div>
        ) : (
             <p className="whitespace-pre-wrap">{message.text}</p>
        )}
      </div>

      {!isModel && (
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
