
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ChatMessage, ChatMode } from '../types';
import { generateChatStream } from '../services/geminiService';
import { Message } from './Message';
import { PaperclipIcon, SendIcon } from './Icons';

export const ChatView: React.FC<{ T: any }> = ({ T }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('pro');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: imagePreview || undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    const currentImageFile = imageFile;

    setInput('');
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";

    const modelMessageId = (Date.now() + 1).toString();
    const modelMessage: ChatMessage = {
      id: modelMessageId,
      role: 'model',
      text: '',
      isStreaming: true,
    };
    setMessages(prev => [...prev, modelMessage]);

    try {
      const stream = await generateChatStream({ prompt: currentInput, image: currentImageFile, mode: chatMode });
      
      let text = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if(chunkText) {
          text += chunkText;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === modelMessageId ? { ...msg, text, isStreaming: true } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === modelMessageId ? { ...msg, text: 'An error occurred. Please try again.', isStreaming: false } : msg
        )
      );
    } finally {
      setIsLoading(false);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === modelMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto pr-2">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 animate-pulse"></div>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{T.appName}</h2>
                <p>{T.chat.placeholder}</p>
            </div>
        )}
        {messages.map(msg => (
          <Message key={msg.id} message={msg} T={T} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        <form onSubmit={handleSendMessage} className="relative">
          {imagePreview && (
            <div className="absolute bottom-full mb-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
              <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >&times;</button>
            </div>
          )}
          <div className="flex items-center p-2 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-transparent focus-within:border-purple-500 transition-colors">
            <div className="relative group">
                <select 
                    value={chatMode} 
                    onChange={e => setChatMode(e.target.value as ChatMode)}
                    className="appearance-none bg-transparent text-sm font-medium p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:outline-none"
                    disabled={isLoading}
                >
                    <option value="fast">{T.chat.fast}</option>
                    <option value="pro">{T.chat.pro}</option>
                    <option value="thinking">{T.chat.thinking}</option>
                </select>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 rounded-full"
              aria-label={T.chat.uploadImage}
            >
              <PaperclipIcon />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { handleSendMessage(e); e.preventDefault(); } }}
              placeholder={T.chat.placeholder}
              className="flex-1 bg-transparent px-4 py-2 resize-none focus:outline-none max-h-40"
              rows={1}
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={isLoading || (!input.trim() && !imageFile)}
              className="p-3 rounded-full bg-purple-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.95 }}
            >
              <SendIcon />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};
