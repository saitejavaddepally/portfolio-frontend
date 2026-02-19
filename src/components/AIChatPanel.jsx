import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import apiClient from '../services/apiClient';
import './AIChatPanel.css';

const AIChatPanel = ({ candidateData, candidateEmail, onClose }) => {

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hello! I've analyzed **${candidateData?.hero?.name || 'this candidate'}**'s profile.\n\Ask me anything about their experience, skills, or projects.`
        }
    ]);

    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
        return () => abortControllerRef.current?.abort();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsStreaming(true);

        const assistantId = Date.now();
        setMessages(prev => [...prev, { role: 'assistant', content: '', id: assistantId }]);

        try {
            const token = localStorage.getItem('accessToken');
            const baseURL = apiClient.defaults.baseURL || 'http://localhost:5000/api';
            const email = candidateEmail || candidateData?.email;

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const response = await fetch(
                `${baseURL}/ai/stream?candidateEmail=${encodeURIComponent(email)}&question=${encodeURIComponent(userMessage.content)}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'text/event-stream'
                    },
                    signal: controller.signal
                }
            );

            if (!response.ok) throw new Error('Streaming failed');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let accumulated = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {

                    console.log(line);

                    if (!line.startsWith('data:')) continue;

                    // Preserve leading space if any
                    // "data: hello" -> " hello"
                    // "data:hello" -> "hello"
                    let chunk = line.slice(5).replace(/\r$/, '');

                    if (chunk.trim() === '[DONE]') {
                        setIsStreaming(false);
                        return;
                    }

                    // Append exactly as received
                    accumulated += chunk;

                    setMessages(prev => {
                        const updated = [...prev];
                        const last = updated[updated.length - 1];
                        if (last.id === assistantId) {
                            last.content = accumulated;
                        }
                        return updated;
                    });
                }
            }

            setIsStreaming(false);

        } catch (err) {
            setIsStreaming(false);
            setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === 'assistant') {
                    last.content = '⚠️ Unable to retrieve response.';
                }
                return updated;
            });
        }
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatContent = (text) => {
        if (!text) return '';

        return text
            // 1. Normalize line endings
            .replace(/\r\n/g, '\n')

            // 2. Collapse any line that is only whitespace into empty string
            .replace(/\n[ \t]+\n/g, '\n\n')

            // 3. Collapse 3+ consecutive newlines into max 2
            .replace(/\n{3,}/g, '\n\n')

            // 4. Remove stray lone asterisks (keep **bold**)
            .replace(/(?<!\*)\*(?!\*|\s)/g, '')

            .trim();
    };

    return (
        <div className="ai-chat-panel">
            <div className="chat-header">
                <h3>AI Assistant</h3>
                {onClose && (
                    <button onClick={onClose} className="close-chat-btn">×</button>
                )}
            </div>

            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.role}`}>
                        {msg.role === 'assistant' ? (
                            <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {formatContent(msg.content)}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            msg.content
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about this candidate..."
                    disabled={isStreaming}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    className="send-btn"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default AIChatPanel;