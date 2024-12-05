import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message, Profile } from '../types';
import { clsx } from 'clsx';
import { API_URL } from '../config/api';
import { useTypewriter } from '../hooks/useTypewriter';

interface ChatProps {
  profile: Profile;
}

export function Chat({ profile }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId] = useState(() => 
    'chat_' + Math.random().toString(36).substr(2, 9)
  );
  
  // Get the latest assistant message
  const latestAssistantMessage = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content || '';
  const { displayedText, isTyping } = useTypewriter(latestAssistantMessage, 30);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          conversation_id: conversationId 
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      const errorMessage: Message = { 
        role: 'assistant', 
        content: error instanceof Error ? error.message : 'An error occurred'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#eeece2]">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx(
              'flex items-start gap-3',
              message.role === 'assistant' 
                ? 'flex-row' 
                : 'flex-row-reverse justify-start ml-auto'
            )}
          >
            {message.role === 'assistant' && (
              <img
                src={profile.image}
                alt="Assistant"
                className="w-6 h-6 rounded-full flex-shrink-0 mt-1"
              />
            )}
            <div
              className={clsx(
                'p-3 rounded-2xl font-[var(--font-styrene-b)] max-w-[80%]',
                message.role === 'assistant' 
                  ? 'bg-[#eeece2]' 
                  : 'bg-[#e8e5d8]'
              )}
            >
              <ReactMarkdown 
                className="prose max-w-none prose-sm"
                components={{
                  a: ({node, ...props}) => (
                    <a 
                      {...props} 
                      className="underline text-[#bd5d3a] hover:text-[#a54d2d]"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {message.role === 'assistant' 
                  ? (message === messages[messages.length - 1] ? displayedText : message.content)
                  : message.content
                }
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
            <img
              src={profile.image}
              alt="Assistant"
              className="w-6 h-6 rounded-full flex-shrink-0"
            />
            <div className="p-3 rounded-2xl bg-[#e8e5d8] font-[var(--font-styrene-b)]">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={clsx(
        "transition-opacity duration-[2000ms] ease-in-out",
        messages.length === 0 ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        <div className="px-4 py-2 border-t border-[#e8e5d8] bg-[#eeece2]">
          <div className="text-sm text-gray-500 mb-2">
            <span className="font-medium">Try asking:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {["What projects have you worked on recently?", "Tell me about yourself.", "What technologies are you familiar with?"].map((question) => (
                <button
                  key={question}
                  onClick={() => {
                    const userMessage: Message = { role: 'user', content: question };
                    setMessages(prev => [...prev, userMessage]);
                    setIsLoading(true);
                    
                    fetch(`${API_URL}/api/chat`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        message: question,
                        conversation_id: conversationId 
                      }),
                    })
                      .then(response => response.json())
                      .then(data => {
                        const assistantMessage: Message = { role: 'assistant', content: data.response };
                        setMessages(prev => [...prev, assistantMessage]);
                      })
                      .catch(error => console.error('Error:', error))
                      .finally(() => setIsLoading(false));
                  }}
                  className="text-[#bd5d3a] hover:text-[#a54d2d] bg-[#e8e5d8] px-3 py-1 rounded-full text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-[#e8e5d8] bg-[#eeece2]">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Jakhongir..."
            className="flex-1 p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#bd5d3a] font-[var(--font-styrene-b)] text-[#3d3929]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#bd5d3a] text-white p-2 rounded-2xl hover:bg-[#a54d2d] disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-2 italic">*The first message may take up to one minute.</p>
      </form>
    </div>
  );
}