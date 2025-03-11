import { useState, useRef, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000/api/chat";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! How can I help?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(BACKEND_URL, { message: input });

      // Extracting plain text response
      const botReply = response.data.reply?.replace(/[*_`]/g, "").trim() || "I couldn't understand that.";

      setTimeout(() => {
        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
        setLoading(false);
      }, 500); // Small delay to show typing indicator
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "Error connecting to AI. Please try again later.", sender: "bot" }]);
        setLoading(false);
      }, 500);
    }
  };

  const resetChat = () => {
    setMessages([{ text: "Hello! How can I help?", sender: "bot" }]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Icon */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "❌" : "💬"}
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className="w-100  md:w-150 bg-white shadow-2xl rounded-lg overflow-hidden fixed bottom-20 right-5 border border-gray-200 flex flex-col transition-all duration-300 max-h-96 h-125">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">AI Assistant</h3>
            <div className="flex">
              <button onClick={resetChat} className="mr-2 text-white/80 hover:text-white" aria-label="Reset chat">
                🔄
              </button>
              <button onClick={toggleChat} className="text-white/80 hover:text-white" aria-label="Close chat">
                ❌
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 max-w-3/4 ${msg.sender === "user" ? "ml-auto" : "mr-auto"}`}>
                <div className={`p-3 rounded-lg ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-sm">Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white flex">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type a message..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || input.trim() === ""}
              className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📩
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
