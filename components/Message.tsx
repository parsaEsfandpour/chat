
import React from 'react';
import { motion } from 'framer-motion';
import type { ChatMessage } from '../types';
import { UserIcon, BotIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
  T: any;
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-1">
        <motion.div
            className="w-2 h-2 bg-gray-500 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="w-2 h-2 bg-gray-500 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
            className="w-2 h-2 bg-gray-500 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
    </div>
);

export const Message: React.FC<MessageProps> = ({ message, T }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && <BotIcon className="w-8 h-8 flex-shrink-0 mt-1" />}
      <div className={`max-w-xl w-full flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-indigo-500 text-white rounded-br-none'
              : 'bg-white dark:bg-gray-700 rounded-bl-none'
          }`}
        >
          {message.image && (
            <img src={message.image} alt="User upload" className="rounded-lg mb-2 max-w-xs" />
          )}
          <div className="prose prose-sm dark:prose-invert max-w-none break-words whitespace-pre-wrap">
            {message.text}
            {message.isStreaming && <TypingIndicator />}
          </div>
        </div>
         {message.groundingSources && message.groundingSources.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <h4 className="font-semibold mb-1">{T.chat.sources}</h4>
            <ul className="list-disc list-inside space-y-1">
              {message.groundingSources.map((source, index) => (
                <li key={index}>
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-500 dark:text-indigo-400">
                    {source.title || source.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {isUser && <UserIcon className="w-8 h-8 flex-shrink-0 mt-1" />}
    </motion.div>
  );
};
