import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = '/api/proxy';

function App() {
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setMessages(prev => [...prev, { role: 'assistant', content: '', loading: true }]);
 // asdf
    try {
      console.log('Sending request to:', API_URL);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input
        }),
        mode: 'cors',
        credentials: 'omit'
      });
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.content += data.message;
                lastMessage.loading = false;
                return newMessages;
              });
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

    } catch (error) {
      console.error('Error details:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.content = `Error: ${error.message}. Please try again.`;
        lastMessage.loading = false;
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen flex-col">
      <div className="grid-lines"></div>
      <div className="background-animation">
        <div className="moving-line"></div>
        <div className="moving-line"></div>
        <div className="moving-line"></div>
      </div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="title-bar">
        Llama 3.2 running on Oracle
      </div>
      <div className="messages-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
              {message.loading && (
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
            
      <div className="input-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className={isLoading ? 'loading' : ''} disabled={isLoading}>
            <span>Send</span>
            {isLoading && (
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;