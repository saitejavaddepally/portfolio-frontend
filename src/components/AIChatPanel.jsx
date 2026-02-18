import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import apiClient from '../services/apiClient';
import './AIChatPanel.css';

const AIChatPanel = ({ candidateData, candidateEmail, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello! I've analyzed **${candidateData.hero?.name || 'this candidate'}**'s profile. Ask me anything about their experience, skills, or projects.` }
    ]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Focus input on mount
        inputRef.current?.focus();

        // Cleanup on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsStreaming(true);

        const assistantMessageId = Date.now();
        setMessages(prev => [...prev, { role: 'assistant', content: '', id: assistantMessageId }]);

        try {
            const token = localStorage.getItem('accessToken');
            const baseURL = apiClient.defaults.baseURL || 'http://localhost:5000/api';
            // Use fallback email if not provided prop (though it should be)
            const email = candidateEmail || candidateData?.email || '';

            if (!email) {
                throw new Error("Candidate email not found. Cannot start chat.");
            }

            const url = `${baseURL}/ai/stream?candidateEmail=${encodeURIComponent(email)}&question=${encodeURIComponent(userMessage.content)}`;

            // Cancel any existing request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'text/event-stream',
                },
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            const handleStreamUpdate = (token) => {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === 'assistant' && lastMsg.id === assistantMessageId) {
                        const currentContent = lastMsg.content;

                        // 1. Exact match (Duplicate accumulation)
                        if (token === currentContent) {
                            return newMessages;
                        }

                        // 2. Starts with current (Growing accumulation)
                        if (token.startsWith(currentContent)) {
                            // Only update if it's actually longer
                            if (token.length > currentContent.length) {
                                lastMsg.content = token;
                            }
                            return newMessages;
                        }

                        // 3. Current starts with new (Stale accumulation frame)
                        // Ignore it
                        if (currentContent.startsWith(token)) {
                            return newMessages;
                        }

                        // 4. Overlap check for Deltas (duplicate packet)
                        // If current content ends with token, it's likely a duplicate delta
                        // Be careful: "banana" + "na" -> "banana" (overlap "na")?
                        // No, duplicate delta means exact same token sent twice.
                        // "Hello " + "World"
                        // received "World" again?
                        if (token.length > 0 && currentContent.endsWith(token)) {
                            return newMessages;
                        }

                        // 5. Append (Delta)
                        lastMsg.content += token;
                    }
                    return newMessages;
                });
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Process all complete lines
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim() === '') continue;

                    // Parse SSE format (data: ...)
                    if (line.startsWith('data:')) {
                        // CRITICAL: Slice ONLY 5 chars to preserve leading space if present
                        // "data: hello" -> " hello"
                        // "data:hello" -> "hello"
                        let dataStr = line.slice(5);

                        // Remove potential trailing CR from split
                        dataStr = dataStr.replace(/\r$/, '');

                        // Check for [DONE] message (ignore whitespace)
                        if (dataStr.trim() === '[DONE]') {
                            setIsStreaming(false);
                            if (abortControllerRef.current === controller) {
                                abortControllerRef.current = null;
                            }
                            return;
                        }

                        try {
                            // Try parsing as JSON first (if backend sends {token: "..."})
                            const jsonData = JSON.parse(dataStr);
                            if (jsonData.token) {
                                handleStreamUpdate(jsonData.token);
                                continue;
                            }
                        } catch (e) {
                            // Not JSON, treat as raw text
                        }

                        // Treat as raw text/token
                        handleStreamUpdate(dataStr);
                    }
                }
            }

            setIsStreaming(false);
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
                return;
            }
            console.error("Chat Error:", error);
            setIsStreaming(false);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.role === 'assistant' && lastMsg.id === assistantMessageId) {
                    if (!lastMsg.content) {
                        lastMsg.content = `**Error:** ${error.message || "Connection failed."}`;
                    }
                }
                return newMessages;
            });
            if (abortControllerRef.current) {
                abortControllerRef.current = null;
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="ai-chat-panel">
            <div className="chat-header">
                <h3>AI Assistant</h3>
                {onClose && (
                    <button onClick={onClose} className="close-chat-btn" title="Close Chat">
                        ×
                    </button>
                )}
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.role}`}>
                        {msg.role === 'assistant' ? (
                            <div className="markdown-content">
                                {msg.content ? (
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                ) : (
                                    <div className="typing-indicator">
                                        <span>.</span><span>.</span><span>.</span>
                                    </div>
                                )}
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
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about this candidate..."
                    disabled={isStreaming}
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    className="send-btn"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    );
};

export default AIChatPanel;
