import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/apiClient';
import { API_BASE_URL } from '../config/api';
import './AIChatPanel.css';

/**
 * Returns a valid access token, refreshing only if it is genuinely expired.
 * Uses jwtDecode (same library as AuthContext) for reliable claim reading.
 */
const getValidToken = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token');

    try {
        const { exp } = jwtDecode(token);
        // If exp is missing or token has > 30s left, return as-is
        if (!exp || (exp * 1000) - Date.now() > 30_000) return token;
    } catch {
        // Malformed JWT — return existing token and let server decide
        return token;
    }

    // Token is expired — attempt silent refresh via apiClient (interceptors already handle this)
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const res = await apiClient.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = res.data;

    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
    apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

    return accessToken;
};

const AIChatPanel = ({ candidateData, candidateEmail, onClose }) => {

    const defaultGreeting = {
        role: 'assistant',
        content: `Hello! I've analyzed **${candidateData?.hero?.name || 'this candidate'}**'s profile.\n\nAsk me anything about their experience, skills, or projects.`
    };

    const [messages, setMessages] = useState([defaultGreeting]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Fetch chat history on mount — uses apiClient (handles token + refresh automatically)
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const payload = JSON.parse(atob(token.split('.')[1]));
                const recruiterEmail = payload.sub || '';

                const email = candidateEmail || candidateData?.email;

                const res = await apiClient.get(
                    `/ai/history?candidateEmail=${encodeURIComponent(email)}&recruiterEmail=${encodeURIComponent(recruiterEmail)}`
                );

                const history = res.data;
                if (Array.isArray(history) && history.length > 0) {
                    setMessages(history.map(h => ({ role: h.role, content: h.content })));
                }
                // If empty array, keep the default greeting
            } catch (e) {
                console.warn('Could not load chat history:', e);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        loadHistory();
    }, []);

    // Smooth scroll when a new message bubble is added; instant scroll during streaming
    const prevLengthRef = useRef(messages.length);
    useEffect(() => {
        const newLength = messages.length;
        if (newLength !== prevLengthRef.current) {
            // New message added — smooth scroll
            prevLengthRef.current = newLength;
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else if (isStreaming) {
            // Content updating during stream — instant scroll (no shake)
            messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
        }
    }, [messages, isStreaming]);

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
            // Ensure we have a fresh, valid token before opening the SSE stream
            const token = await getValidToken();
            const email = candidateEmail || candidateData?.email;

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const response = await fetch(
                `${API_BASE_URL}/ai/stream?candidateEmail=${encodeURIComponent(email)}&question=${encodeURIComponent(userMessage.content)}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'text/event-stream'
                    },
                    signal: controller.signal
                }
            );

            if (!response.ok) {
                if (response.status === 403) throw new Error('FORBIDDEN');
                if (response.status === 401) throw new Error('UNAUTHORIZED');
                throw new Error('Streaming failed');
            }

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
                    if (!line.startsWith('data:')) continue;

                    // Preserve leading space: "data: hello" -> " hello", "data:hello" -> "hello"
                    let chunk = line.slice(5).replace(/\r$/, '');

                    if (chunk.trim() === '[DONE]') {
                        setIsStreaming(false);
                        return;
                    }

                    // Empty data: lines represent a newline in the stream content
                    // e.g. the \n between "**Heading:**\n- list item" comes as an empty "data:" line
                    if (chunk === '') {
                        accumulated += '\n';
                    } else {
                        accumulated += chunk;
                    }

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
            if (err.name === 'AbortError') {
                setIsStreaming(false);
                return;
            }
            setIsStreaming(false);
            const errMsg =
                err.message === 'FORBIDDEN' ? '🔒 Access denied. You don\'t have permission to use the AI assistant.' :
                    err.message === 'UNAUTHORIZED' ? '🔑 Session expired. Please refresh the page and log in again.' :
                        '⚠️ Unable to retrieve response. Please try again.';
            setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === 'assistant') {
                    last.content = errMsg;
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
            // Normalize line endings
            .replace(/\r\n/g, '\n')
            // Collapse whitespace-only lines
            .replace(/\n[ \t]+\n/g, '\n\n')
            // Collapse 3+ newlines to max 2
            .replace(/\n{3,}/g, '\n\n')
            // Remove stray lone asterisks (keep **bold**)
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
                {isLoadingHistory ? (
                    <div className="chat-bubble assistant">
                        <div className="markdown-content">Loading history...</div>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className={`chat-bubble ${msg.role}`}>
                            {msg.role === 'assistant' ? (
                                <div className="markdown-content">
                                    {msg.content ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {formatContent(msg.content)}
                                        </ReactMarkdown>
                                    ) : (
                                        <div className="typing-indicator">
                                            <span></span><span></span><span></span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about this candidate..."
                    disabled={isStreaming || isLoadingHistory}
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