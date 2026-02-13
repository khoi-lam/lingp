import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../config';
import './ChatBubble.css';

const ChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            content: 'Xin chào! 👋 Tôi là trợ lý sách của Bookstore. Bạn muốn tìm sách gì hôm nay?',
            books: []
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            fetchSuggestions();
        }
    }, [isOpen]);

    const fetchSuggestions = async () => {
        try {
            const response = await api.get('/chat/suggestions');
            if (response.data.success) {
                setSuggestions(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSendMessage = async (messageText = inputValue) => {
        if (!messageText.trim() || isLoading) return;

        // Add user message
        const userMessage = {
            type: 'user',
            content: messageText.trim(),
            books: []
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await api.post('/chat', { message: messageText.trim() });

            if (response.data.success) {
                const aiMessage = {
                    type: 'ai',
                    content: response.data.data.response,
                    books: response.data.data.books || []
                };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                type: 'ai',
                content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
                books: []
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSendMessage(suggestion);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const formatMessage = (text) => {
        if (!text) return null;

        // Split text into lines to handle lists and paragraphs
        const lines = text.split('\n');

        return lines.map((line, i) => {
            // Handle Bold: **text**
            let formattedLine = line;
            const boldRegex = /\*\*(.*?)\*\*/g;
            let parts = [];
            let lastIdx = 0;
            let match;

            while ((match = boldRegex.exec(line)) !== null) {
                // Add text before bold
                if (match.index > lastIdx) {
                    parts.push(line.substring(lastIdx, match.index));
                }
                // Add bold text
                parts.push(<strong key={`${i}-${match.index}`}>{match[1]}</strong>);
                lastIdx = boldRegex.lastIndex;
            }

            // Add remaining text
            if (lastIdx < line.length) {
                parts.push(line.substring(lastIdx));
            }

            // If the line was empty, it was a paragraph break
            if (line.trim() === '') {
                return <br key={i} />;
            }

            return (
                <div key={i} className="message-line">
                    {parts.length > 0 ? parts : line}
                </div>
            );
        });
    };

    return (
        <div className="chat-bubble-container">
            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="header-info">
                            <h3>Trợ lý Sách</h3>
                            <span className="status">Online</span>
                        </div>
                        <button className="chat-close-btn" onClick={toggleChat}>
                            ✕
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                {msg.type === 'ai' && <div className="message-avatar">🤖</div>}
                                <div className="message-content">
                                    <div className="text-wrapper">
                                        {formatMessage(msg.content)}
                                    </div>
                                    {msg.books && msg.books.length > 0 && (
                                        <div className="book-suggestions">
                                            {msg.books.map((book) => (
                                                <Link
                                                    key={book._id}
                                                    to={`/product/${book._id}`}
                                                    className="book-suggestion-card"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <img
                                                        src={getImageUrl(book.image)}
                                                        alt={book.title}
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/60x80?text=No+Image';
                                                        }}
                                                    />
                                                    <div className="book-info">
                                                        <span className="book-title">{book.title}</span>
                                                        <span className="book-author">{book.author}</span>
                                                        {book.description && (
                                                            <span className="book-description">{book.description}</span>
                                                        )}
                                                        <span className="book-price">{book.priceFormatted}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message ai">
                                <div className="message-avatar">🤖</div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick suggestions */}
                    {messages.length === 1 && suggestions.length > 0 && (
                        <div className="chat-suggestions">
                            {suggestions.slice(0, 3).map((suggestion, index) => (
                                <button
                                    key={index}
                                    className="suggestion-btn"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="chat-input-container">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Hỏi về sách..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            className="send-btn"
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button className={`chat-bubble-btn ${isOpen ? 'active' : ''}`} onClick={toggleChat}>
                {isOpen ? '✕' : '💬'}
            </button>
        </div>
    );
};

export default ChatBubble;
